import { useCallback } from 'react'
import tripData from '../data/tripData'
import { useWeather } from '../hooks/useWeather'
import Toast, { useToast } from '../components/Toast'
import type { Event } from '../data/tripData'

function getCurrentEvent(): { current: Event | null; next: Event | null; dayIdx: number } {
  const now = new Date()
  const nowDate = now.toISOString().slice(0, 10)
  const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const start = tripData.meta.startDate
  const end = tripData.meta.endDate

  // Before or after trip: show day 1
  if (nowDate < start || nowDate > end) {
    const events = tripData.days[0].events
    return { current: events[0], next: events[1] ?? null, dayIdx: 0 }
  }

  const dayData = tripData.days.find(d => d.date === nowDate)
  if (!dayData) return { current: tripData.days[0].events[0], next: null, dayIdx: 0 }

  const dayIdx = tripData.days.findIndex(d => d.date === nowDate)
  const events = dayData.events
  let currentIdx = events.findLastIndex(e => e.time <= nowTime)
  if (currentIdx < 0) currentIdx = 0

  return {
    current: events[currentIdx] ?? null,
    next: events[currentIdx + 1] ?? null,
    dayIdx,
  }
}

function copy(text: string, showToast: (msg: string) => void) {
  navigator.clipboard.writeText(text).then(() => showToast('복사됨 ✓'))
}

interface HomeProps {
  onGoTimeline: (dayIdx: number) => void
  onGoBookings: () => void
}

const TYPE_ICON: Record<Event['type'], string> = {
  transport: 'directions_transit',
  sightseeing: 'photo_camera',
  meal: 'restaurant',
  activity: 'hiking',
  accommodation: 'hotel',
}

export default function Home({ onGoTimeline, onGoBookings }: HomeProps) {
  const { weather, loading, weatherLabel, weatherIcon, fallbackText } = useWeather()
  const { toastMessage, toastVisible, showToast, hideToast } = useToast()
  const { current, next, dayIdx } = getCurrentEvent()
  const acc = tripData.accommodation

  const handleCopyRef = useCallback(() => {
    copy(acc.bookingRef, showToast)
  }, [acc.bookingRef, showToast])

  return (
    <div style={{ padding: '0 16px 100px', overflowY: 'auto', flex: 1 }}>
      {/* Header */}
      <div
        style={{
          padding: '20px 0 16px',
          borderBottom: '1px solid var(--color-outline-variant)',
          marginBottom: '16px',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '22px',
            fontWeight: 600,
            color: 'var(--color-on-surface)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Tsuruoka Excursion
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--color-on-surface-variant)',
            margin: '4px 0 0',
          }}
        >
          쓰루오카·사카타 · 2026.08.06~08.09 · 2명
        </p>
      </div>

      {/* Weather card */}
      <div
        style={{
          background: 'var(--color-primary-fixed)',
          borderRadius: 'var(--radius-2xl)',
          padding: '16px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <span
          className="material-symbols-outlined fill"
          style={{ fontSize: '36px', color: 'var(--color-primary-container)' }}
        >
          {loading ? 'cloud' : weatherIcon}
        </span>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--color-primary-container)',
              margin: 0,
              fontWeight: 500,
            }}
          >
            쓰루오카 날씨
          </p>
          {loading ? (
            <p style={{ fontSize: '14px', color: 'var(--color-primary-container)', margin: '2px 0 0' }}>
              로딩 중…
            </p>
          ) : weather ? (
            <p
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--color-primary-container)',
                margin: '2px 0 0',
              }}
            >
              {weather.temperature}°C &nbsp;
              <span style={{ fontSize: '14px', fontWeight: 400 }}>{weatherLabel}</span>
              {weather.source === 'fallback' && (
                <span style={{ fontSize: '11px', marginLeft: '6px', opacity: 0.7 }}>(오프라인)</span>
              )}
            </p>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--color-primary-container)', margin: '2px 0 0' }}>
              {fallbackText}
            </p>
          )}
        </div>
      </div>

      {/* Current schedule highlight */}
      {current && (
        <div
          style={{
            background: 'var(--color-surface-container-lowest)',
            borderRadius: 'var(--radius-2xl)',
            padding: '16px',
            marginBottom: '12px',
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
          onClick={() => onGoTimeline(dayIdx)}
        >
          <p
            style={{
              fontSize: '11px',
              color: 'var(--color-primary)',
              fontWeight: 600,
              margin: '0 0 8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            현재 일정
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-primary-fixed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>
                {TYPE_ICON[current.type]}
              </span>
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--color-on-surface)',
                  margin: 0,
                }}
              >
                {current.title}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '2px 0 0' }}>
                DAY {dayIdx + 1} · {current.time}
              </p>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-outline)', marginLeft: 'auto' }}>
              chevron_right
            </span>
          </div>

          {next && (
            <>
              <div style={{ height: '1px', background: 'var(--color-outline-variant)', margin: '12px 0', opacity: 0.5 }} />
              <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', margin: '0 0 6px', fontWeight: 500 }}>
                다음 일정
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-on-surface-variant)' }}>
                  {TYPE_ICON[next.type]}
                </span>
                <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', margin: 0 }}>
                  {next.time} · {next.title}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Accommodation card */}
      <div
        style={{
          background: 'var(--color-surface-container-lowest)',
          borderRadius: 'var(--radius-2xl)',
          padding: '16px',
          boxShadow: 'var(--shadow-card)',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
        onClick={onGoBookings}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>hotel</span>
          <p
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-on-surface)',
              margin: 0,
            }}
          >
            {acc.name}
          </p>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-outline)', marginLeft: 'auto' }}>
            chevron_right
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '12px',
          }}
        >
          {[
            { icon: 'login', label: '체크인', value: '8/6(목)' },
            { icon: 'logout', label: '체크아웃', value: '8/9(일)' },
            { icon: 'bed', label: '기간', value: `${acc.nights}박` },
          ].map(item => (
            <div
              key={item.label}
              style={{
                background: 'var(--color-surface-container)',
                borderRadius: 'var(--radius-lg)',
                padding: '6px 10px',
                flex: 1,
                minWidth: '80px',
              }}
            >
              <p style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', margin: 0 }}>{item.label}</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)', margin: '1px 0 0' }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Booking ref copy */}
        <div
          onClick={e => { e.stopPropagation(); handleCopyRef() }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-surface-container)',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 12px',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <div>
            <p style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', margin: 0 }}>
              {acc.bookingService} 일정번호
            </p>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-on-surface)', margin: '2px 0 0', letterSpacing: '0.5px' }}>
              {acc.bookingRef}
            </p>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>
            content_copy
          </span>
        </div>
      </div>

      {/* Tips */}
      <div
        style={{
          background: 'var(--color-surface-container-low)',
          borderRadius: 'var(--radius-xl)',
          padding: '12px 14px',
          marginTop: '12px',
          display: 'flex',
          gap: '10px',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-secondary)', flexShrink: 0, marginTop: '1px' }}>
          payments
        </span>
        <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: 0, lineHeight: 1.6 }}>
          {tripData.tips.payment}
        </p>
      </div>

      <Toast message={toastMessage} visible={toastVisible} onHide={hideToast} />
    </div>
  )
}
