"use client";
import { useSession } from "next-auth/react";
import { fetchHistoryAssets } from "./service/fetchHistoryAssets"; // import function ใหม่
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import PageLoading from "@/components/PageLoading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/breadcrumb";
import { Download, RefreshCw } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import HistoryAssetsTable from "./components/HistoryAssets/HistoryAssetsTable/AssetsTable";
import HistoryFilterForm from "./components/HistoryAssets/HistoryFilterForm";

export default function HistoryAssets() {
  const { data: session, status } = useSession({
  required: false,
});
  const searchParams = useSearchParams();
  const nac_type = searchParams.get("type") || "user";

  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [assets, setAssets] = useState<HistoryAssetType[]>([]);
  const [typeGroup, setTypeGroup] = useState<Assets_TypeGroup[]>([]);
  const [typeString, setTypeString] = useState<string | null>('PTEC');
  const [allAssets, setAllAssets] = useState<HistoryAssetType[]>([]);
  const [filters, setFilters] = useState<setFiltersType>({
    nac_code: [],
    nacdtl_assetsCode: [],
    name: [],
    source_approve_userid: [],
    });
    const handleFiltersChange = (newFilters: {
        nac_code?: string[] | undefined;
        nacdtl_assetsCode?: string[] | undefined;
        source_approve_userid?: string[] | undefined;
        name?: string[] | undefined;
    }) => {
    setFilters({
        nac_code: newFilters.nac_code || [],
        nacdtl_assetsCode: newFilters.nacdtl_assetsCode || [],
        name: newFilters.name || [],
        source_approve_userid: newFilters.source_approve_userid || [],
    });
    };
    const fetchHistoryAssetsData = useCallback(async () => {
    if (!session?.user?.UserCode) return;

    const fetchedAssets = await fetchHistoryAssets(session.user.UserCode);
    setAssets(fetchedAssets);        // สำหรับ Filter dropdown
    setAllAssets(fetchedAssets);     // สำหรับ DataTable filtering
    setIsChecking(false);
    }, [session?.user?.UserCode]);

  useEffect(() => {
    fetchHistoryAssetsData();
  }, [fetchHistoryAssetsData]);

    const filteredAssets = useMemo(() => {
    return allAssets.filter((asset) => {
        const matchNACCode = filters.nac_code?.length
        ? filters.nac_code.includes(asset.nac_code)
        : true;

        const matchAssetCode = filters.nacdtl_assetsCode?.length
        ? filters.nacdtl_assetsCode.includes(asset.nacdtl_assetsCode)
        : true;

        const matchAssetName = filters.name?.length
        ? filters.name.includes(asset.name)
        : true;

        const matchApprover = filters.source_approve_userid?.length
        ? filters.source_approve_userid.includes(asset.source_approve_userid)
        : true;

        return matchNACCode && matchAssetCode && matchAssetName && matchApprover;
    });
    }, [allAssets, filters]);
    
  if (isChecking) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-12">
      <div className="mx-auto px-4 py-8 space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-primary dark:text-white">
                  History Asset All
                </CardTitle>
                <CardDescription>
                  Manage and monitor all assets counted in your system
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm cursor-pointer"
                  // onClick={() => exportToExcel(filteredAssets)}
                >
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>

                <Button
                  className="text-xs sm:text-sm cursor-pointer"
                  variant="outline"
                  size="sm"
                  onClick={fetchHistoryAssetsData}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                  <HistoryFilterForm
                      filters={filters}
                      filteredAssets={assets}
                      onFiltersChange={handleFiltersChange}
                  />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex flex-wrap gap-2 justify-start">
                <RadioGroup
                  value={typeString ?? ""}
                  onValueChange={(value) => setTypeString(value)}
                  className="flex flex-wrap gap-3"
                >
                  {typeGroup.map((type) => (
                    <div key={type.typeGroupID} className="flex items-center gap-2">
                      <RadioGroupItem value={type.typeCode} id={`radio-${type.typeCode}`} />
                      <Label htmlFor={`radio-${type.typeCode}`} className="px-2">
                        {type.typeCode} : {type.typeName}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <HistoryAssetsTable
                data={filteredAssets}
                fetchHistoryAssets={fetchHistoryAssetsData}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
