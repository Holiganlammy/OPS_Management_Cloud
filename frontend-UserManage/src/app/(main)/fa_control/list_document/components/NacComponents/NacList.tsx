"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageLoading from "@/components/PageLoading";
import { getAutoDataNAC, getAutoData } from "../../service/documentService";
import UserTable from "../../NacTable/NacTable";
import FilterForm from "./FilterForm";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { exportToExcel } from "../../service/export";


export default function NacListClient() {
  const { data: session, status } = useSession({
  required: false,
});
  const searchParams = useSearchParams();
  const nac_type = searchParams.get("type") || "user";

  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [typeGroup, setTypeGroup] = useState<Assets_TypeGroup[]>([]);
  const [nacStatus, setNacStatus] = useState<{ nac_status_id: number; status_name: string; }[]>([]);
  const [typeString, setTypeString] = useState<string | null>('PTEC');
  const [nacFetch, setNacFetch] = useState<List_NAC[]>([]);
  const [filters, setFilters] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nac_filters");
      return saved
        ? JSON.parse(saved)
        : {
          nac_code: "",
          name: "",
          source_userid: "",
          des_userid: "",
          status_name: "",
          filter: "",
        };
    }
    return {
      nac_code: "",
      name: "",
      source_userid: "",
      des_userid: "",
      status_name: "",
      filter: "",
    };
  });
  const fetchNac = useCallback(async () => {
    if (session && nac_type) {
      try {
        const dataOther = await getAutoData();
        setTypeGroup(dataOther?.find((d: { key: string }) => d.key === "typeGroup")?.data || []);
        setNacStatus(dataOther?.find((d: { key: string }) => d.key === "nacStatus")?.data || []);

        const dataNAC = await getAutoDataNAC(session.user.UserCode);
        const list = dataNAC?.find((d: { key: string }) => d.key === nac_type)?.data || [];
        setNacFetch(list);
      } catch (error) {
        console.error("Error fetching NAC:", error);
      } finally {
        setIsChecking(false);
      }
    }
  }, [session, nac_type]);

  useEffect(() => {
    if (!isChecking) return;
    fetchNac();
  }, [isChecking, fetchNac]);

  useEffect(() => {
    const isHardReload =
      typeof window !== "undefined" &&
      (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming)?.type === "reload";

    const cacheKey = `nac_already_loaded_${nac_type}`;
    const alreadyLoaded = sessionStorage.getItem(cacheKey);

    if (isHardReload || !alreadyLoaded) {
      // เคลียร์ cache ถ้า reload page
      if (isHardReload && session?.user?.UserCode) {
        sessionStorage.removeItem("autoData_cache");
        sessionStorage.removeItem("autoData_cache_time");
        sessionStorage.removeItem(`autoDataNAC_${session.user.UserCode}`);
        sessionStorage.removeItem(`autoDataNAC_time_${session.user.UserCode}`);
      }

      setIsChecking(true); // ✅ สั่ง fetch จริง
      sessionStorage.setItem(cacheKey, "1"); // ✅ ตั้ง flag ว่าโหลดแล้ว
    } else {
      // ถ้าเคยโหลดแล้ว และไม่ใช่ reload → ไม่ fetch ใหม่
      setIsChecking(false);
    }
  }, [session?.user?.UserCode, nac_type]);

  const filteredNac = useMemo(() => {
    return nacFetch.filter((nac) => {
      if (typeString && nac.TypeCode !== typeString) return false;
      if (filters.nac_code && nac.nac_code?.toString() !== filters.nac_code) return false;
      if (filters.name && nac.name?.toString() !== filters.name) return false;
      if (filters.source_userid && nac.source_userid?.toString() !== filters.source_userid) return false;
      if (filters.des_userid && nac.des_userid?.toString() !== filters.des_userid) return false;
      if (filters.status_name && nac.status_name?.toString() !== filters.status_name) return false;
      return true;
    });
  }, [nacFetch, filters, typeString]);

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    localStorage.setItem("nac_filters", JSON.stringify(newFilters));
  }, []);

  if (isChecking) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-12">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-primary dark:text-white">
                  FA Control Document
                </CardTitle>
                <CardDescription>
                  Manage and monitor all document in your system
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm cursor-pointer"
                  onClick={() => exportToExcel(filteredNac)}
                >
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>

                <Button
                  className="text-xs sm:text-sm cursor-pointer"
                  variant="outline"
                  size="sm"
                  onClick={fetchNac}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <FilterForm
                  filters={filters}
                  nacFetch={nacFetch}
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
              <UserTable data={filteredNac} fetchNac={fetchNac} nacStatus={nacStatus} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}