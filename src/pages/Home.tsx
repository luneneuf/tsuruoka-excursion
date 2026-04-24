import { useCallback } from 'react'
import tripData from '../data/tripData'
import { useWeather } from '../hooks/useWeather'
import type { Event } from '../data/tripData'

function getCurrentEvent(): { current: Event | null; next: Event | null; dayIdx: number } {
  const now = new Date()
  const nowDate = now.toISOString().slice(0, 10)
  const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const start = tripData.meta.startDate
  const end = tripData.meta.endDate

  if (nowDate < start || nowDate > end) {
    const events = tripData.days[0].events
    return { current: events[0], next: events[1] ?? null, dayIdx: 0 }
  }

  const dayIdx = tripData.days.findIndex(d => d.date === nowDate)
  if (dayIdx < 0) return { current: tripData.days[0].events[0], next: null, dayIdx: 0 }

  const events = tripData.days[dayIdx].events
  let idx = events.findLastIndex(e => e.time <= nowTime)
  if (idx < 0) idx = 0

  return { current: events[idx] ?? null, next: events[idx + 1] ?? null, dayIdx }
}

const TYPE_ICON: Record<Event['type'], string> = {
  transport: 'directions_transit',
  sightseeing: 'photo_camera',
  meal: 'restaurant',
  activity: 'hiking',
  accommodation: 'hotel',
}

interface HomeProps {
  onGoTimeline: (dayIdx: number) => void
}

export default function Home({ onGoTimeline }: HomeProps) {
  const { today, tomorrow, source, loading, fallbackText } = useWeather()
  const { current, next, dayIdx } = getCurrentEvent()
  const acc = tripData.accommodation

  const handleScheduleTap = useCallback(() => {
    onGoTimeline(dayIdx)
  }, [onGoTimeline, dayIdx])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* ① 히어로 이미지 */}
      <div
        style={{
          flex: '1 1 0',
          minHeight: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {acc.heroImage ? (
          <img
            src={acc.heroImage}
            alt="스이덴 테라스"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(160deg, var(--color-primary-fixed) 0%, var(--color-primary) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span
              className="material-symbols-outlined fill"
              style={{ fontSize: '48px', color: 'var(--color-on-primary)', opacity: 0.7 }}
            >
              holiday_village
            </span>
            <p
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '16px',
                color: 'var(--color-on-primary)',
                opacity: 0.85,
                margin: 0,
              }}
            >
              쇼나이 호텔 스이덴 테라스
            </p>
            <p style={{ fontSize: '11px', color: 'var(--color-on-primary)', opacity: 0.6, margin: 0 }}>
              8/6(목) 체크인 · 3박
            </p>
          </div>
        )}

        {/* 앱 제목 오버레이 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '16px',
            background: 'linear-gradient(to bottom, rgba(27,29,14,0.45) 0%, transparent 100%)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '18px',
              fontWeight: 600,
              color: '#ffffff',
              margin: 0,
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}
          >
            Tsuruoka Excursion
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', margin: '2px 0 0', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            쓰루오카·사카타 · 2026.08.06~08.09
          </p>
        </div>
      </div>

      {/* ② 날씨 */}
      <div
        style={{
          flexShrink: 0,
          background: 'var(--color-surface-container)',
          borderTop: '1px solid var(--color-outline-variant)',
          padding: '12px 16px',
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '52px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-neutral)', animation: 'spin 1s linear infinite' }}>
              refresh
            </span>
            <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', margin: 0 }}>날씨 로딩 중…</p>
          </div>
        ) : source === 'fallback' || (!today && !tomorrow) ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-tertiary)', flexShrink: 0, marginTop: '1px' }}>wb_sunny</span>
            <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: 0, lineHeight: 1.6 }}>
              {fallbackText}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            {[today, tomorrow].filter(Boolean).map(day => (
              <div
                key={day!.label}
                style={{
                  flex: 1,
                  background: 'var(--color-surface-container-lowest)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span
                  className="material-symbols-outlined fill"
                  style={{ fontSize: '28px', color: 'var(--color-tertiary)', flexShrink: 0 }}
                >
                  {day!.icon}
                </span>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', margin: 0, fontWeight: 500 }}>
                    {day!.label}
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-on-surface)', margin: '1px 0 0', lineHeight: 1 }}>
                    {day!.tempMax}° <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--color-neutral)' }}>{day!.tempMin}°</span>
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', margin: '2px 0 0' }}>
                    {day!.condition}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ③ 다음 일정 */}
      <div
        style={{
          flexShrink: 0,
          padding: '12px 16px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
          background: 'var(--color-surface-container-lowest)',
          borderTop: '1px solid var(--color-outline-variant)',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
        onClick={handleScheduleTap}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            현재 일정 · DAY {dayIdx + 1}
          </p>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-outline)' }}>chevron_right</span>
        </div>

        {current ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <EventRow event={current} highlight />
            {next && <EventRow event={next} />}
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', margin: 0 }}>일정 없음</p>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}

function EventRow({ event, highlight }: { event: Event; highlight?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        opacity: highlight ? 1 : 0.65,
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-lg)',
          background: highlight ? 'var(--color-primary-fixed)' : 'var(--color-surface-container)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>
          {TYPE_ICON[event.type]}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: highlight ? '14px' : '13px',
            fontWeight: highlight ? 600 : 400,
            color: 'var(--color-on-surface)',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {event.title}
        </p>
        <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', margin: '1px 0 0' }}>
          {event.time}{event.cost ? ` · ${event.cost}` : ''}
        </p>
      </div>
    </div>
  )
}
