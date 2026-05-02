import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.templateCategory.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const category = await prisma.templateCategory.update({ where: { id }, data: { code: body.code, name: body.name } })
  return NextResponse.json(category)
}
