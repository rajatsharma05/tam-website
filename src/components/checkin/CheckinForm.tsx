'use client'

import { Button } from '@/components/ui/button'

interface CheckinFormProps {
  qrCode: string
  onQRCodeChange: (qrCode: string) => void
  onCheckin: () => void
  loading: boolean
  scanning: boolean
}

export default function CheckinForm({ 
  qrCode, 
  onQRCodeChange, 
  onCheckin, 
  loading, 
  scanning 
}: CheckinFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="qrCode" className="block text-sm font-medium text-gray-700 mb-1">
          QR Code
        </label>
        <input
          type="text"
          id="qrCode"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter or scan QR code"
          value={qrCode}
          onChange={(e) => onQRCodeChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onCheckin()}
          disabled={scanning}
        />
      </div>
      
      <Button onClick={onCheckin} className="w-full" disabled={loading || scanning}>
        {loading ? 'Processing...' : 'Check In'}
      </Button>
    </div>
  )
} 