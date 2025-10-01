"use client"
import * as React from "react"
import {
   ColumnDef,
   ColumnFiltersState,
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   SortingState,
   useReactTable,
   VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
   ChevronLeft,
   ChevronRight,
   ChevronsLeft,
   ChevronsRight,
} from "lucide-react"
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
   columns: ColumnDef<TData, TValue>[]
   data: TData[]
   searchKey?: string
   searchKeys?: string[]
   searchPlaceholder?: string
   pagination?: {
      pageIndex: number
      pageSize: number
   }
   onPageChange?: (newPage: number) => void
   onPageSizeChange?: (newSize: number) => void
   Loading?: boolean
}

export function DataTable<TData, TValue>({
   columns,
   data,
   searchKey,
   searchKeys,
   searchPlaceholder = "Search...",
   pagination,
   onPageChange,
   onPageSizeChange,
   Loading
}: DataTableProps<TData, TValue>) {
   const [sorting, setSorting] = React.useState<SortingState>([])
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
   const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
   const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
   const [globalFilter, setGlobalFilter] = React.useState("")

   // Internal pagination state as fallback
   const [internalPagination, setInternalPagination] = React.useState({
      pageIndex: 0,
      pageSize: 20,
   });

   const currentPagination = pagination ?? internalPagination;

   const finalSearchKeys = searchKeys || (searchKey ? [searchKey] : [])

   const table = useReactTable({
      data,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      onGlobalFilterChange: setGlobalFilter,
      onPaginationChange: (updaterOrValue) => {
         if (pagination && onPageChange && onPageSizeChange) {
            // External pagination control
            if (typeof updaterOrValue === 'function') {
               const newPagination = updaterOrValue(currentPagination);
               if (newPagination.pageIndex !== currentPagination.pageIndex) {
                  onPageChange(newPagination.pageIndex);
               }
               if (newPagination.pageSize !== currentPagination.pageSize) {
                  onPageSizeChange(newPagination.pageSize);
               }
            } else {
               if (updaterOrValue.pageIndex !== currentPagination.pageIndex) {
                  onPageChange(updaterOrValue.pageIndex);
               }
               if (updaterOrValue.pageSize !== currentPagination.pageSize) {
                  onPageSizeChange(updaterOrValue.pageSize);
               }
            }
         } else {
            // Internal pagination control
            setInternalPagination(prev => {
               if (typeof updaterOrValue === 'function') {
                  return updaterOrValue(prev);
               }
               return updaterOrValue;
            });
         }
      },
      autoResetPageIndex: false,
      globalFilterFn: (row, columnId, filterValue) => {
         if (!filterValue || finalSearchKeys.length === 0) return true
         const searchValue = filterValue.toLowerCase()

         return finalSearchKeys.some(key => {
            const cellValue = row.getValue(key)
            return cellValue?.toString().toLowerCase().includes(searchValue)
         })
      },
      state: {
         sorting,
         columnFilters,
         columnVisibility,
         rowSelection,
         globalFilter,
         pagination: currentPagination,
      },
   })

   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      const value = event.target.value
      table.setPageIndex(0)
      if (finalSearchKeys.length > 1) {
         setGlobalFilter(value)
      } else if (finalSearchKeys.length === 1) {
         table.getColumn(finalSearchKeys[0])?.setFilterValue(value)
      }
   }
   const handleColumnVisibilityChange = (value: boolean, columnId: string): void => {
      table.getColumn(columnId)?.toggleVisibility(!!value)
   }
   const shouldShowSearch = finalSearchKeys.length > 0

   return (
      <div className="w-full">
         <div className="flex justify-between items-center py-4">
            {shouldShowSearch && (
               <Input
                  placeholder={searchPlaceholder}
                  value={
                     finalSearchKeys.length > 1
                        ? globalFilter
                        : (table.getColumn(finalSearchKeys[0])?.getFilterValue() as string) ?? ""
                  }
                  onChange={handleSearchChange}
                  className="max-w-sm"
                  disabled={Loading}
               />
            )}
            <div className="flex items-center space-x-2">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" className="ml-auto" disabled={Loading}>
                        Show Columns <ChevronDown />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                           return (
                              <DropdownMenuCheckboxItem
                                 key={column.id}
                                 className="capitalize"
                                 checked={column.getIsVisible()}
                                 onCheckedChange={(value: boolean) =>
                                    handleColumnVisibilityChange(value, column.id)
                                 }
                              >
                                 {column.id}
                              </DropdownMenuCheckboxItem>
                           )
                        })}
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>

         <div className="relative">
            <Table>
               <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                           return (
                              <TableHead key={header.id}>
                                 {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                       header.column.columnDef.header,
                                       header.getContext()
                                    )}
                              </TableHead>
                           )
                        })}
                     </TableRow>
                  ))}
               </TableHeader>
               <TableBody>
                  {Loading ? (
                     Array.from({ length: table.getState().pagination.pageSize }).map((_, i) => (
                        <TableRow key={i}>
                           <TableCell className="py-4">
                              <div className="flex items-center space-x-3">
                                 <Skeleton className="h-10 w-10 rounded-full" />
                                 <div className="space-y-2">
                                    <Skeleton className="h-4 w-[180px]" />
                                    <Skeleton className="h-4 w-[120px]" />
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell className="py-4">
                              <Skeleton className="h-4 w-[100px]" />
                           </TableCell>
                           <TableCell className="py-4">
                              <Skeleton className="h-4 w-[200px]" />
                           </TableCell>
                           <TableCell className="py-4">
                              <Skeleton className="h-4 w-[80px]" />
                           </TableCell>
                           <TableCell className="py-4">
                              <div className="flex space-x-2">
                                 <Skeleton className="h-8 w-8" />
                                 <Skeleton className="h-8 w-8" />
                              </div>
                           </TableCell>
                        </TableRow>
                     ))
                  ) : table.getRowModel().rows?.length ? (
                     table.getRowModel().rows.map((row) => (
                        <TableRow
                           key={row.id}
                           data-state={row.getIsSelected() && "selected"}
                        >
                           {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                 {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                 )}
                              </TableCell>
                           ))}
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                           No results.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>

            {/* Overlay Loader */}
            {Loading && (
               <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
               </div>
            )}
         </div>

         <div className="sm:flex items-center justify-between px-2 pt-4">
            <div className="text-muted-foreground sm:flex-1 text-sm sm:ml-4 my-2">
               {table.getFilteredSelectedRowModel().rows.length} of{" "}
               {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="grid grid-cols-2 sm:flex items-center space-x-0 sm:space-x-6 lg:space-x-8 mr-4 gap-2 sm:gap-0">
               {/* Rows per page */}
               <div className="flex items-center space-x-2 order-1 sm:order-none">
                  <p className="text-xs sm:text-sm font-medium hidden sm:block">Rows per page</p>
                  <p className="text-xs sm:text-sm font-medium sm:hidden">Rows</p>
                  <Select
                     value={`${table.getState().pagination.pageSize}`}
                     onValueChange={(value) => {
                        table.setPageSize(Number(value))
                     }}
                     disabled={Loading}
                  >
                     <SelectTrigger className="h-8 w-full sm:w-[70px]">
                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                     </SelectTrigger>
                     <SelectContent side="top">
                        {[20, 50, 100].map((pageSize) => (
                           <SelectItem key={pageSize} value={`${pageSize}`}>
                              {pageSize}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               {/* Page info */}
               <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
               </div>

               {/* Navigation buttons */}
               <div className="flex items-center justify-center space-x-1 sm:space-x-2 col-span-2 sm:col-span-1 order-3 sm:order-none">
                  <Button
                     variant="outline"
                     size="icon"
                     className="hidden size-8 lg:flex"
                     onClick={() => table.setPageIndex(0)}
                     disabled={!table.getCanPreviousPage() || Loading}
                  >
                     <span className="sr-only">Go to first page</span>
                     <ChevronsLeft className="size-4" />
                  </Button>
                  <Button
                     variant="outline"
                     size="icon"
                     className="size-8"
                     onClick={() => table.previousPage()}
                     disabled={!table.getCanPreviousPage() || Loading}
                  >
                     <span className="sr-only">Go to previous page</span>
                     <ChevronLeft className="size-4" />
                  </Button>

                  {/* Page numbers */}
                  <div className="flex sm:hidden items-center space-x-1">
                     {(() => {
                        const currentPage = table.getState().pagination.pageIndex;
                        const totalPages = table.getPageCount();
                        const pages = [];

                        let start = Math.max(0, currentPage - 1);
                        let end = Math.min(totalPages - 1, currentPage + 1);

                        if (end - start < 2) {
                           if (start === 0) {
                              end = Math.min(totalPages - 1, start + 2);
                           } else if (end === totalPages - 1) {
                              start = Math.max(0, end - 2);
                           }
                        }

                        for (let i = start; i <= end; i++) {
                           pages.push(
                              <Button
                                 key={i}
                                 variant={i === currentPage ? "default" : "outline"}
                                 size="icon"
                                 className="size-7 text-xs"
                                 onClick={() => table.setPageIndex(i)}
                                 disabled={Loading}
                              >
                                 {i + 1}
                              </Button>
                           );
                        }

                        return pages;
                     })()}
                  </div>

                  <Button
                     variant="outline"
                     size="icon"
                     className="size-8"
                     onClick={() => table.nextPage()}
                     disabled={!table.getCanNextPage() || Loading}
                  >
                     <span className="sr-only">Go to next page</span>
                     <ChevronRight className="size-4" />
                  </Button>
                  <Button
                     variant="outline"
                     size="icon"
                     className="hidden size-8 lg:flex"
                     onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                     disabled={!table.getCanNextPage() || Loading}
                  >
                     <span className="sr-only">Go to last page</span>
                     <ChevronsRight className="size-4" />
                  </Button>
               </div>
            </div>
         </div>
      </div>
   )
}