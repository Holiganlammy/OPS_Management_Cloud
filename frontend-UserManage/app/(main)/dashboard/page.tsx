"use client"
import { use, useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import UserTable from "./UserTable/UserTable"
import { isAuthenticated } from "@/lib/auth"
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
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField } from "@/components/ui/form"
import Position from "./MultiFilter/Position"
import Department from "./MultiFilter/Department"
import Branch from "./MultiFilter/Branch"

const chartData = [
  { date: "Apr 2", visitors: 1200, date_full: "April 2" },
  { date: "Apr 8", visitors: 1800, date_full: "April 8" },
  { date: "Apr 14", visitors: 1600, date_full: "April 14" },
  { date: "Apr 21", visitors: 2200, date_full: "April 21" },
  { date: "Apr 28", visitors: 1900, date_full: "April 28" },
  { date: "May 5", visitors: 2800, date_full: "May 5" },
  { date: "May 12", visitors: 2400, date_full: "May 12" },
  { date: "May 19", visitors: 2900, date_full: "May 19" },
  { date: "May 26", visitors: 2100, date_full: "May 26" },
  { date: "Jun 2", visitors: 2600, date_full: "June 2" },
  { date: "Jun 8", visitors: 2300, date_full: "June 8" },
  { date: "Jun 15", visitors: 2700, date_full: "June 15" },
  { date: "Jun 22", visitors: 2500, date_full: "June 22" },
  { date: "Jun 30", visitors: 2800, date_full: "June 30" },
]


type CustomTooltipProps = {
  active?: boolean
  payload?: Array<{
    payload: { date_full: string }
    value: number
  }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{payload[0].payload.date_full}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Visitors: <span className="font-semibold text-gray-900 dark:text-white">{payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState("Last 3 months")
  const periods = ["Last 3 months", "Last 30 days", "Last 7 days"]
  const [isChecking, setIsChecking] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [openCreate, setOpenCreate] = useState(false)
  const [userFetch, setUserFetch] = useState<UserData[]>([])

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:7777/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
    if (isAuthenticated()) {
      setIsChecking(false)
      fetchUsers()
    } else {
      router.replace("/login")
    }
  }, [router, fetchUsers])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const SelectSchema = z.object({
    position: z.string(),
    department: z.string(),
    branch: z.string(),
    filter: z.string(),
  })

  type SelectType = z.infer<typeof SelectSchema>
  const form = useForm<SelectType>({
    resolver: zodResolver(SelectSchema),
    defaultValues: {
      position: "",
      department: "",
      branch: "",
      filter: "",
    }
  });
  const [watchPosition, watchDepartment, watchBranch, watchFilter] = form.watch(["position", "department", "branch", "filter"]);

  const filteredUsers = useMemo(() => {
    let filtered = userFetch;
    if (watchDepartment && watchDepartment.trim() !== "") {
      filtered = filtered.filter(user => {
        return user.DepID.toString() === watchDepartment;
      });
    }

    if (watchPosition && watchPosition.trim() !== "") {
      filtered = filtered.filter(user => {
        return user.PositionID.toString() === watchPosition;
      });
    }
    if (watchBranch && watchBranch.trim() !== "") {
      filtered = filtered.filter(user => {
        return user.BranchID.toString() === watchBranch;
      });
    }
    if (watchFilter && watchFilter.trim() !== "") {
      filtered = filtered.filter(user => {
        switch (watchFilter) {
          case "active":
            return user.Actived === true;
          case "inactive":
            return user.Actived === false;
          // case "new":
          //   const sevenDaysAgo = new Date();
          //   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          //   return new Date(user.createdAt) > sevenDaysAgo;
          case "":
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [userFetch, watchPosition, watchDepartment, watchBranch, watchFilter]);

  const onSubmit = (value: SelectType) => {
    console.log("Form submitted:", value)
  }
  const handleFilterSelect = useCallback((filterType: string) => {
    form.setValue("filter", filterType);
  }, [form]);
  useEffect(() => {
    onSubmit(form.getValues())
  }, [watchPosition, watchDepartment, watchBranch, watchFilter])
  const clearAllFilters = useCallback(() => {
    form.reset({
      position: "",
      department: "",
      branch: "",
      filter: "",
    });
  }, [form]);

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

  const stats = [
    {
      title: "Total Users",
      value: userFetch.length.toLocaleString(),
      // change: "+12%",
      changeType: "positive",
      icon: Users,
      // description: "from last month"
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
        <Card className="w-full mx-auto">
          <CardHeader className="pb-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Visitors
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Total for the last 3 months
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {periods.map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period)}
                    className={`text-xs px-3 py-1 h-8 ${selectedPeriod === period
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9CA3AF" stopOpacity={0.8} />
                      <stop offset="50%" stopColor="#9CA3AF" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#9CA3AF" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#6B7280',
                      fontSize: 12,
                    }}
                    tickMargin={8}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#6B7280"
                    strokeWidth={2}
                    fill="url(#visitorGradient)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#6B7280",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

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

              <div className=" space-y-2  sm:space-y-0 sm:space-x-3">
                <div className="grid grid-cols-3 sm:flex justify-end space-x-2 space-y-3 sm:space-y-0 mr-[0px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-xs sm:text-sm" asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        {watchFilter && watchFilter !== "all" && (
                          <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                            {watchFilter === "active" ? "Active" :
                              watchFilter === "inactive" ? "Inactive": ""}
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
                  {(watchPosition || watchDepartment || watchBranch || watchFilter != "") && (
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
                {/* <div className="mt-4"> */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 sm:justify-center gap-x-5 sm:flex sm:gap-x-0 mt-4 space-x-4 justify-end">
                    <FormField name="branch"
                      control={form.control}
                      render={({ field }) => (
                        <Branch field={field} />
                      )}
                    />
                    <FormField name="department"
                      control={form.control}
                      render={({ field }) => (
                        <Department field={field} />
                      )}
                    />
                    <FormField name="position"
                      control={form.control}
                      render={({ field }) => (
                        <Position field={field} />
                      )}
                    />
                  </form>
                </Form>
                {/* </div> */}
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