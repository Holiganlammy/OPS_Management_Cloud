"use client"
import Link from "next/link"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon, LockKeyholeOpen, MenuIcon, XIcon } from "lucide-react"
import { useState } from "react";
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
import {
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useSession, signOut } from 'next-auth/react';

export default function SiteHeader() {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <>
      {/* Header */}
      <div className="w-full h-[50px] shadow-md z-50 fixed flex items-center bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {/* Hamburger Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="ml-4 p-2"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>

        <span className="flex items-center px-2">
          <Link
            href="/"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            User Manage
          </Link>
        </span>

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="ml-auto flex items-center gap-2 sm:gap-3 pr-2 sm:pr-4 mr-2 rounded-md px-2 sm:px-3 py-1 transition cursor-pointer">
              <div className="hidden sm:flex flex-col items-end min-w-0">
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px] lg:max-w-[160px]">
                  {`${session?.user.UserCode}` || "User visitor"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] lg:max-w-[160px]">
                  {`${session?.user.fristName} ${session?.user.lastName}` || "m@example.com"}
                </span>
              </div>
              <Avatar className="size-8 sm:size-9">
                <AvatarImage src={session?.user.img_profile} alt="User Avatar" />
              </Avatar>
              {/* Three dots menu icon - แสดงเฉพาะในมือถือ */}
              <div className="flex sm:hidden items-center justify-center w-6 h-6">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-52 sm:w-56" align="end">
            <DropdownMenuLabel className="pb-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {/* {user?.user.name || "shadcn"} */}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {`${session?.user.Email}` || "m@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex items-center">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </div>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <div className="flex items-center">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </div>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <div className="flex items-center">
                  {/* <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg> */}
                  <LockKeyholeOpen className="mr-2 h-4 w-4" />
                  Change Password
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400">
              <div className="flex items-center">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log out
              </div>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-white/20 dark:bg-black/20 z-40 transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="p-2"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className="p-4 space-y-4">
          {/* Home Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Home
            </h3>
            <div className="space-y-1">
              <Link
                href="/docs"
                className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={toggleSidebar}
              >
                Introduction
              </Link>
              <Link
                href="/docs/installation"
                className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={toggleSidebar}
              >
                Installation
              </Link>
              <Link
                href="/docs/primitives/typography"
                className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={toggleSidebar}
              >
                Typography
              </Link>
            </div>
          </div>


          {/* Status Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Status
            </h3>
            <div className="space-y-1">
              <Link
                href="#"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={toggleSidebar}
              >
                <CircleHelpIcon className="h-4 w-4" />
                Backlog
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={toggleSidebar}
              >
                <CircleIcon className="h-4 w-4" />
                To Do
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={toggleSidebar}
              >
                <CircleCheckIcon className="h-4 w-4" />
                Done
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}