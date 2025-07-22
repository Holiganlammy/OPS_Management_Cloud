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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import PageLoading from "@/components/PageLoading";
import { getAutoDataNAC } from "../../service/userService";
import UserTable from "../../nac_list/NacTable/NacTable";
import FilterForm from "./FilterForm";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function NacListClient() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const nac_type = searchParams.get("type") || "user";

  const [isChecking, setIsChecking] = useState(true);
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
    if (session) {
      try {
        const dataNAC = await getAutoDataNAC(session.user.UserCode);
        const list =
          nac_type === "user"
            ? dataNAC?.find((d) => d.key === "user")?.data || []
            : dataNAC?.find((d) => d.key === "admin")?.data || [];
        setNacFetch(list);
      } catch (error) {
        console.error("Error fetching NAC:", error);
      }
    }
    setIsChecking(false);
  }, [session, nac_type]);

  useEffect(() => {
    fetchNac();
  }, [fetchNac]);

  const filteredNac = useMemo(() => {
    return nacFetch.filter((nac) => {
      if (filters.nac_code && nac.nac_code?.toString() !== filters.nac_code) return false;
      if (filters.name && nac.name?.toString() !== filters.name) return false;
      if (filters.source_userid && nac.source_userid?.toString() !== filters.source_userid) return false;
      if (filters.des_userid && nac.des_userid?.toString() !== filters.des_userid) return false;
      if (filters.status_name && nac.status_name?.toString() !== filters.status_name) return false;
      return true;
    });
  }, [nacFetch, filters]);

  const handleFilterSelect = useCallback((filterType: string) => {
    setFilters((prev: FilterTypeNac) => {
      const newFilters = { ...prev, filter: filterType };
      localStorage.setItem("nac_filters", JSON.stringify(newFilters));
      return newFilters;
    });
  }, []);

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
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  FA Control Document
                </CardTitle>
                <CardDescription>
                  Manage and monitor all document in your system
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-xs sm:text-sm" asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      {filters.filter && (
                        <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                          {filters.filter === "active"
                            ? "Active"
                            : filters.filter === "inactive"
                              ? "Inactive"
                              : ""}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleFilterSelect("")}>All Users</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterSelect("active")}>Active Users</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterSelect("inactive")}>Inactive Users</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterSelect("new")}>New Users</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>

                <Button
                  className="text-xs sm:text-sm"
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
              <UserTable data={filteredNac} fetchNac={fetchNac} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}