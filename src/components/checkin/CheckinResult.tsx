'use client'

import { Button } from '@/components/ui/button'
import type { CheckinResult } from '@/types'

interface CheckinResultProps {
  result: CheckinResult | null
  error: string
  onDownloadExcel: () => void
  onCheckAnother: () => void
  onClearSession?: () => void
  hasScannedCodes?: boolean
}

export default function CheckinResult({ 
  result, 
  error, 
  onDownloadExcel, 
  onCheckAnother,
  onClearSession,
  hasScannedCodes = false
}: CheckinResultProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-3">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  if (!result) {
    return null
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4">
      <div className="flex items-center mb-3">
        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="font-semibold text-green-800">Check-in Successful!</h3>
      </div>

      <div className="space-y-2 text-sm text-green-700">
        <p><strong>Event:</strong> {result?.registration?.eventName}</p>
        <p><strong>Name:</strong> {result?.registration?.registrantName}</p>
        <p><strong>Email:</strong> {result?.registration?.email}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={onDownloadExcel} variant="outline" size="sm">
          Download Excel
        </Button>
        <Button onClick={onCheckAnother} variant="outline" size="sm">
          Check Another
        </Button>
        {hasScannedCodes && onClearSession && (
          <Button onClick={onClearSession} variant="outline" size="sm" className="text-orange-600 hover:text-orange-700">
            Clear Session
          </Button>
        )}
      </div>
    </div>
  )
} 