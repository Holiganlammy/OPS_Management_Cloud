"use client"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Users,
  UserPlus,
  Activity,
  TrendingUp,
  Calendar,
  Bell,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ChartSection from "@/app/(main)/users/dashboard/DashboardComponents/Chart"
import router from "next/dist/shared/lib/router/router"
import PageLoading from "@/components/PageLoading"
import { getAutoData } from "../../service/userService"

export default function DashboardClient() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 3 months")
  const [isChecking, setIsChecking] = useState(true)
  const periods = ["Last 3 months", "Last 30 days", "Last 7 days"]
  const [currentTime, setCurrentTime] = useState(new Date())
  const [userFetch, setUserFetch] = useState<UserData[]>([])

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getAutoData();
      setUserFetch(data?.filter(data => data.key === 'users')[0].data || []);
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
      <PageLoading />
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