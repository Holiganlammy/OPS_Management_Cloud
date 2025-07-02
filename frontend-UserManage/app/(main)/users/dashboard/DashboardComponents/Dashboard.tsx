// app/dashboard/DashboardClient.tsx
"use client"
import { use, useCallback, useEffect, useMemo, useState } from "react"
import UserTable from "@/app/(main)/users/dashboard/UserTable/UserTable"
import {
  Users,
  UserPlus,
  Activity,
  TrendingUp,
  Calendar,
  Bell,
  Filter,
  Download,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Signup from "@/components/SignUp/signup"
import ChartSection from "@/app/(main)/users/dashboard/DashboardComponents/Chart"
import FilterForm from "@/app/(main)/users/dashboard/DashboardComponents/FilterForm"
import router from "next/dist/shared/lib/router/router"

export default function DashboardClient() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 3 months")
  const [isChecking, setIsChecking] = useState(true)
  const periods = ["Last 3 months", "Last 30 days", "Last 7 days"]
  const [currentTime, setCurrentTime] = useState(new Date())
  const [openCreate, setOpenCreate] = useState(false)
  const [userFetch, setUserFetch] = useState<UserData[]>([])
  const [filters, setFilters] = useState({
    position: "",
    department: "",
    branch: "",
    filter: "",
  })

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/proxy/users", {
        method: "GET",
        cache: "no-store",
      })

      if (res.ok) {
        const result = await res.json()
        setUserFetch(result)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(false)
      await fetchUsers()
    }
    checkAuth()
  }, [fetchUsers, router])
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const filteredUsers = useMemo(() => {
    let filtered = userFetch;
    
    if (filters.department && filters.department.trim() !== "") {
      filtered = filtered.filter(user => {
        return user.DepID.toString() === filters.department;
      });
    }

    if (filters.position && filters.position.trim() !== "") {
      filtered = filtered.filter(user => {
        return user.PositionID.toString() === filters.position;
      });
    }
    
    if (filters.branch && filters.branch.trim() !== "") {
      filtered = filtered.filter(user => {
        return user.BranchID.toString() === filters.branch;
      });
    }
    
    if (filters.filter && filters.filter.trim() !== "") {
      filtered = filtered.filter(user => {
        switch (filters.filter) {
          case "active":
            return user.Actived === true;
          case "inactive":
            return user.Actived === false;
          case "":
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [userFetch, filters]);

  const handleFilterSelect = useCallback((filterType: string) => {
    setFilters(prev => ({ ...prev, filter: filterType }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      position: "",
      department: "",
      branch: "",
      filter: "",
    });
  }, []);

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: userFetch.length.toLocaleString(),
      changeType: "positive",
      icon: Users,
    },
    {
      title: "New Users",
      value: "142",
      change: "+8%",
      changeType: "positive",
      icon: UserPlus,
      description: "this week"
    },
    {
      title: "Active Sessions",
      value: "1,234",
      change: "-2%",
      changeType: "negative",
      icon: Activity,
      description: "currently online"
    },
    {
      title: "Growth Rate",
      value: "23.4%",
      change: "+5%",
      changeType: "positive",
      icon: TrendingUp,
      description: "monthly growth"
    }
  ]
    if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-12">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back! Here's what's happening with your users.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <span className={`text-sm font-medium ${stat.changeType === 'positive'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                    }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Section */}
        <ChartSection 
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          periods={periods}
        />

        {/* User Management Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage and monitor all users in your system
                </CardDescription>
              </div>

              <div className="space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="grid grid-cols-3 sm:flex justify-end space-x-2 space-y-3 sm:space-y-0 mr-[0px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-xs sm:text-sm" asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        {filters.filter && filters.filter !== "" && (
                          <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                            {filters.filter === "active" ? "Active" :
                              filters.filter === "inactive" ? "Inactive": ""}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleFilterSelect("")}>
                        All Users
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFilterSelect("active")}>
                        Active Users
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFilterSelect("inactive")}>
                        Inactive Users
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFilterSelect("new")}>
                        New Users
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {(filters.position || filters.department || filters.branch || filters.filter !== "") && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="text-xs sm:text-sm"
                    >
                      Clear Filters
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>

                  <Button className="text-xs sm:text-sm" variant="outline" size="sm" onClick={fetchUsers}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>

                  <Button onClick={() => setOpenCreate(true)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                  <Signup open={openCreate} onOpenChange={setOpenCreate} onUserCreated={fetchUsers} />
                </div>
                
                <FilterForm 
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="border-t border-gray-200 dark:border-gray-700">
              <UserTable data={filteredUsers} fetchUsers={fetchUsers} />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    5 new users registered today
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    12 users logged in this hour
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    3 pending user approvals
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Rate</span>
                  <span className="text-sm font-medium text-green-600">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
                  <span className="text-sm font-medium text-blue-600">12.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Retention Rate</span>
                  <span className="text-sm font-medium text-purple-600">87.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <span>System Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">API Status</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Server Load</span>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Medium
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}