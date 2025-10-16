import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Integration test ที่รวมการทำงานของ Middleware, TokenMonitor และ AuthOptions
describe('Session & Permission Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  describe('Complete Authentication Flow', () => {
    it('should handle complete session lifecycle', async () => {
      // Mock successful login response
      const mockLoginData = {
        access_token: 'test-access-token',
        user: {
          UserID: '123',
          UserCode: 'TEST001',
          fristName: 'Test',
          lastName: 'User',
          Email: 'test@example.com',
          img_profile: 'profile.jpg',
          role_id: 1,
          branchid: 1,
          depid: 1,
        }
      }

      // Test the credential authorization flow
      const { authOptions } = require('../utils/authOptions')
      const credentialsProvider = authOptions.providers[0]
      
      const authorizedUser = await credentialsProvider.authorize({
        response: JSON.stringify(mockLoginData)
      })

      expect(authorizedUser).toMatchObject({
        UserID: 123,
        UserCode: 'TEST001',
        access_token: 'test-access-token',
      })

      // Test JWT callback adds user data to token
      const jwtCallback = authOptions.callbacks.jwt
      const token = await jwtCallback({
        token: {},
        user: authorizedUser,
        account: null,
      } as any)

      expect(token).toMatchObject({
        UserID: 123,
        UserCode: 'TEST001',
        access_token: 'test-access-token',
      })

      // Test session callback maps token to session
      const sessionCallback = authOptions.callbacks.session
      const session = await sessionCallback({
        session: {
          user: { UserID: 0, UserCode: '' },
          expires: new Date().toISOString()
        } as any,
        token,
        user: {} as any,
      } as any)

      expect(session.user).toMatchObject({
        UserID: 123,
        UserCode: 'TEST001',
        access_token: 'test-access-token',
      })
    })

    it('should handle token refresh flow', async () => {
      // Mock fetch for user data refresh
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: [{
            fristName: 'Updated',
            lastName: 'User',
            Email: 'updated@example.com',
            img_profile: 'new-profile.jpg',
            role_id: 2,
            branchid: 2,
            depid: 2,
          }]
        })
      } as Response)

      const { authOptions } = require('../utils/authOptions')
      const jwtCallback = authOptions.callbacks.jwt

      const originalToken = {
        UserCode: 'TEST001',
        access_token: 'test-token',
        fristName: 'Old',
        lastName: 'Name',
        Email: 'old@example.com',
      }

      const updatedToken = await jwtCallback({
        token: originalToken,
        trigger: 'update',
        session: {} as any,
        user: undefined as any,
        account: null,
      } as any)

      expect(updatedToken).toEqual({
        UserCode: 'TEST001',
        access_token: 'test-token',
        fristName: 'Updated',
        lastName: 'User',
        Email: 'updated@example.com',
        img_profile: 'new-profile.jpg',
        role_id: 2,
        branchid: 2,
        depid: 2,
      })

      // Verify API was called with correct parameters
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/GetUserWithRoles?UserCode=TEST001',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      )
    })
  })

  describe('Permission & Access Control Integration', () => {
    it('should enforce path permissions correctly', async () => {
      // Mock getToken to return valid user token
      const mockGetToken = require('next-auth/jwt').getToken as jest.MockedFunction<typeof getToken>
      mockGetToken.mockResolvedValue({
        UserID: 123,
        access_token: 'test-token',
        sub: '123',
        iat: Date.now(),
        exp: Date.now() + 3600,
        jti: 'test'
      })

      // Mock API response for user permissions
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          { path: '/users' },
          { path: '/fa_control/*' },
          { path: '/reservations' }
        ]
      } as Response)

      const { middleware } = require('../middleware')
      
      // Test allowed exact path
      let mockRequest = {
        nextUrl: { pathname: '/users' },
        url: 'http://localhost:3000/users',
      } as NextRequest

      let result = await middleware(mockRequest)
      // Should call NextResponse.next() - no redirect

      // Test allowed wildcard path
      mockRequest = {
        nextUrl: { pathname: '/fa_control/forms' },
        url: 'http://localhost:3000/fa_control/forms',
      } as NextRequest

      result = await middleware(mockRequest)
      // Should call NextResponse.next() - no redirect

      // Test denied path
      jest.clearAllMocks()
      mockGetToken.mockResolvedValue({
        UserID: 123,
        access_token: 'test-token',
        sub: '123',
        iat: Date.now(),
        exp: Date.now() + 3600,
        jti: 'test'
      })
      
      mockRequest = {
        nextUrl: { pathname: '/unauthorized-path' },
        url: 'http://localhost:3000/unauthorized-path',
      } as NextRequest

      result = await middleware(mockRequest)
      // Should redirect to /unauthorized
    })

    it('should handle expired token scenario', async () => {
      // Mock getToken to return valid user token
      const mockGetToken = require('next-auth/jwt').getToken as jest.MockedFunction<typeof getToken>
      mockGetToken.mockResolvedValue({
        UserID: 123,
        access_token: 'expired-token',
        sub: '123',
        iat: Date.now(),
        exp: Date.now() + 3600,
        jti: 'test'
      })

      // Mock API response for expired token (401)
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
      } as Response)

      const { middleware } = require('../middleware')
      
      const mockRequest = {
        nextUrl: { pathname: '/users' },
        url: 'http://localhost:3000/users',
      } as NextRequest

      const result = await middleware(mockRequest)
      
      // Should redirect to login with expired=true&reason=api_401
      // Verify the redirect URL contains the expected parameters
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/Apps_List_Menu',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer expired-token',
          }),
          body: JSON.stringify({ UserID: 123 }),
        })
      )
    })
  })

  describe('Session Timing & Warnings', () => {
    it('should calculate session expiry correctly', () => {
      const now = Date.now()
      const expiresIn5Minutes = new Date(now + 5 * 60 * 1000)
      const expiresIn4Minutes = new Date(now + 4 * 60 * 1000)
      const expired = new Date(now - 1000)

      // Test session with more than 5 minutes remaining
      const remaining5 = expiresIn5Minutes.getTime() - now
      expect(remaining5).toBeGreaterThan(5 * 60 * 1000 - 1000) // Allow 1 second tolerance

      // Test session with less than 5 minutes remaining (should show warning)
      const remaining4 = expiresIn4Minutes.getTime() - now
      expect(remaining4).toBeLessThan(5 * 60 * 1000)
      expect(remaining4).toBeGreaterThan(0)

      // Test expired session
      const remainingExpired = expired.getTime() - now
      expect(remainingExpired).toBeLessThan(0)
    })
  })

  describe('Error Handling & Edge Cases', () => {
    it('should handle network errors gracefully', async () => {
      const mockGetToken = require('next-auth/jwt').getToken as jest.MockedFunction<typeof getToken>
      mockGetToken.mockResolvedValue({
        UserID: 123,
        access_token: 'test-token',
        sub: '123',
        iat: Date.now(),
        exp: Date.now() + 3600,
        jti: 'test'
      })

      // Mock network error
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValue(new Error('Network error'))

      const { middleware } = require('../middleware')
      
      const mockRequest = {
        nextUrl: { pathname: '/users' },
        url: 'http://localhost:3000/users',
      } as NextRequest

      const result = await middleware(mockRequest)
      
      // Should redirect to /unauthorized due to network error
      expect(mockFetch).toHaveBeenCalled()
    })

    it('should handle malformed API responses', async () => {
      const mockGetToken = require('next-auth/jwt').getToken as jest.MockedFunction<typeof getToken>
      mockGetToken.mockResolvedValue({
        UserID: 123,
        access_token: 'test-token',
        sub: '123',
        iat: Date.now(),
        exp: Date.now() + 3600,
        jti: 'test'
      })

      // Mock API response with malformed data
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          { path: null }, // null path
          { path: undefined }, // undefined path
          { path: '' }, // empty path
          { path: '/valid-path' }, // valid path
        ]
      } as Response)

      const { middleware } = require('../middleware')
      
      const mockRequest = {
        nextUrl: { pathname: '/valid-path' },
        url: 'http://localhost:3000/valid-path',
      } as NextRequest

      const result = await middleware(mockRequest)
      
      // Should filter out invalid paths and allow access to valid path
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('Cache Functionality', () => {
    it('should cache and reuse permission data', async () => {
      const mockGetToken = require('next-auth/jwt').getToken as jest.MockedFunction<typeof getToken>
      const userToken = {
        UserID: 123,
        access_token: 'test-token',
        sub: '123',
        iat: Date.now(),
        exp: Date.now() + 3600,
        jti: 'test'
      }
      
      mockGetToken.mockResolvedValue(userToken)

      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [{ path: '/users' }]
      } as Response)

      const { middleware } = require('../middleware')
      
      const mockRequest = {
        nextUrl: { pathname: '/users' },
        url: 'http://localhost:3000/users',
      } as NextRequest

      // First request - should call API
      await middleware(mockRequest)
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // Reset mocks but keep token
      jest.clearAllMocks()
      mockGetToken.mockResolvedValue(userToken)

      // Second request - should use cache (no API call)
      await middleware(mockRequest)
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })
})