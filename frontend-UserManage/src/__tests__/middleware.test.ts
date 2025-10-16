import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Mock dependencies
jest.mock('next-auth/jwt')

const mockGetToken = getToken as jest.MockedFunction<typeof getToken>

// Mock NextResponse
const mockNext = jest.fn()
const mockRedirect = jest.fn()

jest.mock('next/server', () => ({
  NextResponse: {
    next: () => mockNext(),
    redirect: (url: string | URL) => mockRedirect(url),
  },
}))

// Mock fetch
global.fetch = jest.fn()

// Import middleware after mocking
const { middleware } = require('../middleware')

describe('Middleware Tests', () => {
  let mockRequest: NextRequest

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockRequest = {
      nextUrl: {
        pathname: '/users',
        origin: 'http://localhost:3000',
        toString: () => 'http://localhost:3000/users'
      },
      url: 'http://localhost:3000/users',
    } as NextRequest
  })

  describe('Public Path Access', () => {
    const publicPaths = ['/login', '/forget_password', '/reset-password', '/unauthorized', '/']

    it.each(publicPaths)('should allow access to public path: %s', async (path) => {
      mockRequest.nextUrl.pathname = path

      await middleware(mockRequest)

      expect(mockNext).toHaveBeenCalled()
      expect(mockRedirect).not.toHaveBeenCalled()
    })

    it('should allow access to sub-paths of public paths', async () => {
      mockRequest.nextUrl.pathname = '/login/verify'

      await middleware(mockRequest)

      expect(mockNext).toHaveBeenCalled()
      expect(mockRedirect).not.toHaveBeenCalled()
    })
  })

  describe('Authentication Check', () => {
    it('should redirect to login when no token exists', async () => {
      mockGetToken.mockResolvedValue(null)
      
      await middleware(mockRequest)

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL('/login?redirect=%2Fusers&expired=true', mockRequest.url)
      )
    })

    it('should redirect to unauthorized when token exists but no UserID', async () => {
      mockGetToken.mockResolvedValue({
        // Token without UserID
        sub: '',
        iat: Date.now(),
        exp: Date.now() + 3600,
        jti: 'test'
      })

      await middleware(mockRequest)

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL('/unauthorized', mockRequest.url)
      )
    })
  })

  describe('API Permission Check', () => {
    const mockToken = {
      UserID: 123,
      access_token: 'test-token',
      sub: '123',
      iat: Date.now(),
      exp: Date.now() + 3600,
      jti: 'test'
    }

    beforeEach(() => {
      mockGetToken.mockResolvedValue(mockToken)
    })

    it('should allow access when user has permission for exact path', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          { path: '/users' },
          { path: '/fa_control' }
        ]
      } as Response)

      await middleware(mockRequest)

      expect(mockNext).toHaveBeenCalled()
      expect(mockRedirect).not.toHaveBeenCalled()
    })

    it('should allow access when user has wildcard permission', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          { path: '/users/*' },
          { path: '/fa_control' }
        ]
      } as Response)

      mockRequest.nextUrl.pathname = '/users/profile'

      await middleware(mockRequest)

      expect(mockNext).toHaveBeenCalled()
      expect(mockRedirect).not.toHaveBeenCalled()
    })

    it('should deny access when user has no permission', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          { path: '/fa_control' },
          { path: '/reservations' }
        ]
      } as Response)

      await middleware(mockRequest)

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL('/unauthorized', mockRequest.url)
      )
    })

    it('should redirect to login when API returns 401 (token expired)', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
      } as Response)

      await middleware(mockRequest)

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL('/login?redirect=%2Fusers&expired=true&reason=api_401', mockRequest.url)
      )
    })

    it('should redirect to unauthorized when API returns other errors', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      } as Response)

      await middleware(mockRequest)

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL('/unauthorized', mockRequest.url)
      )
    })

    it('should handle API fetch errors gracefully', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValue(new Error('Network error'))

      await middleware(mockRequest)

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL('/unauthorized', mockRequest.url)
      )
    })
  })

  describe('Path Permission Logic', () => {
    const mockToken = {
      UserID: 123,
      access_token: 'test-token',
      sub: '123',
      iat: Date.now(),
      exp: Date.now() + 3600,
      jti: 'test'
    }

    beforeEach(() => {
      mockGetToken.mockResolvedValue(mockToken)
    })

    it('should handle query parameters in request path', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [{ path: '/users' }]
      } as Response)

      mockRequest.nextUrl.pathname = '/users'
      // Create new request with query params
      const requestWithParams = {
        ...mockRequest,
        url: 'http://localhost:3000/users?id=123&tab=profile'
      } as NextRequest

      await middleware(requestWithParams)

      expect(mockNext).toHaveBeenCalled()
    })

    it('should handle paths with trailing slashes', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [{ path: '/users/' }]
      } as Response)

      mockRequest.nextUrl.pathname = '/users'

      await middleware(mockRequest)

      expect(mockNext).toHaveBeenCalled()
    })

    it('should handle wildcard permissions correctly', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [{ path: '/users/*' }]
      } as Response)

      // Test exact base path
      mockRequest.nextUrl.pathname = '/users'
      await middleware(mockRequest)
      expect(mockNext).toHaveBeenCalled()

      // Reset mocks
      jest.clearAllMocks()
      mockGetToken.mockResolvedValue(mockToken)
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [{ path: '/users/*' }]
      } as Response)

      // Test sub-path
      mockRequest.nextUrl.pathname = '/users/profile/edit'
      await middleware(mockRequest)
      expect(mockNext).toHaveBeenCalled()
    })
  })

  describe('Cache Functionality', () => {
    const mockToken = {
      UserID: 123,
      access_token: 'test-token',
      sub: '123',
      iat: Date.now(),
      exp: Date.now() + 3600,
      jti: 'test'
    }

    beforeEach(() => {
      mockGetToken.mockResolvedValue(mockToken)
    })

    it('should cache API responses', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [{ path: '/users' }]
      } as Response)

      // First call
      await middleware(mockRequest)
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // Reset mocks but keep the same token
      jest.clearAllMocks()
      mockGetToken.mockResolvedValue(mockToken)

      // Second call should use cache
      await middleware(mockRequest)
      expect(mockFetch).not.toHaveBeenCalled()
      expect(mockNext).toHaveBeenCalled()
    })
  })
})