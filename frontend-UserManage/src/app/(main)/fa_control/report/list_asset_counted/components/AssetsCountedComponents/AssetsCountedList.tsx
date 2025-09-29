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
import { getAutoDataAssetCounted, getAutoData } from "../../service/documentService";
import UserTable from "../../AssetsCountedTable/AssetsCountedTable";
import FilterForm from "./FilterForm";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { exportToExcel } from "../../service/export";
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getAutoData as FetchData } from "@/app/(main)/fa_control/forms/service/faService";


export default function AssetsCountedListClient() {
  const { data: session, status } = useSession({
  required: false,
});
  const searchParams = useSearchParams();
  const nac_type = searchParams.get("type") || "user";

  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [typeGroup, setTypeGroup] = useState<Assets_TypeGroup[]>([]);
  const [listDescription, setListDescription] = useState<PeriodDescription[]>([]);
  const [typeString, setTypeString] = useState<string | null>('PTEC');
  const [assetsFetch, setAssetsFetch] = useState<CountAssetRow[]>([]);
  const [userFetch, setUserFetch] = useState<UserData[]>([]);
  const [newValue, setNewValue] = useState<string>('');
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("CountAssetRow");
      return saved
        ? JSON.parse(saved)
        : {
          Code: "",
          Name: "",
          BranchID: "",
          OwnerID: "",
          Position: "",
          typeCode: "",
          filter: "",
        };
    }
    return {
      Code: "",
      Name: "",
      BranchID: "",
      OwnerID: "",
      Position: "",
      typeCode: "",
      filter: "",
    };
  });

  const fetchAssetsCounted = useCallback(async () => {
    if (session && nac_type) {
      try {
        const dataUser = await FetchData();
        const users = dataUser?.find((d) => d.key === "users")?.data || [];
        setUserFetch(users);
        const dataOther = await getAutoData()
        setTypeGroup(dataOther?.find((d) => d.key === "typeGroup")?.data || [])
        if (newValue === '') {
          const dataNAC: PeriodDescription[] = await getAutoDataAssetCounted(newValue);
          if (nac_type === "user") {
            setListDescription(dataNAC.filter(res => {
              return res.BranchID === userFetch.find(res => res.UserCode === session?.user.UserCode)?.BranchID ||
                res.personID === userFetch.find(res => res.UserCode === session?.user.UserCode)?.UserCode ||
                res.DepCode === userFetch.find(res => res.UserCode === session?.user.UserCode)?.DepCode;
            }) || []);
          } else {
            setListDescription(dataNAC);
          }
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Error fetching NAC:", error);
        setIsChecking(false); // เพิ่มตรงนี้ด้วยเผื่อ error
      }
    }
  }, [session, nac_type, newValue]);

  useEffect(() => {
    setIsChecking(true);
    fetchAssetsCounted();
  }, [nac_type]);

  const filteredAssets = useMemo(() => {
    return assetsFetch.filter((asset) => {
      if (typeString && asset.typeCode !== typeString) return false;
      if (filters.Code && !asset.Code?.toString().toLowerCase().includes(filters.Code.toLowerCase())) return false;
      if (filters.Name && !asset.Name?.toString().toLowerCase().includes(filters.Name.toLowerCase())) return false;
      if (filters.BranchID && !asset.BranchID?.toString().toLowerCase().includes(filters.BranchID.toLowerCase())) return false;
      if (filters.OwnerID && !asset.OwnerID?.toString().toLowerCase().includes(filters.OwnerID.toLowerCase())) return false;
      if (filters.Position && !asset.Position?.toString().toLowerCase().includes(filters.Position.toLowerCase())) return false;
      if (filters.typeCode && asset.typeCode !== filters.typeCode) return false;
      if (filters.filter && filters.filter.trim()) {
        const searchTerm = filters.filter.toLowerCase();
        const searchFields = [
          asset.Code?.toString(),
          asset.Name?.toString(),
          asset.BranchID?.toString(),
          asset.OwnerID?.toString(),
          asset.Position?.toString(),
          asset.typeCode?.toString()
        ].filter(Boolean).map(field => field!.toLowerCase());
        
        const hasMatch = searchFields.some(field => field.includes(searchTerm));
        if (!hasMatch) return false;
      }
      
      return true;
    });
  }, [assetsFetch, filters, typeString]);

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    localStorage.setItem("CountAssetRow", JSON.stringify(newFilters));
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
                  Assets Counted
                </CardTitle>
                <CardDescription>
                  Manage and monitor all assets counted in your system
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-auto lg:w-[500px] justify-between"
                    >
                      {newValue
                        ? listDescription.find((framework) => framework.Description === newValue)?.Description
                        : "ค้นหาคำอธิบายรอบตรวจนับ..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto lg:w-[500px] p-0">
                    <Command>
                      <CommandInput placeholder="ค้นหาคำอธิบายรอบตรวจนับ..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No data.</CommandEmpty>
                        <CommandGroup>
                          {listDescription && listDescription.map((description) => (
                            <CommandItem
                              key={description.PeriodID}
                              value={description.Description}
                              onSelect={async (currentValue) => {
                                setNewValue(currentValue === newValue ? "" : currentValue)
                                const dataNAC: CountAssetRow[] = await getAutoDataAssetCounted(currentValue);
                                if (nac_type === "user") {
                                  setAssetsFetch(dataNAC.filter(res => res.OwnerID === session?.user.UserCode) || []);
                                } else {
                                  setAssetsFetch(dataNAC || []);
                                }
                                setOpen(false)
                              }}
                            >
                              {description.Description}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  newValue === description.Description ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm cursor-pointer"
                  onClick={() => exportToExcel(filteredAssets)}
                >
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>

                <Button
                  className="text-xs sm:text-sm cursor-pointer"
                  variant="outline"
                  size="sm"
                  onClick={fetchAssetsCounted}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <FilterForm
                  filters={filters}
                  filteredAssets={filteredAssets}
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
              <UserTable
                data={filteredAssets}
                fetchAssetsCounted={fetchAssetsCounted}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}