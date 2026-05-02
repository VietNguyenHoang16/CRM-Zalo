import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createCustomerSchema, formatZodError } from '@/lib/validations'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const sourceId = searchParams.get('sourceId')

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (sourceId) where.sourceId = sourceId

  const customers = await prisma.customer.findMany({
    where,
    include: { source: true, logs: { orderBy: { createdAt: 'desc' }, take: 10 } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(customers)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createCustomerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ', details: formatZodError(parsed.error) }, { status: 400 })
    }

    const { name, phone, email, address, note, sourceId } = parsed.data

    const existing = await prisma.customer.findUnique({ where: { phone } })
    if (existing) {
      return NextResponse.json({ error: 'Số điện thoại đã tồn tại' }, { status: 409 })
    }

    const customer = await prisma.customer.create({
      data: { name, phone, email, address, note, sourceId },
      include: { source: true },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}
