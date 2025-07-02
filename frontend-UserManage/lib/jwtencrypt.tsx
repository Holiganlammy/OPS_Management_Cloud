import { EncryptJWT, jwtDecrypt } from 'jose'

function normalizeSecret(secret: string): Uint8Array {
  if (secret.length < 32) {
    secret = secret.padEnd(32, '0')
  }
  else if (secret.length > 32) {
    secret = secret.substring(0, 32)
  }
  
  return new TextEncoder().encode(secret)
}

const secret = normalizeSecret(process.env.JWT_SECRET!)

export async function encrypt(payload: Record<string, unknown>): Promise<string> {
  try {
    return await new EncryptJWT(payload)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setIssuedAt()
      .setExpirationTime('4h')
      .encrypt(secret)
  } catch (error) {
    console.error('Encryption failed:', error)
    throw error
  }
}

export async function decrypt(token: string): Promise<object> {
  try {
    const { payload } = await jwtDecrypt(token, secret)
    return payload
  } catch (error) {
    console.error('Decryption failed:', error)
    throw error
  }
}