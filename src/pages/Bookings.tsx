import { useCallback } from 'react'
import tripData from '../data/tripData'
import Toast, { useToast } from '../components/Toast'

function copy(text: string, showToast: (msg: string) => void) {
  navigator.clipboard.writeText(text).then(() => showToast('복사됨 ✓'))
}

export default function Bookings() {
  const { toastMessage, toastVisible, showToast, hideToast } = useToast()
  const acc = tripData.accommodation

  const handleCopy = useCallback(
    (text: string) => copy(text, showToast),
    [showToast],
  )

  return (
    <div style={{ padding: '0 16px 100px', overflowY: 'auto', flex: 1 }}>
      <div style={{ padding: '20px 0 16px' }}>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', fontWeight: 600, color: 'var(--color-on-surface)', margin: 0 }}>
          예약
        </h1>
      </div>

      {/* ─── 항공편 ─── */}
      <SectionLabel icon="flight" label="항공편" />
      {tripData.flights.map(f => (
        <div
          key={f.id}
          style={{
            background: 'var(--color-surface-container-lowest)',
            borderRadius: 'var(--radius-xl)',
            padding: '14px 16px',
            marginBottom: '10px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* 헤더 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="material-symbols-outlined fill" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>flight</span>
            <p style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', fontWeight: 600, color: 'var(--color-on-surface)', margin: 0 }}>
              {f.flightNumber}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: 0, marginLeft: 'auto' }}>
              {f.id === 'outbound' ? '가는 편' : '오는 편'}
            </p>
          </div>

          {/* 구간 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-on-surface)', margin: 0, lineHeight: 1 }}>{f.departure.code}</p>
              <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '2px 0 0' }}>
                {f.departure.datetime.slice(11, 16)}
              </p>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-outline)' }}>arrow_forward</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-on-surface)', margin: 0, lineHeight: 1 }}>{f.arrival.code}</p>
              <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '2px 0 0' }}>
                {f.arrival.datetime.slice(11, 16)}
              </p>
            </div>
          </div>

          {/* 메타 정보 */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <Chip label="터미널" value={f.terminal === 'TODO' ? '확인 필요' : f.terminal} dim={f.terminal === 'TODO'} />
            <Chip label="SUNGBUHM" value={f.seats[0]} />
            <Chip label="JIYONG" value={f.seats[1]} />
          </div>

          {/* 예약번호 */}
          <CopyRow
            label="예약번호"
            value={f.bookingRef === 'TODO' ? '확인 필요' : f.bookingRef}
            onCopy={() => { if (f.bookingRef !== 'TODO') handleCopy(f.bookingRef) }}
            disabled={f.bookingRef === 'TODO'}
          />
        </div>
      ))}

      {/* ─── 숙박 ─── */}
      <SectionLabel icon="hotel" label="숙박" />
      <div
        style={{
          background: 'var(--color-surface-container-lowest)',
          borderRadius: 'var(--radius-xl)',
          padding: '14px 16px',
          marginBottom: '10px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>hotel</span>
          <div>
            <p style={{ fontFamily: 'var(--font-headline)', fontSize: '15px', fontWeight: 600, color: 'var(--color-on-surface)', margin: 0 }}>
              {acc.name}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', margin: '2px 0 0' }}>{acc.nameJa}</p>
          </div>
        </div>

        {/* 전화번호 */}
        <a
          href={`tel:${acc.phone}`}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--color-primary-fixed)',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 12px',
            textDecoration: 'none',
            cursor: 'pointer',
            marginBottom: '8px',
          }}
        >
          <div>
            <p style={{ fontSize: '10px', color: 'var(--color-primary-container)', margin: 0 }}>전화번호</p>
            <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-container)', margin: '2px 0 0' }}>
              {acc.phone}
            </p>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--color-primary-container)' }}>call</span>
        </a>

        {/* 주소 */}
        <div style={{ background: 'var(--color-surface-container)', borderRadius: 'var(--radius-lg)', padding: '10px 12px' }}>
          <p style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', margin: '0 0 4px' }}>주소</p>
          <p style={{ fontSize: '12px', color: 'var(--color-on-surface)', margin: 0, lineHeight: 1.5 }}>
            {acc.address}
          </p>
        </div>
      </div>

      {/* ─── 알 켓차노 ─── */}
      <SectionLabel icon="restaurant" label="식당 예약" />
      <div
        style={{
          background: 'var(--color-surface-container-lowest)',
          borderRadius: 'var(--radius-xl)',
          padding: '14px 16px',
          marginBottom: '10px',
          boxShadow: 'var(--shadow-card)',
          border: '2px dashed var(--color-outline-variant)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-neutral)' }}>restaurant</span>
          <p style={{ fontFamily: 'var(--font-headline)', fontSize: '15px', fontWeight: 600, color: 'var(--color-neutral)', margin: 0 }}>
            알 켓차노
          </p>
          <span
            style={{
              marginLeft: 'auto',
              background: 'var(--color-surface-container)',
              color: 'var(--color-neutral)',
              fontSize: '10px',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-outline-variant)',
            }}
          >
            예약 미확정
          </span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: 0, lineHeight: 1.6 }}>
          6월 예약 오픈 예정. 예약 확정 후 이 카드를 업데이트합니다.
        </p>
        <p style={{ fontSize: '11px', color: 'var(--color-neutral)', margin: '6px 0 0' }}>
          DAY 3 (8/8 토) · 쓰루오카 · 쇼나이 식재료 이탈리안
        </p>
      </div>

      <Toast message={toastMessage} visible={toastVisible} onHide={hideToast} />
    </div>
  )
}

function SectionLabel({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 8px' }}>
      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>{icon}</span>
      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </p>
    </div>
  )
}

function Chip({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <div style={{ background: 'var(--color-surface-container)', borderRadius: 'var(--radius-lg)', padding: '5px 10px' }}>
      <p style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', margin: 0 }}>{label}</p>
      <p style={{ fontSize: '12px', fontWeight: 600, color: dim ? 'var(--color-neutral)' : 'var(--color-on-surface)', margin: '1px 0 0' }}>{value}</p>
    </div>
  )
}

function CopyRow({ label, value, onCopy, disabled }: { label: string; value: string; onCopy: () => void; disabled?: boolean }) {
  return (
    <div
      onClick={disabled ? undefined : onCopy}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--color-surface-container)',
        borderRadius: 'var(--radius-lg)',
        padding: '10px 12px',
        cursor: disabled ? 'default' : 'pointer',
        WebkitTapHighlightColor: 'transparent',
        gap: '8px',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', margin: 0 }}>{label}</p>
        <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-on-surface)', margin: '2px 0 0', letterSpacing: '0.3px', wordBreak: 'break-all' }}>
          {value}
        </p>
      </div>
      {!disabled && (
        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)', flexShrink: 0 }}>
          content_copy
        </span>
      )}
    </div>
  )
}
