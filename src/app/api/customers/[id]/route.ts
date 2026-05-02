import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateCustomerSchema, formatZodError } from '@/lib/validations'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { source: true, logs: { include: { template: true }, orderBy: { createdAt: 'desc' } }, appointments: { where: { completed: false }, orderBy: { scheduledAt: 'asc' } } },
    })

    if (!customer) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json(customer)
  } catch {
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateCustomerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ', details: formatZodError(parsed.error) }, { status: 400 })
    }

    const { name, phone, email, address, note, sourceId, status } = parsed.data

    if (phone) {
      const existing = await prisma.customer.findFirst({ where: { phone, NOT: { id } } })
      if (existing) return NextResponse.json({ error: 'Số điện thoại đã tồn tại' }, { status: 409 })
    }

    const data: Record<string, unknown> = {}
    if (name !== undefined) data.name = name
    if (phone !== undefined) data.phone = phone
    if (email !== undefined) data.email = email
    if (address !== undefined) data.address = address
    if (note !== undefined) data.note = note
    if (sourceId !== undefined) data.sourceId = sourceId
    if (status !== undefined) data.status = status

    const customer = await prisma.customer.update({ where: { id }, data, include: { source: true } })
    return NextResponse.json(customer)
  } catch {
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.customer.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}
