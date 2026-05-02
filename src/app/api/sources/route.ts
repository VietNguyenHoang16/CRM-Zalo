import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSourceSchema, formatZodError } from '@/lib/validations'

export async function GET() {
  try {
    const sources = await prisma.customerSource.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(sources)
  } catch {
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createSourceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ', details: formatZodError(parsed.error) }, { status: 400 })
    }

    const { code, name } = parsed.data

    const existing = await prisma.customerSource.findUnique({ where: { code } })
    if (existing) return NextResponse.json({ error: 'Mã nguồn đã tồn tại' }, { status: 409 })

    const source = await prisma.customerSource.create({ data: { code, name } })
    return NextResponse.json(source, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}
