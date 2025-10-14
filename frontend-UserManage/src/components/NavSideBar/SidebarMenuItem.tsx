// components/SidebarMenuItem.tsx
"use client"

import Link from "next/link"
import { JSX, useState } from "react"
import { ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface MenuItem {
  id: number;
  name: string;
  path: string;
  parent_id: number | null;
  order_no: number;
  children?: MenuItem[];
  icon?: string;
}

interface SidebarMenuItemProps {
  item: MenuItem
  activePath: string
  isCollapsed?: boolean
  level?: number
  getIcon: (iconName?: string) => JSX.Element
}

export function SidebarMenuItem({
  item,
  activePath,
  isCollapsed = false,
  level = 0,
  getIcon
}: SidebarMenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = activePath === item.path

  const content = (
    <Button
      variant="ghost"
      className={cn(
        "w-full h-9 transition-colors",
        isCollapsed ? "justify-center px-0" : "justify-start gap-2",
        isActive
          ? "bg-gray-800 text-white"
          : "text-gray-400 hover:text-white hover:bg-gray-800",
        !isCollapsed && `pl-${Math.min(4 + level * 4, 16)}`
      )}
      onClick={() => {
        if (hasChildren) {
          setIsExpanded(!isExpanded)
        }
      }}
    >
      {!isCollapsed && hasChildren && (
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            isExpanded && "rotate-90"
          )}
        />
      )}

      {/* ⭐ แสดง icon */}
      <span className="shrink-0">
        {getIcon(item.name)}
      </span>

      {!isCollapsed && (
        <span className="text-sm flex-1 text-left truncate">
          {item.name}
        </span>
      )}
    </Button>
  )

  const wrappedContent = item.path && !hasChildren
    ? <Link href={item.path}>{content}</Link>
    : content

  return (
    <div>
      {/* 🧩 แสดงเมนูหลัก หรือเมนูที่มีลูก */}
      {isCollapsed ? (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              {item.path ? <Link href={item.path}>{content}</Link> : content}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white border-gray-800">
              <p>{item.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        wrappedContent
      )}

      {/* 🧬 เมนูลูก */}
      <AnimatePresence>
        {isExpanded && hasChildren && !isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-1 mt-1">
              {item.children
                ?.sort((a, b) => a.order_no - b.order_no)
                .map((child) => (
                  <SidebarMenuItem
                    key={child.id}
                    item={child}
                    activePath={activePath}
                    isCollapsed={isCollapsed}
                    level={level + 1}
                    getIcon={getIcon}
                  />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
