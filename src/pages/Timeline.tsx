import { useState, useRef, useEffect, useCallback } from 'react'
import tripData from '../data/tripData'
import EventCard from '../components/EventCard'
import BottomSheet from '../components/BottomSheet'
import type { Event, Timetable } from '../data/tripData'

function getInitialDay(): number {
  const today = new Date().toISOString().slice(0, 10)
  const idx = tripData.days.findIndex(d => d.date === today)
  return idx >= 0 ? idx : 0
}

interface TimelineProps {
  initialDay?: number
}

export default function Timeline({ initialDay }: TimelineProps) {
  const [activeDay, setActiveDay] = useState(initialDay ?? getInitialDay())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [timetableEvent, setTimetableEvent] = useState<Event | null>(null)
  const listTouchStartX = useRef<number | null>(null)
  const listTouchStartY = useRef<number | null>(null)

  const day = tripData.days[activeDay]

  const handleTap = useCallback((event: Event) => {
    if (event.guide) {
      setSelectedEvent(event)
    } else if (event.timetableKey) {
      setTimetableEvent(event)
    }
  }, [])

  const handleClose = useCallback(() => {
    setSelectedEvent(null)
  }, [])

  const handleTimetableClose = useCallback(() => {
    setTimetableEvent(null)
  }, [])

  const handleListTouchStart = useCallback((e: React.TouchEvent) => {
    listTouchStartX.current = e.touches[0].clientX
    listTouchStartY.current = e.touches[0].clientY
  }, [])

  const handleListTouchEnd = useCallback((e: React.TouchEvent) => {
    if (listTouchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - listTouchStartX.current
    const dy = e.changedTouches[0].clientY - (listTouchStartY.current ?? 0)
    listTouchStartX.current = null
    listTouchStartY.current = null
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return

    if (dx < 0 && activeDay < tripData.days.length - 1) {
      // 왼쪽 스와이프 + 다음 DAY 있음 → DAY 전환
      e.stopPropagation()
      setActiveDay(d => d + 1)
    } else if (dx > 0 && activeDay > 0) {
      // 오른쪽 스와이프 + 이전 DAY 있음 → DAY 전환
      e.stopPropagation()
      setActiveDay(d => d - 1)
    }
    // 경계에서는 App.tsx 탭 네비게이션으로 위임 (stopPropagation 없음)
  }, [activeDay])

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}
      onTouchStart={handleListTouchStart}
      onTouchEnd={handleListTouchEnd}
    >
      {/* Day segment control */}
      <div
        style={{
          padding: '12px 16px 0',
          background: 'var(--color-background)',
          flexShrink: 0,
          borderBottom: '1px solid var(--color-outline-variant)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '6px',
            background: 'var(--color-surface-container)',
            borderRadius: 'var(--radius-xl)',
            padding: '4px',
            marginBottom: '12px',
          }}
        >
          {tripData.days.map((d, i) => (
            <button
              key={d.day}
              onClick={() => setActiveDay(i)}
              style={{
                flex: 1,
                padding: '8px 4px',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                background: activeDay === i ? 'var(--color-primary)' : 'transparent',
                color: activeDay === i ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s, color 0.15s',
                fontFamily: 'var(--font-body)',
              }}
            >
              DAY {d.day}
            </button>
          ))}
        </div>

        {/* Day header */}
        <div style={{ paddingBottom: '12px' }}>
          <p
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--color-on-surface)',
              margin: 0,
            }}
          >
            DAY {day.day} · {day.date.slice(5).replace('-', '/')}({day.dayOfWeek})
          </p>
          <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '2px 0 0' }}>
            {day.theme}
          </p>
        </div>
      </div>

      {/* Event list */}
      <div
        style={{
          overflowY: 'auto',
          flex: 1,
          padding: '16px 16px 100px',
        }}
      >
        {day.events.map(event => (
          <EventCard key={event.id} event={event} onTap={handleTap} />
        ))}
      </div>

      {/* Guide bottom sheet */}
      {selectedEvent?.guide && (
        <BottomSheet
          open={!!selectedEvent}
          title={selectedEvent.title}
          titleJa={selectedEvent.titleJa}
          guide={selectedEvent.guide}
          onClose={handleClose}
        />
      )}

      {/* Timetable bottom sheet */}
      {timetableEvent?.timetableKey && (() => {
        const tt = tripData.timetables[timetableEvent.timetableKey!]
        return tt ? (
          <TimetableSheet
            open
            title={timetableEvent.title}
            timetable={tt}
            onClose={handleTimetableClose}
          />
        ) : null
      })()}
    </div>
  )
}

function TimetableSheet({
  open,
  title,
  timetable,
  onClose,
}: {
  open: boolean
  title: string
  timetable: Timetable
  onClose: () => void
}) {
  const startY = useRef<number>(0)
  const isDragging = useRef(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
    isDragging.current = true
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    if (e.changedTouches[0].clientY - startY.current > 80) onClose()
    isDragging.current = false
  }

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(27,29,14,0.4)',
          zIndex: 200,
          animation: 'fadeIn 0.2s ease',
        }}
      />
      <div
        style={{
          position: 'fixed', bottom: 0,
          left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: '480px', maxHeight: '85dvh',
          background: 'var(--color-surface-container-lowest)',
          borderRadius: '24px 24px 0 0',
          boxShadow: 'var(--shadow-sheet)',
          zIndex: 201,
          display: 'flex', flexDirection: 'column',
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
          style={{ padding: '12px 0 8px', display: 'flex', justifyContent: 'center', cursor: 'grab', flexShrink: 0 }}
        >
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'var(--color-outline-variant)' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '4px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '17px', fontWeight: 600, color: 'var(--color-on-surface)', margin: 0, lineHeight: 1.3 }}>
              {timetable.label}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '2px 0 0' }}>
              {timetable.direction}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'var(--color-surface-container)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '12px', cursor: 'pointer' }}
            aria-label="닫기"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-on-surface-variant)' }}>close</span>
          </button>
        </div>

        <div style={{ height: '1px', background: 'var(--color-outline-variant)', flexShrink: 0, opacity: 0.5 }} />

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '16px 20px', flex: 1 }}>
          {timetable.entries.length === 0 ? (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '14px', background: 'var(--color-surface-container)', borderRadius: 'var(--radius-xl)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-tertiary)', flexShrink: 0, marginTop: '1px' }}>schedule</span>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)', margin: '0 0 4px' }}>시간표 준비 중</p>
                <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', margin: 0, lineHeight: 1.6 }}>
                  {timetable.todoNote ?? '7월 중 실제 시간표 확인 후 업데이트 예정.'}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {timetable.entries.map((entry, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'var(--color-surface-container)', borderRadius: 'var(--radius-lg)' }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-on-surface)', fontFamily: 'var(--font-headline)', minWidth: '44px' }}>
                    {entry.time}
                  </span>
                  {entry.note && (
                    <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{entry.note}</span>
                  )}
                </div>
              ))}
            </div>
          )}
          <div style={{ height: '16px' }} />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { transform:translateX(-50%) translateY(100%) } to { transform:translateX(-50%) translateY(0) } }
      `}</style>
    </>
  )
}
