'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  todayCustomers: number; pendingZalo: number; pendingCall: number
  contactedCount: number; messagedCount: number; total: number; conversionRate: number
}

export interface UrgentCustomer { id: string; name: string; phone: string; status: string }

export interface Customer {
  id: string; name: string; phone: string; email: string | null; address: string | null; note: string | null
  status: string; source: { name: string } | null; createdAt: string
}

export interface CustomerDetail {
  id: string; name: string; phone: string; email: string | null; address: string | null; note: string | null
  status: string; source: { name: string } | null; zaloSentAt: string | null; createdAt: string
  logs: Array<{ id: string; action: string; note: string | null; createdAt: string; template: { title: string; content: string } | null }>
}

export interface Template {
  id: string; title: string; content: string; categoryId: string; category: { id: string; name: string } | null; createdAt: string
}

export interface TemplateCategory {
  id: string; code: string; name: string; _count: { templates: number }
}

export interface Source { id: string; code: string; name: string }

export interface Appointment {
  id: string; scheduledAt: string; note: string | null; completed: boolean
  customer: { name: string; phone: string }
}

export interface Settings {
  tgChoAloSauKB: number; tgChoNhantinSauGoiKhongNghe: number; tgLapLichNhantinLan2: number
}

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const queryKeys = {
  dashboard: ['dashboard'] as const,
  customers: {
    all: ['customers'] as const,
    urgent: ['customers', 'urgent'] as const,
    list: (filters?: { status?: string; sourceId?: string }) => ['customers', filters] as const,
    detail: (id: string) => ['customers', id] as const,
  },
  sources: ['sources'] as const,
  templates: {
    all: ['templates'] as const,
    byCategory: (categoryId: string) => ['templates', categoryId] as const,
  },
  templateCategories: ['template-categories'] as const,
  appointments: ['appointments'] as const,
  settings: ['settings'] as const,
}

// ─── Query Hooks ──────────────────────────────────────────────────────────────

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => apiFetch<DashboardStats>('/api/dashboard'),
  })
}

export function useUrgentCustomers() {
  return useQuery({
    queryKey: queryKeys.customers.urgent,
    queryFn: () => apiFetch<UrgentCustomer[]>('/api/customers?status=PENDING_ZALO'),
    select: (data) => data.slice(0, 6),
  })
}

export function useCustomers(filters?: { status?: string; sourceId?: string }) {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.sourceId) params.set('sourceId', filters.sourceId)
  const qs = params.toString()

  return useQuery({
    queryKey: queryKeys.customers.list(filters),
    queryFn: () => apiFetch<Customer[]>(`/api/customers${qs ? '?' + qs : ''}`),
  })
}

export function useCustomerDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => apiFetch<CustomerDetail>(`/api/customers/${id}`),
    enabled: !!id,
  })
}

export function useSources() {
  return useQuery({
    queryKey: queryKeys.sources,
    queryFn: () => apiFetch<Source[]>('/api/sources'),
  })
}

export function useTemplates() {
  return useQuery({
    queryKey: queryKeys.templates.all,
    queryFn: () => apiFetch<Template[]>('/api/templates'),
  })
}

export function useTemplatesByCategory(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.templates.byCategory(categoryId),
    queryFn: () => apiFetch<Template[]>(`/api/templates?categoryId=${categoryId}`),
    enabled: !!categoryId,
  })
}

export function useTemplateCategories() {
  return useQuery({
    queryKey: queryKeys.templateCategories,
    queryFn: () => apiFetch<TemplateCategory[]>('/api/template-categories'),
  })
}

export function useAppointments() {
  return useQuery({
    queryKey: queryKeys.appointments,
    queryFn: () => apiFetch<Appointment[]>('/api/appointments'),
  })
}

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => apiFetch<Settings>('/api/settings'),
  })
}

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export function useCreateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; phone: string; email?: string; address?: string; note?: string; sourceId: string }) =>
      apiFetch('/api/customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.customers.all })
    },
  })
}

export function useDeleteCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/customers/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.customers.all })
    },
  })
}

export function useCustomerAction(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { action: string; note?: string; templateId?: string }) =>
      apiFetch(`/api/customers/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.customers.detail(id) })
      qc.invalidateQueries({ queryKey: queryKeys.customers.all })
      qc.invalidateQueries({ queryKey: queryKeys.dashboard })
    },
  })
}

export function useCreateSource() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { code: string; name: string }) =>
      apiFetch('/api/sources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sources })
    },
  })
}

export function useCreateTemplateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { code: string; name: string }) =>
      apiFetch('/api/template-categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.templateCategories })
    },
  })
}

export function useDeleteTemplateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/template-categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.templateCategories })
      qc.invalidateQueries({ queryKey: queryKeys.templates.all })
    },
  })
}

export function useCreateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; content: string; categoryId: string }) =>
      apiFetch('/api/templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.templates.all })
      qc.invalidateQueries({ queryKey: queryKeys.templateCategories })
    },
  })
}

export function useDeleteTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/templates/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.templates.all })
      qc.invalidateQueries({ queryKey: queryKeys.templateCategories })
    },
  })
}

export function useUpdateSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Settings) =>
      apiFetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.settings })
    },
  })
}
