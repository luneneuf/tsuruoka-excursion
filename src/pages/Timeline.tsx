import { useState, useCallback } from 'react'
import tripData from '../data/tripData'
import EventCard from '../components/EventCard'
import BottomSheet from '../components/BottomSheet'
import type { Event } from '../data/tripData'

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

  const day = tripData.days[activeDay]

  const handleTap = useCallback((event: Event) => {
    setSelectedEvent(event)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedEvent(null)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
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

      {/* Bottom sheet */}
      {selectedEvent?.guide && (
        <BottomSheet
          open={!!selectedEvent}
          title={selectedEvent.title}
          titleJa={selectedEvent.titleJa}
          guide={selectedEvent.guide}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
