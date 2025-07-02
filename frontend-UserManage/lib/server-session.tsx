import { cookies } from 'next/headers'
import { decrypt, encrypt } from '@/lib/jwtencrypt'

export async function setSession(payload: Record<string, any>, cookieName: string = 'access_token') {
  const cookieStore = await cookies()
  const encryptedSession = await encrypt(payload)
  cookieStore.set(cookieName, encryptedSession, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 4, // 4 hours
  })
}

export async function getSessionToken(): Promise<Record<string, any> | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  if (!token) return null
  
  try {
    const decrypted = await decrypt(token)
    return decrypted as Record<string, any>
  } catch (error) {
    console.error('Invalid token', error)
    return null
  }
}

export async function getSessionUser(): Promise<Session | null> {
  const cookieStore = await cookies()
  const encryptedUser = cookieStore.get('session')?.value

  if (!encryptedUser) return null

  try {
    const decrypted = await decrypt(encryptedUser)
    return decrypted as Session
  } catch (error) {
    console.error('Failed to decrypt session user', error)
    return null
  }
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
  cookieStore.delete('session')
}