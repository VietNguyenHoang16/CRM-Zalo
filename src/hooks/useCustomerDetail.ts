'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiFetch } from '@/lib/api'

interface Customer {
  id: string; name: string; phone: string; email: string | null; address: string | null; note: string | null
  status: string; source: { name: string } | null; zaloSentAt: string | null; createdAt: string
  logs: Array<{ id: string; action: string; note: string | null; createdAt: string; template: { title: string; content: string } | null }>
}

interface Template {
  id: string; title: string; content: string; group: string
}

export function useCustomerDetail(customerId: string) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<{ id: string; title: string; content: string } | null>(null)

  const fetchCustomer = useCallback(() => {
    apiFetch<Customer>(`/api/customers/${customerId}`).then(setCustomer).catch(() => {})
  }, [customerId])

  useEffect(() => {
    fetchCustomer()
    apiFetch<Template[]>('/api/templates').then(setTemplates).catch(() => {})
  }, [customerId, fetchCustomer])

  const handleAction = async (action: string, note?: string, templateId?: string) => {
    await apiFetch(`/api/customers/${customerId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, note, templateId }),
    })
    fetchCustomer()
    setSelectedTemplate(null)
  }

  return {
    customer,
    templates,
    selectedTemplate,
    setSelectedTemplate,
    handleAction,
  }
}
