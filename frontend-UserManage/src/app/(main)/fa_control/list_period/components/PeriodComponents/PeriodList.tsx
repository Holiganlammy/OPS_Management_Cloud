"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
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
import { getAutoDataPeriod } from "../../service/periodService";
import UserTable from "../../PeriodTable/PeriodTable";
import FilterForm from "./FilterForm";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";


export default function PeriodListClient() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const nac_type = searchParams.get("type") || "user";

  const [isChecking, setIsChecking] = useState(true);
  const [periodFetch, setPeriodFetch] = useState<Period[]>([]);
  const [filters, setFilters] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("period_filters");
      return saved
        ? JSON.parse(saved)
        : {
          BranchID: "",
          Description: "",
          personID: "",
          DepCode: "",
          Code: "",
          filter: "",
        };
    }
    return {
      BranchID: "",
      Description: "",
      personID: "",
      DepCode: "",
      Code: "",
      filter: "",
    };
  });

  const fetchPeriod = useCallback(async () => {
    if (session) {
      try {
        const dataNAC = await getAutoDataPeriod(session.user.UserCode);
        setPeriodFetch(dataNAC?.find((d) => d.key === "period")?.data || []);

      } catch (error) {
        console.error("Error fetching NAC:", error);
      }
    }
    setIsChecking(false);
  }, [session, nac_type]);

  useEffect(() => {
    fetchPeriod();
  }, [fetchPeriod]);

  const filteredPeriod = useMemo(() => {
    return periodFetch.filter((nac) => {
      if (filters.BranchID && nac.BranchID?.toString() !== filters.BranchID) return false;
      if (filters.Description && nac.Description?.toString() !== filters.Description) return false;
      if (filters.personID && nac.personID?.toString() !== filters.personID) return false;
      if (filters.DepCode && nac.DepCode?.toString() !== filters.DepCode) return false;
      if (filters.Code && nac.Code?.toString() !== filters.Code) return false;
      return true;
    });
  }, [periodFetch, filters]);

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    localStorage.setItem("period_filters", JSON.stringify(newFilters));
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
                  Period Control
                </CardTitle>
                <CardDescription>
                  Manage and monitor all period in your system
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>

                <Button
                  className="text-xs sm:text-sm"
                  variant="outline"
                  size="sm"
                  onClick={fetchPeriod}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <FilterForm
                  filters={filters}
                  periodFetch={periodFetch}
                  onFiltersChange={handleFiltersChange}
                />
              </div>

            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <UserTable data={filteredPeriod} fetchPeriod={fetchPeriod} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}