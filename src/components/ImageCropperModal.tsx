import React, { useState, useRef, useEffect } from 'react'
import { Camera, Upload, Check, X, RotateCw, ZoomIn, Image as ImageIcon } from 'lucide-react'

interface ImageCropperModalProps {
  isOpen: boolean
  onClose: () => void
  onCropComplete: (croppedBase64: string) => void
}

export function ImageCropperModal({ isOpen, onClose, onCropComplete }: ImageCropperModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [zoom, setZoom] = useState<number>(1)
  const [rotation, setRotation] = useState<number>(0)
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setImageSrc(null)
      setZoom(1)
      setRotation(0)
      setOffset({ x: 0, y: 0 })
    }
  }, [isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string)
          setZoom(1)
          setRotation(0)
          setOffset({ x: 0, y: 0 })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Draw on canvas when image or transform changes
  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.src = imageSrc
    img.onload = () => {
      imageRef.current = img
      drawImageToCanvas(ctx, canvas, img)
    }
  }, [imageSrc, zoom, rotation, offset])

  const drawImageToCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) => {
    canvas.width = 400
    canvas.height = 400
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(canvas.width / 2 + offset.x, canvas.height / 2 + offset.y)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(zoom, zoom)

    // center image
    const w = img.width
    const h = img.height
    const aspect = w / h
    let drawW = 400
    let drawH = 400 / aspect
    if (drawH < 400) {
      drawH = 400
      drawW = 400 * aspect
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
    ctx.restore()
  }

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleSave = () => {
    if (!canvasRef.current) return
    const croppedUrl = canvasRef.current.toDataURL('image/jpeg', 0.85)
    onCropComplete(croppedUrl)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Camera className="w-6 h-6 text-emerald-600" />
            Upload Photo from Device
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!imageSrc ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-2xl p-8 bg-emerald-50/50 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shadow-inner">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base mb-1">Select from Phone Storage or Gallery</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Access your phone device photo library, album, or take a new picture with your camera.
              </p>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
              >
                <ImageIcon className="w-4 h-4" /> Device Gallery / Files
              </button>
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 bg-gray-900 hover:bg-black text-white font-semibold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
              >
                <Camera className="w-4 h-4 text-amber-400" /> Take Camera Photo
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-xs text-gray-500 mb-2">Drag to reposition, use slider to zoom & rotate</p>
            <div
              className="relative w-[280px] h-[280px] rounded-full overflow-hidden border-4 border-emerald-600 shadow-inner cursor-move bg-gray-900 flex items-center justify-center select-none touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              <canvas ref={canvasRef} className="w-full h-full object-cover" />
            </div>

            {/* Controls */}
            <div className="w-full mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <ZoomIn className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-600 w-12">Zoom</span>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-600 w-12">Rotate</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="90"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setImageSrc(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl text-sm transition"
                >
                  Choose Different
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Save Photo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
