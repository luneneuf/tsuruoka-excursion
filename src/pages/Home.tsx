import { useState, useRef, useCallback } from 'react'
import tripData from '../data/tripData'
import { useWeather } from '../hooks/useWeather'
import type { Event } from '../data/tripData'

const HERO_IMAGES = ['/hero1.jpg', '/hero2.jpg', '/hero3.jpg']

function getCurrentEvent(): { current: Event | null; upcoming: Event[]; dayIdx: number } {
  const now = new Date()
  const nowDate = now.toISOString().slice(0, 10)
  const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const start = tripData.meta.startDate
  const end = tripData.meta.endDate

  if (nowDate < start || nowDate > end) {
    const events = tripData.days[0].events
    return { current: events[0], upcoming: events.slice(1, 4), dayIdx: 0 }
  }

  const dayIdx = tripData.days.findIndex(d => d.date === nowDate)
  if (dayIdx < 0) return { current: tripData.days[0].events[0], upcoming: [], dayIdx: 0 }

  const events = tripData.days[dayIdx].events
  let idx = events.findLastIndex(e => e.time <= nowTime)
  if (idx < 0) idx = 0

  return { current: events[idx] ?? null, upcoming: events.slice(idx + 1, idx + 4), dayIdx }
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
  const { current, upcoming, dayIdx } = getCurrentEvent()
  const [heroIdx, setHeroIdx] = useState(0)
  const heroTouchStartX = useRef<number | null>(null)

  const handleHeroTouchStart = useCallback((e: React.TouchEvent) => {
    heroTouchStartX.current = e.touches[0].clientX
  }, [])

  const handleHeroTouchEnd = useCallback((e: React.TouchEvent) => {
    if (heroTouchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - heroTouchStartX.current
    heroTouchStartX.current = null
    if (Math.abs(delta) < 40) return
    setHeroIdx(i =>
      delta < 0
        ? (i + 1) % HERO_IMAGES.length
        : (i - 1 + HERO_IMAGES.length) % HERO_IMAGES.length
    )
  }, [])

  const handleScheduleTap = useCallback(() => {
    onGoTimeline(dayIdx)
  }, [onGoTimeline, dayIdx])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

      {/* ① 히어로 이미지 — 수동 스와이프 슬라이드쇼 */}
      <div
        style={{ flex: '0 0 47vh', position: 'relative', overflow: 'hidden', background: '#1b1d0e' }}
        onTouchStart={handleHeroTouchStart}
        onTouchEnd={handleHeroTouchEnd}
      >
        {HERO_IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: i === heroIdx ? 1 : 0,
              transition: 'opacity 0.9s ease',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* 상단 제목 오버레이 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '16px',
            background: 'linear-gradient(to bottom, rgba(27,29,14,0.5) 0%, transparent 100%)',
          }}
        >
          <p style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', fontWeight: 600, color: '#ffffff', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            Tsuruoka Excursion
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', margin: '2px 0 0', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            쓰루오카·사카타 · 2026.08.06~08.09
          </p>
        </div>

        {/* 하단 도트 인디케이터 */}
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          {HERO_IMAGES.map((_, i) => (
            <div
              key={i}
              style={{
                height: '5px',
                width: i === heroIdx ? '18px' : '5px',
                borderRadius: '3px',
                background: 'rgba(255,255,255,0.9)',
                opacity: i === heroIdx ? 1 : 0.45,
                transition: 'width 0.4s ease, opacity 0.4s ease',
              }}
            />
          ))}
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
                <span className="material-symbols-outlined fill" style={{ fontSize: '28px', color: 'var(--color-tertiary)', flexShrink: 0 }}>
                  {day!.icon}
                </span>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', margin: 0, fontWeight: 500 }}>
                    {day!.label} · {day!.date.slice(5).replace('-', '/')}
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

      {/* ③ 다음 일정 — 헤더 고정 + 이벤트 목록 스크롤 */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-surface-container-lowest)',
          borderTop: '1px solid var(--color-outline-variant)',
        }}
      >
        {/* 섹션 헤더 — 고정 */}
        <div
          style={{
            flexShrink: 0,
            padding: '12px 16px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
          onClick={handleScheduleTap}
        >
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            현재 일정 · DAY {dayIdx + 1}
          </p>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-outline)' }}>chevron_right</span>
        </div>

        {/* 이벤트 목록 — 스크롤 */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 16px',
            paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
          }}
        >
          {current ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <EventRow event={current} highlight />
              {upcoming.map((ev, i) => (
                <EventRow key={ev.time + ev.title} event={ev} opacity={i === 0 ? 0.65 : 0.4} />
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', margin: 0 }}>일정 없음</p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}

function EventRow({ event, highlight, opacity }: { event: Event; highlight?: boolean; opacity?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: highlight ? 1 : (opacity ?? 0.65) }}>
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
