export type CustomerStatus = 'NEW' | 'PENDING_ZALO' | 'ZALO_CONNECTED' | 'PENDING_CALL' | 'CONTACTED' | 'MESSAGED' | 'PAUSED' | 'DEAL_WON' | 'DEAL_LOST'
export type ActionType = 'ZALO_SENT' | 'ZALO_ACCEPTED' | 'CALL_MADE' | 'CALL_MISSED' | 'MESSAGE_SENT' | 'STATUS_CHANGE' | 'APPOINTMENT_SET'
export type TemplateGroup = 'CHAO_MOI' | 'RECONNECT' | 'CHAM_SOC' | 'KHAC'

export const STATUS_LABELS: Record<CustomerStatus, string> = {
  NEW: 'Mới',
  PENDING_ZALO: 'Chờ KB Zalo',
  ZALO_CONNECTED: 'Đã KB Zalo',
  PENDING_CALL: 'Chờ gọi lại',
  CONTACTED: 'Đã liên hệ',
  MESSAGED: 'Đã nhắn tin',
  PAUSED: 'Tạm dừng',
  DEAL_WON: 'Deal thành công',
  DEAL_LOST: 'Thất bại',
}

export const STATUS_COLORS: Record<CustomerStatus, string> = {
  NEW: 'border-l-gray-400 bg-gray-50',
  PENDING_ZALO: 'border-l-yellow-500 bg-yellow-50',
  ZALO_CONNECTED: 'border-l-blue-500 bg-blue-50',
  PENDING_CALL: 'border-l-orange-500 bg-orange-50',
  CONTACTED: 'border-l-green-500 bg-green-50',
  MESSAGED: 'border-l-purple-500 bg-purple-50',
  PAUSED: 'border-l-gray-300 bg-gray-100',
  DEAL_WON: 'border-l-emerald-600 bg-emerald-50',
  DEAL_LOST: 'border-l-red-500 bg-red-50',
}

export const TEMPLATE_GROUP_LABELS: Record<TemplateGroup, string> = {
  CHAO_MOI: 'Chào mời',
  RECONNECT: 'Reconnect',
  CHAM_SOC: 'Chăm sóc',
  KHAC: 'Khác',
}

export const ACTION_LABELS: Record<ActionType, string> = {
  ZALO_SENT: 'Đã gửi KB Zalo',
  ZALO_ACCEPTED: 'Đã kết bạn Zalo',
  CALL_MADE: 'Đã gọi',
  CALL_MISSED: 'Gọi không được',
  MESSAGE_SENT: 'Đã nhắn tin',
  STATUS_CHANGE: 'Đổi trạng thái',
  APPOINTMENT_SET: 'Đặt hẹn',
}

export function replaceVariables(content: string, data: { ten?: string; sdt?: string; nguon?: string }): string {
  return content
    .replace(/\{ten\}/g, data.ten || '')
    .replace(/\{sdt\}/g, data.sdt || '')
    .replace(/\{nguon\}/g, data.nguon || '')
}
