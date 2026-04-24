import { useEffect, useRef, useCallback } from 'react'
import type { EventGuide } from '../data/tripData'

interface BottomSheetProps {
  open: boolean
  title: string
  titleJa: string
  guide: EventGuide
  onClose: () => void
}

export default function BottomSheet({ open, title, titleJa, guide, onClose }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const startY = useRef<number>(0)
  const isDragging = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
    isDragging.current = true
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return
    const deltaY = e.changedTouches[0].clientY - startY.current
    if (deltaY > 80) onClose()
    isDragging.current = false
  }, [onClose])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(27,29,14,0.4)',
          zIndex: 200,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '85dvh',
          background: 'var(--color-surface-container-lowest)',
          borderRadius: '24px 24px 0 0',
          boxShadow: 'var(--shadow-sheet)',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s cubic-bezier(0.32,0.72,0,1)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Handle */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            padding: '12px 0 8px',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'grab',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '36px',
              height: '4px',
              borderRadius: '2px',
              background: 'var(--color-outline-variant)',
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            padding: '4px 20px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--color-on-surface)',
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {title}
            </h2>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--color-on-surface-variant)',
                margin: '2px 0 0',
              }}
            >
              {titleJa}
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-primary)',
                margin: '6px 0 0',
                fontWeight: 500,
              }}
            >
              {guide.summary}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'var(--color-surface-container)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginLeft: '12px',
              cursor: 'pointer',
            }}
            aria-label="닫기"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-on-surface-variant)' }}>close</span>
          </button>
        </div>

        <div
          style={{
            height: '1px',
            background: 'var(--color-outline-variant)',
            flexShrink: 0,
            opacity: 0.5,
          }}
        />

        {/* Body */}
        <div
          style={{
            overflowY: 'auto',
            padding: '16px 20px',
            flex: 1,
          }}
        >
          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.75,
              color: 'var(--color-on-surface)',
              whiteSpace: 'pre-line',
              margin: 0,
            }}
          >
            {guide.description}
          </p>

          {guide.tips && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 14px',
                background: 'var(--color-surface-container-low)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '18px', color: 'var(--color-secondary)', flexShrink: 0, marginTop: '1px' }}
              >
                lightbulb
              </span>
              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: 'var(--color-on-surface-variant)',
                  margin: 0,
                }}
              >
                {guide.tips}
              </p>
            </div>
          )}

          <div style={{ height: '16px' }} />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { transform: translateX(-50%) translateY(100%) } to { transform: translateX(-50%) translateY(0) } }
      `}</style>
    </>
  )
}
