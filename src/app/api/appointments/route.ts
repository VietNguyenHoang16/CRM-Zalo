import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const appointments = await prisma.appointment.findMany({
    where: { completed: false, scheduledAt: { gte: new Date() } },
    include: { customer: { select: { name: true, phone: true } } },
    orderBy: { scheduledAt: 'asc' },
    take: 50,
  })
  return NextResponse.json(appointments)
}
