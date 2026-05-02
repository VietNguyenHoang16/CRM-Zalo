'use client'
import { useState, useCallback } from 'react'
import { useCustomerDetail as useCustomerDetailQuery, useTemplates, useCustomerAction } from '@/hooks/queries'

interface SelectedTemplate {
  id: string; title: string; content: string
}

export function useCustomerDetail(customerId: string) {
  const { data: customer, isLoading: customerLoading } = useCustomerDetailQuery(customerId)
  const { data: templates = [], isLoading: templatesLoading } = useTemplates()
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate | null>(null)
  const action = useCustomerAction(customerId)

  const handleAction = useCallback(async (actionType: string, note?: string, templateId?: string) => {
    await action.mutateAsync({ action: actionType, note, templateId })
    setSelectedTemplate(null)
  }, [action])

  return {
    customer: customer ?? null,
    templates,
    selectedTemplate,
    setSelectedTemplate,
    handleAction,
    isLoading: customerLoading || templatesLoading,
    isActionPending: action.isPending,
  }
}
