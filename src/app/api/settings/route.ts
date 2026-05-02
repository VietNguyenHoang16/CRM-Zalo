import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateSettingsSchema, formatZodError } from '@/lib/validations'

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({ where: { id: 'global' } })
    if (!settings) {
      settings = await prisma.settings.create({ data: { id: 'global' } })
    }
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = updateSettingsSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ', details: formatZodError(parsed.error) }, { status: 400 })
    }

    const { tgChoAloSauKB, tgChoNhantinSauGoiKhongNghe, tgLapLichNhantinLan2 } = parsed.data

    const settings = await prisma.settings.upsert({
      where: { id: 'global' },
      update: { tgChoAloSauKB, tgChoNhantinSauGoiKhongNghe, tgLapLichNhantinLan2 },
      create: { id: 'global', tgChoAloSauKB, tgChoNhantinSauGoiKhongNghe, tgLapLichNhantinLan2 }
    })
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}
