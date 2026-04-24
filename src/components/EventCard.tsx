import type { Event } from '../data/tripData'

const TYPE_ICON: Record<Event['type'], string> = {
  transport: 'directions_transit',
  sightseeing: 'photo_camera',
  meal: 'restaurant',
  activity: 'hiking',
  accommodation: 'hotel',
}

const TYPE_BG: Record<Event['type'], string> = {
  transport: 'var(--color-surface-container)',
  sightseeing: 'var(--color-guide-sightseeing)',
  meal: 'var(--color-guide-meal)',
  activity: 'var(--color-guide-activity)',
  accommodation: 'var(--color-guide-accommodation)',
}

interface EventCardProps {
  event: Event
  onTap?: (event: Event) => void
}

export default function EventCard({ event, onTap }: EventCardProps) {
  const hasGuide = !!event.guide
  const hasAlert = !!event.alert
  const isClickable = hasGuide

  const cardBg = hasGuide ? TYPE_BG[event.type] : 'var(--color-surface-container-lowest)'

  const handleClick = () => {
    if (isClickable && onTap) onTap(event)
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}
    >
      {/* Timeline line + time */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '44px',
          flexShrink: 0,
          paddingTop: '4px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--color-on-surface-variant)',
            letterSpacing: '0.3px',
            lineHeight: 1,
          }}
        >
          {event.time}
        </span>
      </div>

      {/* Card */}
      <div
        onClick={handleClick}
        style={{
          flex: 1,
          background: cardBg,
          borderRadius: 'var(--radius-xl)',
          padding: '12px 14px',
          cursor: isClickable ? 'pointer' : 'default',
          borderLeft: hasAlert ? '3px solid var(--color-error)' : 'none',
          boxShadow: 'var(--shadow-card)',
          transition: 'transform 0.1s',
          marginBottom: '8px',
          WebkitTapHighlightColor: 'transparent',
        }}
        onPointerDown={e => { if (isClickable) (e.currentTarget as HTMLDivElement).style.transform = 'scale(0.98)' }}
        onPointerUp={e => { (e.currentTarget as HTMLDivElement).style.transform = '' }}
        onPointerLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = '' }}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-label={isClickable ? `${event.title} — 상세 보기` : undefined}
        onKeyDown={e => { if (isClickable && (e.key === 'Enter' || e.key === ' ')) handleClick() }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          {/* Icon */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255,255,255,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '18px',
                color: 'var(--color-primary)',
              }}
            >
              {TYPE_ICON[event.type]}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--color-on-surface)',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {event.title}
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-on-surface-variant)',
                    margin: '1px 0 0',
                  }}
                >
                  {event.titleJa}
                </p>
              </div>
              {hasGuide && (
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '16px',
                    color: 'var(--color-primary)',
                    marginLeft: '6px',
                    flexShrink: 0,
                  }}
                >
                  info
                </span>
              )}
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: '12px',
                color: 'var(--color-on-surface-variant)',
                margin: '6px 0 0',
                lineHeight: 1.5,
              }}
            >
              {event.description}
            </p>

            {/* Cost / Duration row */}
            {(event.cost || event.duration) && (
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '6px',
                }}
              >
                {event.cost && (
                  <span style={{ fontSize: '12px', color: 'var(--color-secondary)', fontWeight: 600 }}>
                    {event.cost}
                  </span>
                )}
                {event.duration && (
                  <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                    ⏱ {event.duration}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Alert */}
        {hasAlert && (
          <div
            style={{
              marginTop: '10px',
              padding: '8px 10px',
              background: 'var(--color-error-container)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              gap: '6px',
              alignItems: 'flex-start',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '14px', color: 'var(--color-error)', flexShrink: 0, marginTop: '1px' }}
            >
              warning
            </span>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--color-error)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {event.alert}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
