import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [todayCustomers, pendingZalo, pendingCall, contactedCount, messagedCount] = await Promise.all([
      prisma.customer.count({
        where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
      }),
      prisma.customer.count({ where: { status: 'PENDING_ZALO' } }),
      prisma.customer.count({ where: { status: 'PENDING_CALL' } }),
      prisma.customer.count({ where: { status: 'CONTACTED' } }),
      prisma.customer.count({ where: { status: 'MESSAGED' } }),
    ])

    const total = await prisma.customer.count()
    const conversionRate = total > 0 ? Math.round((contactedCount / total) * 100) : 0

    return NextResponse.json({
      todayCustomers,
      pendingZalo,
      pendingCall,
      contactedCount,
      messagedCount,
      total,
      conversionRate,
    }, { headers: { 'Cache-Control': 'public, max-age=15, stale-while-revalidate=30' } })
  } catch {
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}
