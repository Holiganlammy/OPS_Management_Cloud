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
import { getAutoData } from "../list_asset_counted/service/documentService";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);


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

    setIsLoading(true);
    const fetchedAssets = await fetchHistoryAssets(session.user.UserCode);
    setAssets(fetchedAssets);        // สำหรับ Filter dropdown
    setAllAssets(fetchedAssets);     // สำหรับ DataTable filtering
    setIsChecking(false);
    setIsLoading(false);
  }, [session?.user?.UserCode]);

  useEffect(() => {
    fetchHistoryAssetsData();
  }, [fetchHistoryAssetsData]);

  const filteredAssets = useMemo(() => {
    return allAssets.filter((asset) => {

      const FilterType = typeString ? asset.typeCode === typeString : true;

      const FilterNACCode = filters.nac_code?.length
        ? filters.nac_code.includes(asset.nac_code)
        : true;

      const FilterAssetCode = filters.nacdtl_assetsCode?.length
        ? filters.nacdtl_assetsCode.includes(asset.nacdtl_assetsCode)
        : true;

      const FilterAssetName = filters.name?.length
        ? filters.name.includes(asset.name)
        : true;

      const FilterApprover = filters.source_approve_userid?.length
        ? filters.source_approve_userid.includes(asset.source_approve_userid)
        : true;

      return FilterType && FilterNACCode && FilterAssetCode && FilterAssetName && FilterApprover;
    });
  }, [allAssets, filters, typeString]);

  useEffect(() => {
    fetchHistoryAssetsData();
    (async () => {
      try {
        const dataOther = await getAutoData();
        const groupData = dataOther?.find((d) => d.key === "typeGroup")?.data || [];
        setTypeGroup(groupData);
      } catch (err) {
        console.error("Error loading typeGroup:", err);
      }
    })();
  }, [fetchHistoryAssetsData])

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
              <div className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4">
                  <Tabs value={typeString ?? ""} onValueChange={setTypeString}>
                    <TabsList className="inline-flex w-full flex-wrap gap-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-800">
                      {typeGroup.map((type) => (
                        <TabsTrigger
                          key={type.typeGroupID}
                          value={type.typeCode}
                          className={cn(
                            "flex-1 min-w-fit px-6 py-3 rounded-md text-sm font-medium transition-all duration-200",
                            "data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800",
                            "data-[state=active]:text-gray-900 dark:data-[state=active]:text-white",
                            "data-[state=active]:shadow-sm",
                            "data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400",
                            "hover:text-gray-900 dark:hover:text-gray-200",
                            "border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-700"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-500 data-[state=active]:text-primary">
                              {type.typeCode}
                            </span>
                            <span className="text-gray-300 dark:text-gray-700">|</span>
                            <span className="font-medium">{type.typeName}</span>
                          </div>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <HistoryAssetsTable
                data={filteredAssets}
                fetchHistoryAssets={fetchHistoryAssetsData}
                Loading={isLoading}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
