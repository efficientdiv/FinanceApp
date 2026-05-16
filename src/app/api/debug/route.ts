import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL ?? 'NOT SET'
  const urlMasked = dbUrl.replace(/:\/\/[^@]+@/, '://***@')

  try {
    const count = await prisma.user.count()
    return NextResponse.json({ db: urlMasked, users: count, ok: true })
  } catch (e) {
    return NextResponse.json({ db: urlMasked, error: String(e), ok: false }, { status: 500 })
  }
}
