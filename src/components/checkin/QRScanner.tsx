'use client'

import { useRef, useEffect } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Button } from '@/components/ui/button'

interface QRScannerProps {
  onQRScanned: (qrCode: string) => void
  onError: (error: string) => void
  scanning: boolean
  onScanningChange: (scanning: boolean) => void
}

export default function QRScanner({ onQRScanned, onError, scanning, onScanningChange }: QRScannerProps) {
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null)
  const cameraIdRef = useRef<string | null>(null)
  const isTransitioning = useRef(false)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (html5QrCodeRef.current && scanning && !isTransitioning.current) {
        isTransitioning.current = true
        html5QrCodeRef.current.stop?.()
          .then(() => html5QrCodeRef.current?.clear?.())
          .catch(() => {})
          .finally(() => { isTransitioning.current = false })
      }
    }
  }, [scanning])

  const startCameraScan = async () => {
    onError('')
    onScanningChange(true)
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader')
      }
      const devices = await Html5Qrcode.getCameras()
      if (devices && devices.length) {
        // Prefer back camera on mobile
        const backCamera = devices.find(
          (d) =>
            d.label.toLowerCase().includes('back') ||
            d.label.toLowerCase().includes('environment')
        );
        cameraIdRef.current = backCamera ? backCamera.id : devices[0].id;
        await html5QrCodeRef.current.start(
          cameraIdRef.current,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText: string) => {
            onQRScanned(decodedText)
            onScanningChange(false)
          },
          () => {
            // ignore scan errors
          }
        )
      } else {
        onError('No camera found')
        onScanningChange(false)
      }
    } catch (err) {
      onError('Camera error: ' + (err instanceof Error ? err.message : 'Unknown error'))
      onScanningChange(false)
    }
  }

  const stopCameraScan = async () => {
    if (isTransitioning.current) return
    isTransitioning.current = true
    onScanningChange(false)
    if (html5QrCodeRef.current) {
      try {
        // Only stop if the scanner is running
        if (html5QrCodeRef.current.getState && html5QrCodeRef.current.getState() === 2) { // 2 = SCANNING
          await html5QrCodeRef.current.stop()
        }
        await html5QrCodeRef.current.clear()
      } catch (err) {
        // Ignore 'scanner is not running or paused' error
        if (
          typeof err === 'object' &&
          err !== null &&
          'message' in err &&
          (err.message as string).includes('scanner is not running or paused')
        ) {
          // Do nothing
        } else {
          console.error('QR scanner stop error:', err)
        }
      }
    }
    isTransitioning.current = false
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button onClick={startCameraScan} variant="outline" className="w-full" disabled={scanning}>
          {scanning ? 'Scanning...' : 'Scan with Camera'}
        </Button>
      </div>
      
      {scanning && (
        <div className="flex justify-end mb-2">
          <Button size="sm" variant="outline" onClick={stopCameraScan}>
            Close Camera
          </Button>
        </div>
      )}
      
      <div id="qr-reader" className="w-full flex justify-center" style={{ minHeight: scanning ? 260 : 0 }} />
    </div>
  )
} 