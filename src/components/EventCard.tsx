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

function openMap(mapQuery: string) {
  window.open(
    'https://maps.google.com/?q=' + encodeURIComponent(mapQuery),
    '_blank',
    'noopener',
  )
}

interface EventCardProps {
  event: Event
  onTap?: (event: Event) => void
}

export default function EventCard({ event, onTap }: EventCardProps) {
  const hasGuide = !!event.guide
  const hasMap = !!event.mapQuery
  const hasAlert = !!event.alert
  const hasTimetable = !!event.timetableKey

  // Tap behavior:
  // - guide 있음 → 가이드 바텀시트 (mapQuery는 별도 아이콘 버튼)
  // - timetableKey 있음 (guide 없음) → 시간표 바텀시트
  // - 둘 다 없고 mapQuery 있음 → 지도 열기
  // - 모두 없음 → 반응 없음
  const hasPrimaryAction = hasGuide || hasTimetable
  const isClickable = hasPrimaryAction || hasMap
  const cardBg = hasGuide ? TYPE_BG[event.type] : 'var(--color-surface-container-lowest)'

  const handleCardClick = () => {
    if (hasGuide) {
      onTap?.(event)
    } else if (hasTimetable) {
      onTap?.(event)
    } else if (hasMap) {
      openMap(event.mapQuery!)
    }
  }

  const handleMapClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    if (event.mapQuery) openMap(event.mapQuery)
  }

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      {/* 시간 */}
      <div style={{ width: '44px', flexShrink: 0, paddingTop: '4px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-on-surface-variant)', letterSpacing: '0.3px' }}>
          {event.time}
        </span>
      </div>

      {/* 카드 */}
      <div
        onClick={handleCardClick}
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
        onKeyDown={e => { if (isClickable && (e.key === 'Enter' || e.key === ' ')) handleCardClick() }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          {/* 타입 아이콘 */}
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
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>
              {TYPE_ICON[event.type]}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* 제목 + 액션 아이콘 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-on-surface)',
                  margin: 0,
                  lineHeight: 1.3,
                }}>
                  {event.title}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', margin: '1px 0 0' }}>
                  {event.titleJa}
                </p>
              </div>

              {/* 아이콘 버튼 영역 */}
              <div style={{ display: 'flex', gap: '4px', marginLeft: '6px', flexShrink: 0 }}>
                {/* guide 있으면 info 아이콘 */}
                {hasGuide && (
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>
                    info
                  </span>
                )}
                {/* guide 없고 timetableKey 있으면 schedule 아이콘 */}
                {!hasGuide && hasTimetable && (
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>
                    schedule
                  </span>
                )}
                {/* primaryAction + mapQuery 둘 다 있으면 지도 아이콘 별도 버튼 */}
                {hasPrimaryAction && hasMap && (
                  <span
                    className="material-symbols-outlined"
                    onClick={handleMapClick}
                    style={{
                      fontSize: '16px',
                      color: 'var(--color-tertiary)',
                      cursor: 'pointer',
                      padding: '2px',
                      borderRadius: '4px',
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="지도 열기"
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleMapClick(e as unknown as React.MouseEvent) }}
                  >
                    map
                  </span>
                )}
                {/* primaryAction 없고 mapQuery만 있으면 지도 아이콘 (카드 탭과 동일 동작) */}
                {!hasPrimaryAction && hasMap && (
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-tertiary)' }}>
                    map
                  </span>
                )}
              </div>
            </div>

            {/* 설명 */}
            <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '6px 0 0', lineHeight: 1.5 }}>
              {event.description}
            </p>

            {/* 비용 / 소요 시간 */}
            {(event.cost || event.duration) && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
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

        {/* 경고 */}
        {hasAlert && (
          <div style={{
            marginTop: '10px',
            padding: '8px 10px',
            background: 'var(--color-error-container)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            gap: '6px',
            alignItems: 'flex-start',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-error)', flexShrink: 0, marginTop: '1px' }}>
              warning
            </span>
            <p style={{ fontSize: '12px', color: 'var(--color-error)', margin: 0, lineHeight: 1.5 }}>
              {event.alert}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
