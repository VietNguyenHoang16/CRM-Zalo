import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createTemplateSchema, formatZodError } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    const where = categoryId ? { categoryId } : {}
    const templates = await prisma.messageTemplate.findMany({
      where,
      include: { category: true },
      orderBy: { title: 'asc' },
    })
    return NextResponse.json(templates, { headers: { 'Cache-Control': 'public, max-age=15, stale-while-revalidate=30' } })
  } catch {
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createTemplateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ', details: formatZodError(parsed.error) }, { status: 400 })
    }

    const { title, content, categoryId } = parsed.data
    const template = await prisma.messageTemplate.create({
      data: { title, content, categoryId },
      include: { category: true },
    })
    return NextResponse.json(template, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 })
  }
}
