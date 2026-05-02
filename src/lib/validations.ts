import { z } from 'zod'

export const CustomerStatusEnum = z.enum([
  'NEW', 'PENDING_ZALO', 'ZALO_CONNECTED', 'PENDING_CALL',
  'CONTACTED', 'MESSAGED', 'PAUSED', 'DEAL_WON', 'DEAL_LOST',
])

export const ActionTypeEnum = z.enum([
  'ZALO_SENT', 'ZALO_ACCEPTED', 'CALL_MADE', 'CALL_MISSED',
  'MESSAGE_SENT', 'STATUS_CHANGE', 'APPOINTMENT_SET',
])

export const TemplateGroupEnum = z.enum([
  'CHAO_MOI', 'RECONNECT', 'CHAM_SOC', 'KHAC',
])

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Tên shop là bắt buộc'),
  phone: z.string().regex(/^[0-9]{9,11}$/, 'Số điện thoại không hợp lệ (9-11 chữ số)'),
  email: z.preprocess((v) => (v === '' ? null : v), z.string().email('Email không hợp lệ').nullable().optional()),
  address: z.string().nullable().transform(v => v === '' ? null : v).optional(),
  note: z.string().nullable().transform(v => v === '' ? null : v).optional(),
  sourceId: z.string().min(1, 'Nguồn khách là bắt buộc'),
})

export const updateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().regex(/^[0-9]{9,11}$/, 'Số điện thoại không hợp lệ').optional(),
  email: z.preprocess((v) => (v === '' ? null : v), z.string().email('Email không hợp lệ').nullable().optional()),
  address: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  sourceId: z.string().nullable().optional(),
  status: CustomerStatusEnum.optional(),
})

export const createActionSchema = z.object({
  action: ActionTypeEnum,
  note: z.string().nullable().optional(),
  templateId: z.string().nullable().optional(),
})

export const createTemplateSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  group: TemplateGroupEnum,
})

export const createSourceSchema = z.object({
  code: z.string().min(1, 'Mã nguồn là bắt buộc'),
  name: z.string().min(1, 'Tên nguồn là bắt buộc'),
})

export const updateSettingsSchema = z.object({
  tgChoAloSauKB: z.number().int().min(1).optional(),
  tgChoNhantinSauGoiKhongNghe: z.number().int().min(1).optional(),
  tgLapLichNhantinLan2: z.number().int().min(1).optional(),
})

export function formatZodError(error: z.ZodError) {
  return error.issues.map((e: z.ZodIssue) => ({
    field: e.path.join('.'),
    message: e.message,
  }))
}
