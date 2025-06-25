export function getSession() {
    if (typeof window === 'undefined') return null
    
    try {
        const session = localStorage.getItem('user-session')
        return session ? JSON.parse(session) : null
    } catch (error) {
        return null
    }
}
export function setSession(userData: any) {
    if (typeof window === 'undefined') return
    localStorage.setItem('user-session', JSON.stringify(userData))
}

export function removeSession() {
    if (typeof window === 'undefined') return
    localStorage.removeItem('user-session')
}

export function isAuthenticated() {
    if (typeof window === 'undefined') return false
    try {
        const session = localStorage.getItem('user-session')
        return session !== null
    } catch (error) {
        return false
    }
}
// export function refreshSession() {
//     if (typeof window === 'undefined') return

//     const sessionStr = localStorage.getItem('user-session')
//     if (!sessionStr) return

//     try {
//         const session = JSON.parse(sessionStr)
//         const expireMinutes = 30
//         session.expireTime = Date.now() + expireMinutes * 60 * 1000
//         localStorage.setItem('user-session', JSON.stringify(session))
//     } catch (error) {
//         console.error('Invalid session format')
//     }
// }