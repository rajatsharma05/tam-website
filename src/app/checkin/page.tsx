'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import QRScanner from '@/components/checkin/QRScanner'
import CheckinForm from '@/components/checkin/CheckinForm'
import CheckinResult from '@/components/checkin/CheckinResult'
import type { CheckinResult as CheckinResultType } from '@/types'

export default function CheckinPage() {
  const [qrCode, setQrCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckinResultType | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scannedQRCodes, setScannedQRCodes] = useState<Set<string>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleQRScanned = (decodedText: string) => {
    // Check if this QR code was already scanned in this session
    if (scannedQRCodes.has(decodedText)) {
      setError('This QR code has already been scanned in this session')
      return
    }
    
    setQrCode(decodedText)
    handleCheckin(decodedText)
  }

  const handleCheckin = async (code?: string) => {
    const codeToCheck = code || qrCode
    if (!codeToCheck.trim()) {
      setError('Please enter a QR code')
      return
    }
    
    // Check if this QR code was already processed in this session
    if (scannedQRCodes.has(codeToCheck.trim())) {
      setError('This QR code has already been processed in this session')
      return
    }
    
    setLoading(true)
    setIsProcessing(true)
    setError('')
    setResult(null)
    
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCode: codeToCheck.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        // Add to scanned set only after successful check-in
        setScannedQRCodes(prev => new Set(prev).add(codeToCheck.trim()))
      } else {
        setError(data.error || 'Check-in failed')
        // Don't add to scanned set if check-in failed
      }
    } catch {
      setError('Network error. Please try again.')
      // Don't add to scanned set if network error occurred
    } finally {
      setLoading(false)
      setIsProcessing(false)
    }
  }

  const downloadExcel = () => {
    if (result?.excelData) {
      const blob = new Blob([Buffer.from(result.excelData, 'base64')], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `checkin-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleCheckAnother = () => {
    setQrCode('')
    setResult(null)
    setError('')
    // Keep the scanned QR codes in memory to prevent duplicates in the same session
    // Only clear if user explicitly wants to start fresh
  }

  const handleClearSession = () => {
    setQrCode('')
    setResult(null)
    setError('')
    setScannedQRCodes(new Set()) // Clear scanned QR codes
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Event <span className="text-gradient">Check-in</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scan QR codes or enter them manually to check in attendees
          </p>
        </div>

        <Card className="card-hover border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900">Check-in Station</CardTitle>
            {scannedQRCodes.size > 0 && (
              <div className="mt-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary-600 text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Checked in {scannedQRCodes.size} QR code(s) this session
                </div>
              </div>
            )}
            {isProcessing && (
              <div className="mt-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing check-in...
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="animate-fade-in">
                <CheckinForm
                  qrCode={qrCode}
                  onQRCodeChange={setQrCode}
                  onCheckin={() => handleCheckin()}
                  loading={loading}
                  scanning={scanning}
                />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                <QRScanner
                  onQRScanned={handleQRScanned}
                  onError={setError}
                  scanning={scanning}
                  onScanningChange={setScanning}
                />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                <CheckinResult
                  result={result}
                  error={error}
                  onDownloadExcel={downloadExcel}
                  onCheckAnother={handleCheckAnother}
                  onClearSession={handleClearSession}
                  hasScannedCodes={scannedQRCodes.size > 0}
                />
              </div>
              
              {scannedQRCodes.size > 0 && (
                <div className="text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <button
                    onClick={handleClearSession}
                    className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                  >
                    Clear session history
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 