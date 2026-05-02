import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createActionSchema, formatZodError } from '@/lib/validations'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = createActionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ', details: formatZodError(parsed.error) }, { status: 400 })
    }

    const { action, note, templateId } = parsed.data

    const customer = await prisma.customer.findUnique({ where: { id } })
    if (!customer) return NextResponse.json({ error: 'Không tìm thấy khách hàng' }, { status: 404 })

    let newStatus = customer.status
    let zaloSentAt = customer.zaloSentAt
    let zaloAcceptedAt = customer.zaloAcceptedAt

    switch (action) {
      case 'ZALO_SENT':
        newStatus = 'PENDING_ZALO'
        zaloSentAt = new Date()
        break
      case 'ZALO_ACCEPTED':
        newStatus = 'ZALO_CONNECTED'
        zaloAcceptedAt = new Date()
        break
      case 'CALL_MADE':
        newStatus = 'CONTACTED'
        break
      case 'CALL_MISSED':
        newStatus = 'PENDING_CALL'
        break
      case 'MESSAGE_SENT':
        newStatus = 'MESSAGED'
        break
      case 'STATUS_CHANGE':
        if (note) newStatus = note as typeof newStatus
        break
      case 'APPOINTMENT_SET':
        if (note) {
          const appointmentDate = new Date(note)
          await prisma.appointment.create({
            data: { customerId: id, scheduledAt: appointmentDate }
          })
        }
        break
    }

    const [updatedCustomer, log] = await prisma.$transaction([
      prisma.customer.update({
        where: { id },
        data: { status: newStatus, zaloSentAt, zaloAcceptedAt },
        include: { source: true }
      }),
      prisma.actionLog.create({
        data: { customerId: id, action, note, templateId }
      })
    ])

    return NextResponse.json({ customer: updatedCustomer, log })
  } catch {
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}
