import { authOptions } from '../utils/authOptions'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { User } from 'next-auth'

// Mock the fetch function
global.fetch = jest.fn()

describe('AuthOptions Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Credentials Provider', () => {
    const credentialsProvider = authOptions.providers[0] as any

    it('should have correct provider configuration', () => {
      expect(credentialsProvider.name).toBe('Credentials')
      expect(credentialsProvider.credentials).toEqual({
        response: { label: 'Response', type: 'json' },
        responseLogin: { label: 'Response Login', type: 'json' },
        responseCondition: { label: 'Response Condition', type: 'text' },
      })
    })

    describe('OTP Response Authorization', () => {
      it('should authorize user with valid OTP response', async () => {
        const mockOTPResponse = {
          access_token: 'test-token',
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

        const credentials = {
          response: JSON.stringify(mockOTPResponse)
        }

        const result = await credentialsProvider.authorize(credentials)

        expect(result).toEqual({
          id: '',
          UserID: 123,
          UserCode: 'TEST001',
          fristName: 'Test',
          lastName: 'User',
          Email: 'test@example.com',
          access_token: 'test-token',
          img_profile: 'profile.jpg',
          role_id: 1,
          branchid: 1,
          depid: 1,
        })
      })

      it('should handle userid field in OTP response', async () => {
        const mockOTPResponse = {
          access_token: 'test-token',
          user: {
            userid: '456',
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

        const credentials = {
          response: JSON.stringify(mockOTPResponse)
        }

        const result = await credentialsProvider.authorize(credentials)

        expect(result?.id).toBe('456')
      })
    })

    describe('Login Response Authorization', () => {
      it('should authorize user with valid login response and pass condition', async () => {
        const mockLoginResponse = {
          access_token: 'test-token',
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

        const credentials = {
          responseCondition: 'pass',
          responseLogin: JSON.stringify(mockLoginResponse)
        }

        const result = await credentialsProvider.authorize(credentials)

        expect(result).toEqual({
          id: '',
          UserID: 123,
          UserCode: 'TEST001',
          fristName: 'Test',
          lastName: 'User',
          Email: 'test@example.com',
          access_token: 'test-token',
          img_profile: 'profile.jpg',
          role_id: 1,
          branchid: 1,
          depid: 1,
        })
      })

      it('should not authorize when condition is not pass', async () => {
        const credentials = {
          responseCondition: 'fail',
          responseLogin: JSON.stringify({})
        }

        await expect(credentialsProvider.authorize(credentials)).rejects.toThrow('INVALID_CREDENTIALS')
      })
    })

    describe('Error Handling', () => {
      it('should throw error for invalid credentials', async () => {
        const credentials = {}

        await expect(credentialsProvider.authorize(credentials)).rejects.toThrow('INVALID_CREDENTIALS')
      })

      it('should throw error for invalid JSON in response', async () => {
        const credentials = {
          response: 'invalid-json'
        }

        await expect(credentialsProvider.authorize(credentials)).rejects.toThrow()
      })

      it('should return null when no response provided', async () => {
        const credentials = {
          response: null
        }

        const result = await credentialsProvider.authorize(credentials)
        expect(result).toBeNull()
      })
    })
  })

  describe('JWT Callback', () => {
    const jwtCallback = authOptions.callbacks?.jwt

    it('should add user data to token on initial login', async () => {
      const mockUser: User = {
        id: '123',
        UserID: 123,
        UserCode: 'TEST001',
        fristName: 'Test',
        lastName: 'User',
        Email: 'test@example.com',
        access_token: 'test-token',
        img_profile: 'profile.jpg',
        role_id: 1,
        branchid: 1,
        depid: 1,
      }

      const token = {}

      const result = await jwtCallback!({ 
        token, 
        user: mockUser,
        account: null,
      } as any)

      expect(result).toEqual({
        UserID: 123,
        UserCode: 'TEST001',
        fristName: 'Test',
        lastName: 'User',
        Email: 'test@example.com',
        access_token: 'test-token',
        img_profile: 'profile.jpg',
        role_id: 1,
        branchid: 1,
        depid: 1,
      })
    })

    it('should refresh user data on update trigger', async () => {
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

      const token = {
        UserCode: 'TEST001',
        access_token: 'test-token',
        fristName: 'Old',
        lastName: 'Name',
      }

      const result = await jwtCallback!({ 
        token, 
        trigger: 'update',
        session: {} as any,
        user: undefined as any,
        account: null,
      } as any)

      expect(result).toEqual({
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
    })

    it('should handle API error during refresh gracefully', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      } as Response)

      const token = {
        UserCode: 'TEST001',
        access_token: 'test-token',
        fristName: 'Test',
      }

      const result = await jwtCallback!({ 
        token, 
        trigger: 'update',
        session: {} as any,
        user: undefined as any,
        account: null,
      } as any)

      // Should return original token on error
      expect(result).toEqual(token)
    })

    it('should handle network error during refresh gracefully', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValue(new Error('Network error'))

      const token = {
        UserCode: 'TEST001',
        access_token: 'test-token',
        fristName: 'Test',
      }

      const result = await jwtCallback!({ 
        token, 
        trigger: 'update',
        session: {} as any,
        user: undefined as any,
        account: null,
      } as any)

      // Should return original token on error
      expect(result).toEqual(token)
    })

    it('should return empty object when token expires', async () => {
      const token = {
        accessTokenExpires: Date.now() - 1000, // Expired 1 second ago
        UserCode: 'TEST001',
      }

      const result = await jwtCallback!({ 
        token,
        user: undefined as any,
        account: null,
      } as any)

      expect(result).toEqual({})
    })

    it('should return token when not expired', async () => {
      const token = {
        accessTokenExpires: Date.now() + 60000, // Expires in 1 minute
        UserCode: 'TEST001',
      }

      const result = await jwtCallback!({ 
        token,
        user: undefined as any,
        account: null,
      } as any)

      expect(result).toEqual(token)
    })
  })

  describe('Session Callback', () => {
    const sessionCallback = authOptions.callbacks?.session

    it('should map token data to session user', async () => {
      const session = {
        user: {
          UserID: 0,
          UserCode: '',
        },
        expires: new Date().toISOString()
      } as any

      const token = {
        UserID: 123,
        UserCode: 'TEST001',
        fristName: 'Test',
        lastName: 'User',
        Email: 'test@example.com',
        access_token: 'test-token',
        img_profile: 'profile.jpg',
        role_id: 1,
        branchid: 1,
        depid: 1,
      }

      const result = await sessionCallback!({ 
        session, 
        token,
        user: {} as any
      } as any)

      expect(result.user).toEqual({
        UserID: 123,
        UserCode: 'TEST001',
        fristName: 'Test',
        lastName: 'User',
        Email: 'test@example.com',
        access_token: 'test-token',
        img_profile: 'profile.jpg',
        role_id: 1,
        branchid: 1,
        depid: 1,
      })
    })

    it('should handle empty token gracefully', async () => {
      const session = {
        user: {
          UserID: 0,
          UserCode: '',
        },
        expires: new Date().toISOString()
      } as any

      const token = {}

      const result = await sessionCallback!({ 
        session, 
        token,
        user: {} as any
      } as any)

      expect(result).toEqual(session)
    })

    it('should handle null token gracefully', async () => {
      const session = {
        user: {
          UserID: 0,
          UserCode: '',
        },
        expires: new Date().toISOString()
      } as any

      const result = await sessionCallback!({ 
        session, 
        token: null as any,
        user: {} as any
      } as any)

      expect(result).toEqual(session)
    })
  })

  describe('Configuration', () => {
    it('should have correct session configuration', () => {
      expect(authOptions.session).toEqual({
        strategy: 'jwt',
        maxAge: 60 * 60, // 1 hour
      })
    })

    it('should have correct pages configuration', () => {
      expect(authOptions.pages).toEqual({
        signIn: '/login',
      })
    })

    it('should have signOut event handler', () => {
      expect(authOptions.events?.signOut).toBeDefined()
      expect(typeof authOptions.events?.signOut).toBe('function')
    })
  })
})