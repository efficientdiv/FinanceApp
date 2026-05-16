import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { name, email, password } = body as Record<string, unknown>

  const nameTrimmed = typeof name === 'string' ? name.trim() : ''
  const emailTrimmed = typeof email === 'string' ? email.trim().toLowerCase() : ''
  const passwordStr = typeof password === 'string' ? password : ''

  if (!nameTrimmed || nameTrimmed.length < 1 || nameTrimmed.length > 100) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  }
  if (!emailTrimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
    return NextResponse.json({ error: 'Valid email required.' }, { status: 400 })
  }
  if (!passwordStr || passwordStr.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email: emailTrimmed } })
  if (existing) {
    return NextResponse.json({ error: 'Email already in use.' }, { status: 409 })
  }

  const hash = await bcrypt.hash(passwordStr, 12)
  await prisma.user.create({ data: { name: nameTrimmed, email: emailTrimmed, password: hash } })

  return NextResponse.json({ ok: true })
}
