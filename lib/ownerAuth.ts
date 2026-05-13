import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function createOwnerToken(ownerId: string): string {
  return jwt.sign({ ownerId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyOwnerToken(token: string): { ownerId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { ownerId: string }
  } catch {
    return null
  }
}

export async function getOwnerId(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('owner_token')?.value
  if (!token) return null
  const payload = verifyOwnerToken(token)
  return payload?.ownerId ?? null
}
