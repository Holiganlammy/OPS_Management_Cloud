import DashboardClient from '@/components/Dashboard/Dashboard'
import { getSessionToken } from '@/lib/server-session'

async function fetchUsers() {
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
      return result
    }
    return []
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export default async function DashboardPage() {
  const token = await getSessionToken()
  const initialUsers = await fetchUsers()

  return <DashboardClient token={token?.accessToken} initialUsers={initialUsers} />
}