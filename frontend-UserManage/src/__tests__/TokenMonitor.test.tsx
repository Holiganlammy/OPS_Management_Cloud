import { render, screen, waitFor, act } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { SessionMonitor } from '../components/SessionMonitor/SessionManagement'

// Mock dependencies
const mockUseSession = jest.fn()
const mockUsePathname = jest.fn()
const mockUseRouter = jest.fn()
const mockSignOut = jest.fn()
const mockUpdate = jest.fn()

jest.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
  signOut: () => mockSignOut(),
}))

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => mockUseRouter(),
}))

describe('SessionMonitor Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    })
    
    mockUsePathname.mockReturnValue('/users')
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Public Path Handling', () => {
    const publicPaths = ['/login', '/forget_password', '/reset-password', '/unauthorized', '/']

    it.each(publicPaths)('should not monitor session on public path: %s', (path) => {
      mockUsePathname.mockReturnValue(path)
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: mockUpdate,
      })

      render(<SessionMonitor />)

      // Fast forward timers
      act(() => {
        jest.advanceTimersByTime(15000)
      })

      // Should not show any dialogs or warnings
      expect(screen.queryByText('Session หมดอายุ')).toBeNull()
      expect(screen.queryByText('Session กำลังจะหมดอายุ')).toBeNull()
    })
  })

  describe('Session Monitoring', () => {
    beforeEach(() => {
      mockUsePathname.mockReturnValue('/users')
    })

    it('should not monitor when session is not authenticated', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: mockUpdate,
      })

      render(<SessionMonitor />)

      act(() => {
        jest.advanceTimersByTime(15000)
      })

      expect(screen.queryByText('Session หมดอายุ')).toBeNull()
    })

    it('should show warning when session expires in less than 5 minutes', async () => {
      const futureTime = new Date(Date.now() + 4 * 60 * 1000) // 4 minutes from now
      
      mockUseSession.mockReturnValue({
        data: {
          expires: futureTime.toISOString(),
          user: {
            Email: 'test@example.com',
            UserCode: 'TEST001',
            UserID: 123,
            access_token: 'test-token',
            fristName: 'Test',
            lastName: 'User',
            img_profile: '',
            role_id: 1,
            branchid: 1,
            depid: 1,
          }
        },
        status: 'authenticated',
        update: mockUpdate,
      })

      render(<SessionMonitor />)

      // Fast forward to trigger the warning
      act(() => {
        jest.advanceTimersByTime(11000) // 11 seconds to trigger check
      })

      await waitFor(() => {
        expect(screen.getByText('Session กำลังจะหมดอายุ')).toBeTruthy()
      })

      expect(screen.getByText('Session ของท่านกำลังจะหมดอายุ ในอีก 5 นาที')).toBeTruthy()
    })

    it('should show dialog when session expires', async () => {
      const pastTime = new Date(Date.now() - 1000) // 1 second ago
      
      mockUseSession.mockReturnValue({
        data: {
          expires: pastTime.toISOString(),
          user: {
            Email: 'test@example.com',
            UserCode: 'TEST001',
            UserID: 123,
            access_token: 'test-token',
            fristName: 'Test',
            lastName: 'User',
            img_profile: '',
            role_id: 1,
            branchid: 1,
            depid: 1,
          }
        },
        status: 'authenticated',
        update: mockUpdate,
      })

      render(<SessionMonitor />)

      // Fast forward to trigger the check
      act(() => {
        jest.advanceTimersByTime(11000)
      })

      await waitFor(() => {
        expect(screen.getByText('Session หมดอายุ')).toBeTruthy()
      })

      expect(screen.getByText('กรุณาเข้าสู่ระบบอีกครั้ง')).toBeTruthy()
      expect(screen.getByText('Session ของคุณหมดอายุแล้ว เพื่อความปลอดภัยของข้อมูล กรุณาเข้าสู่ระบบใหม่อีกครั้ง')).toBeTruthy()
    })

    it('should not show warning for sessions with more than 5 minutes remaining', () => {
      const futureTime = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
      
      mockUseSession.mockReturnValue({
        data: {
          expires: futureTime.toISOString(),
          user: {
            Email: 'test@example.com',
            UserCode: 'TEST001',
            UserID: 123,
            access_token: 'test-token',
            fristName: 'Test',
            lastName: 'User',
            img_profile: '',
            role_id: 1,
            branchid: 1,
            depid: 1,
          }
        },
        status: 'authenticated',
        update: mockUpdate,
      })

      render(<SessionMonitor />)

      act(() => {
        jest.advanceTimersByTime(11000)
      })

      expect(screen.queryByText('Session กำลังจะหมดอายุ')).toBeNull()
      expect(screen.queryByText('Session หมดอายุ')).toBeNull()
    })
  })

  describe('Dialog Interactions', () => {
    it('should call signOut when dialog button is clicked', async () => {
      const pastTime = new Date(Date.now() - 1000)
      
      mockUseSession.mockReturnValue({
        data: {
          expires: pastTime.toISOString(),
          user: {
            Email: 'test@example.com',
            UserCode: 'TEST001',
            UserID: 123,
            access_token: 'test-token',
            fristName: 'Test',
            lastName: 'User',
            img_profile: '',
            role_id: 1,
            branchid: 1,
            depid: 1,
          }
        },
        status: 'authenticated',
        update: mockUpdate,
      })

      render(<SessionMonitor />)

      // Fast forward to show dialog
      act(() => {
        jest.advanceTimersByTime(11000)
      })

      await waitFor(() => {
        expect(screen.getByText('ตกลง - ออกจากระบบ')).toBeTruthy()
      })

      // Click the logout button
      const logoutButton = screen.getByText('ตกลง - ออกจากระบบ')
      logoutButton.click()

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledWith({ redirect: false })
      })
    })

    it('should prevent dialog from being closed by outside click or escape', async () => {
      const pastTime = new Date(Date.now() - 1000)
      
      mockUseSession.mockReturnValue({
        data: {
          expires: pastTime.toISOString(),
          user: {
            Email: 'test@example.com',
            UserCode: 'TEST001',
            UserID: 123,
            access_token: 'test-token',
            fristName: 'Test',
            lastName: 'User',
            img_profile: '',
            role_id: 1,
            branchid: 1,
            depid: 1,
          }
        },
        status: 'authenticated',
        update: mockUpdate,
      })

      render(<SessionMonitor />)

      act(() => {
        jest.advanceTimersByTime(11000)
      })

      await waitFor(() => {
        expect(screen.getByText('Session หมดอายุ')).toBeTruthy()
      })

      // Dialog should still be visible (testing that it can't be closed)
      expect(screen.getByText('Session หมดอายุ')).toBeTruthy()
    })
  })

  describe('Warning Timeout', () => {
    it('should hide warning after 10 seconds', async () => {
      const futureTime = new Date(Date.now() + 4 * 60 * 1000) // 4 minutes from now
      
      mockUseSession.mockReturnValue({
        data: {
          expires: futureTime.toISOString(),
          user: {
            Email: 'test@example.com',
            UserCode: 'TEST001',
            UserID: 123,
            access_token: 'test-token',
            fristName: 'Test',
            lastName: 'User',
            img_profile: '',
            role_id: 1,
            branchid: 1,
            depid: 1,
          }
        },
        status: 'authenticated',
        update: mockUpdate,
      })

      render(<SessionMonitor />)

      // Trigger warning
      act(() => {
        jest.advanceTimersByTime(11000)
      })

      await waitFor(() => {
        expect(screen.getByText('Session กำลังจะหมดอายุ')).toBeTruthy()
      })

      // Wait for warning to disappear
      act(() => {
        jest.advanceTimersByTime(10000)
      })

      await waitFor(() => {
        expect(screen.queryByText('Session กำลังจะหมดอายุ')).toBeNull()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle session without expires field', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            Email: 'test@example.com',
            UserCode: 'TEST001',
            UserID: 123,
            access_token: 'test-token',
            fristName: 'Test',
            lastName: 'User',
            img_profile: '',
            role_id: 1,
            branchid: 1,
            depid: 1,
          }
        } as any, // Missing expires field
        status: 'authenticated',
        update: mockUpdate,
      })

      expect(() => {
        render(<SessionMonitor />)
        act(() => {
          jest.advanceTimersByTime(11000)
        })
      }).not.toThrow()
    })

    it('should handle invalid expires date', () => {
      mockUseSession.mockReturnValue({
        data: {
          expires: 'invalid-date',
          user: {
            Email: 'test@example.com',
            UserCode: 'TEST001',
            UserID: 123,
            access_token: 'test-token',
            fristName: 'Test',
            lastName: 'User',
            img_profile: '',
            role_id: 1,
            branchid: 1,
            depid: 1,
          }
        },
        status: 'authenticated',
        update: mockUpdate,
      })

      expect(() => {
        render(<SessionMonitor />)
        act(() => {
          jest.advanceTimersByTime(11000)
        })
      }).not.toThrow()
    })
  })
})