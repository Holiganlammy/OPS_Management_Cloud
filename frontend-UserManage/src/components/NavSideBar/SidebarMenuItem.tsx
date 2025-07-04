import Link from "next/link"
import { useState } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import clsx from "clsx"
import { MenuItem } from "@/type/buildMenuTree"

interface SidebarMenuItemProps {
  item: MenuItem
  activePath: string
  toggleSidebar?: () => void
}

export const SidebarMenuItem = ({
  item,
  activePath,
  toggleSidebar,
}: SidebarMenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = item.path === activePath

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen)
    } else {
      toggleSidebar?.()
    }
  }

  return (
    <div className="ml-1">
      <div
        onClick={handleClick}
        className={clsx(
          "flex items-center justify-between px-3 py-1.5 text-sm rounded-md cursor-pointer transition",
          isActive
            ? "bg-muted text-white font-semibold"
            : "hover:bg-blue-50 hover:text-blue-500"
        )}
      >
        <div className="flex items-center gap-2 w-full">
          {hasChildren &&
            (isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            ))}

          {item.path ? (
            <Link
              href={item.path}
              className="w-full"
              onClick={(e) => {
                e.stopPropagation()
                toggleSidebar?.()
              }}
            >
              {item.name}
              {item.badge && (
                <span className="bg-green-600 text-xs text-white rounded px-1 py-0.5 ml-2">
                  {item.badge}
                </span>
              )}
            </Link>
          ) : (
            <span>{item.name}</span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 border-l border-muted pl-2"
          >
            {(item.children ?? [])
              .sort((a, b) => a.order_no - b.order_no)
              .map((child) => (
                <SidebarMenuItem
                  key={child.id}
                  item={child}
                  toggleSidebar={toggleSidebar}
                  activePath={activePath}
                />
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
