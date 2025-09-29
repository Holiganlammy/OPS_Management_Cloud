"use client"

import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { ChevronDown, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/breadcrumb";

export const HistoryAssetColumns = (
    fetchHistoryAssets: () => void, data: HistoryAssetType[]
): ColumnDef<HistoryAssetType>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex justify-center items-center w-8">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex justify-center items-center w-8">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
            size: 40,
        },
        {
            accessorKey: "nacdtl_assetsCode",
            header: ({column}) => {
                return(
                <Button
                    className="bg-zinc-700 hover:bg-zinc-700 cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    รหัสทรัพย์สิน
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                        column.getIsSorted() === "asc" ? "rotate-180" : ""
                    }`} />
                </Button>
                )
             } ,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center items-center">
                        {row.original.nacdtl_assetsCode}
                    </div>
                );
            },
        },
        {
            accessorKey: "nacdtl_assetsName",
            header: ({column}) => {
                return(
                <Button
                    className="bg-zinc-700 hover:bg-zinc-700 cursor-pointer whitespace-nowrap px-1"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ชื่อทรัพย์สิน
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                        column.getIsSorted() === "asc" ? "rotate-180" : ""
                    }`} />
                </Button>
                )
             },
            cell: ({ row }) => {
                return <div>{row.original.nacdtl_assetsName}</div>;
            },
        },
        {
            accessorKey: "name",
            header: () => <div className="text-center whitespace-nowrap px-1">ประเภทรายการ</div>,
            cell: ({ row }) => {
                return <div>{row.original.name}</div>;
            },
        },
        {
            accessorKey: "OwnerID",
            header: ({column}) => {
                return(
                <Button
                    className="bg-zinc-700 hover:bg-zinc-700 cursor-pointer text-center whitespace-nowrap px-1"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ผู้ถือครอง
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                        column.getIsSorted() === "asc" ? "rotate-180" : ""
                    }`} />
                </Button>
                )
             },
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center items-center">
                        {row.original.OwnerID}
                    </div>
                );
            },
        },
        {
            accessorKey: "nac_code",
            header: ({column}) => {
                return(
                <Button
                    className="bg-zinc-700 hover:bg-zinc-700 cursor-pointer text-center whitespace-nowrap px-1"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    เลขที่ NAC
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                        column.getIsSorted() === "asc" ? "rotate-180" : ""
                    }`} />
                </Button>
                )
             },
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center items-center">
                        {row.original.nac_code}
                    </div>
                );
            },
        },
        {
            accessorKey: "nacdtl_date_asset",
            header: ({column}) => {
                return(
                <Button
                    className="bg-zinc-700 hover:bg-zinc-700 cursor-pointer text-center whitespace-nowrap px-1"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    วันที่ได้มา
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                        column.getIsSorted() === "asc" ? "rotate-180" : ""
                    }`} />
                </Button>
                )
             },
            cell: ({ row }) => {
                const date = dayjs(row.original.nacdtl_date_asset).format("DD/MM/YYYY");
                return (
                    <div className="flex justify-center items-center">
                        {date === "Invalid Date" ? "-" : date}
                    </div>
                );
            },
        },
        {
            accessorKey: "nacdtl_assetsPrice",
            header: ({column}) => {
                return(
                <Button
                    className="bg-zinc-700 hover:bg-zinc-700 cursor-pointer text-center whitespace-nowrap px-1"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ราคาทุน
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                        column.getIsSorted() === "asc" ? "rotate-180" : ""
                    }`} />
                </Button>
                )
             },
            cell: ({ row }) => {
                return (
                    <div className="text-right pr-2">
                        {row.original.nacdtl_assetsPrice?.toLocaleString() ?? "-"}
                    </div>
                );
            },
        },
        {
            accessorKey: "nacdtl_PriceSeals",
            header: () => <div className="text-center whitespace-nowrap px-1">ราคาขาย</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-right pr-2">
                        {row.original.nacdtl_PriceSeals?.toLocaleString() ?? "-"}
                    </div>
                );
            },
        },
        {
            accessorKey: "nacdtl_profit",
            header: () => <div className="text-center whitespace-nowrap px-1">กำไร</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-right pr-2">
                        {row.original.nacdtl_profit?.toLocaleString() ?? "-"}
                    </div>
                );
            },
        },
        {
            accessorKey: "create_by",
            header: () => <div className="text-center whitespace-nowrap px-1">ผู้ทำรายการ</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center items-center">
                        {row.original.create_by}
                    </div>
                );
            },
        },
        {
            accessorKey: "source_approve_userid",
            header: () => <div className="text-center whitespace-nowrap px-1">ผู้อนุมัติ</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center items-center">
                        {row.original.source_approve_userid}
                    </div>
                );
            },
        },
        {
            accessorKey: "account_aprrove_id",
            header: () => <div className="text-center whitespace-nowrap px-1">ผู้ปิดรายการ</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center items-center">
                        {row.original.account_aprrove_id}
                    </div>
                );
            },
        },
        {
            accessorKey: "update_date",
            header: ({column}) => {
                return(
                <Button
                    className="bg-zinc-700 hover:bg-zinc-700 cursor-pointer text-center whitespace-nowrap px-1"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    วันที่ปิดรายการ
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                        column.getIsSorted() === "asc" ? "rotate-180" : ""
                    }`} />
                </Button>
                )
             },
            cell: ({ row }) => {
                const date = dayjs(row.original.update_date).format("DD/MM/YYYY");
                return (
                    <div className="flex justify-center items-center">
                        {date === "Invalid Date" ? "-" : date}
                    </div>
                );
            },
        },
        {
            accessorKey: "document",
            header: () => (
                <div className="text-center whitespace-nowrap px-1">ดูเอกสาร</div>
            ),
            cell: ({ row }) => {
                return (
                <div className="flex justify-center items-center">
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        const nacCode = row.original.nac_code
                        const typeCode = row.original.nac_type
                        window.open(`/fa_control/forms?nac_type=${typeCode}&nac_code=${nacCode}`, "_blank")
                    }}
                    >
                    <FileText className="h-5 w-5 text-blue-600 hover:text-blue-800" />
                    </Button>
                </div>
                )
            },
            enableSorting: false,
            enableHiding: false,
            size: 60,
        },
    ]