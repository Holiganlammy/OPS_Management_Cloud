"use client"
import Link from "next/link"
import { LockKeyholeOpen, MenuIcon, User, XIcon } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useSession, signOut } from 'next-auth/react';
import dataConfig from "@/config/config";
import client from "@/lib/axios/interceptors";
import { buildMenuTree, MenuItem } from '@/type/buildMenuTree';
import { SidebarMenuItem } from "./SidebarMenuItem";
import clsx from "clsx";

export default function SiteHeader() {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menus, setMenu] = useState([]);
  const menuTree = useMemo(() => buildMenuTree(menus as MenuItem[]), [menus]);

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const fetchMenus = useCallback(async () => {
    try {
      const response = await client.post(`/Apps_List_Menu`, { UserID: session?.user.UserID }, {
        headers: dataConfig().header
      });
      const data = await response.data;
      if (data.length > 0) {
        setMenu(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      await fetchMenus()
    }
    checkAuth()
  }, [session])

  return (
    <>
      {/* Header */}
      <div className="w-full h-[60px] shadow-lg z-50 fixed flex items-center border-b bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 backdrop-blur-md">
        {/* Hamburger Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="ml-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 rounded-lg"
        >
          <MenuIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </Button>

        <span className="flex items-center px-4">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent hover:from-gray-900 hover:to-gray-700 dark:hover:from-white dark:hover:to-gray-200 transition-all duration-300"
          >
            Purethai Energy
          </Link>
        </span>

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="ml-auto flex items-center gap-3 pr-4 mr-4 rounded-xl px-4 py-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <div className="hidden sm:flex flex-col items-end min-w-0">
                <span className="text-sm font-semibold truncate max-w-[120px] lg:max-w-[160px] text-gray-800 dark:text-gray-200">
                  {`${session?.user.UserCode}` || "Guest"}
                </span>
              </div>
              <Avatar className="size-9 ring-2 ring-gray-200 dark:ring-gray-600 hover:ring-gray-300 dark:hover:ring-gray-500 transition-all duration-200">
                <AvatarImage src={session?.user.img_profile} alt="User Avatar" />
                <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white text-sm font-medium">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              {/* Three dots menu icon - แสดงเฉพาะในมือถือ */}
              <div className="flex sm:hidden items-center justify-center w-6 h-6">
                <svg
                  className="w-4 h-4 text-gray-600 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 shadow-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-600 rounded-xl" align="end">
            <DropdownMenuLabel className="pb-2">
              <div className="flex flex-col">
                <p className="truncate font-semibold text-gray-900 dark:text-gray-100">
                  {`${session?.user.fristName} ${session?.user.lastName}` || "-"}
                </p>
                <p className="text-gray-500 dark:text-gray-400 truncate text-xs">
                  {`${session?.user.Email}` || "m@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />

            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg mx-1">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </div>
                <DropdownMenuShortcut className="text-gray-400 dark:text-gray-500">⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg mx-1">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </div>
                <DropdownMenuShortcut className="text-gray-400 dark:text-gray-500">⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg mx-1">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <LockKeyholeOpen className="mr-3 h-4 w-4" />
                  Change Password
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />

            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 rounded-lg mx-1">
              <div className="flex items-center">
                <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log out
              </div>
              <DropdownMenuShortcut className="text-red-400 dark:text-red-500">⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md bg-black/30 dark:bg-black/50 z-40 transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-full w-80 bg-primary text-primary-foreground shadow-xs dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg"
            >
              <XIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Button>
          </div>

          {/* Sidebar Content ที่ Scroll ได้ */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {session &&
              menuTree
                .sort((a, b) => a.order_no - b.order_no)
                .map((item) => (
                  <SidebarMenuItem
                    key={item.id}
                    item={item}
                    toggleSidebar={toggleSidebar}
                    activePath={""}
                  />
                ))}
          </div>
        </div>
      </div>
    </>
  )
}