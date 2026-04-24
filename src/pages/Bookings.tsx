import { useCallback } from 'react'
import tripData from '../data/tripData'
import Toast, { useToast } from '../components/Toast'

function copy(text: string, showToast: (msg: string) => void) {
  navigator.clipboard.writeText(text).then(() => showToast('복사됨 ✓'))
}

function CopyRow({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  return (
    <div
      onClick={onCopy}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--color-surface-container)',
        borderRadius: 'var(--radius-lg)',
        padding: '10px 12px',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        gap: '8px',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', margin: 0 }}>{label}</p>
        <p
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--color-on-surface)',
            margin: '2px 0 0',
            wordBreak: 'break-all',
          }}
        >
          {value}
        </p>
      </div>
      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)', flexShrink: 0 }}>
        content_copy
      </span>
    </div>
  )
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
      {/* Header */}
      <div style={{ padding: '20px 0 16px' }}>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', fontWeight: 600, color: 'var(--color-on-surface)', margin: 0 }}>
          예약·중요 정보
        </h1>
      </div>

      {/* ─── 항공편 ─── */}
      <SectionTitle icon="flight" label="항공편" />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>flight</span>
            <p style={{ fontFamily: 'var(--font-headline)', fontSize: '15px', fontWeight: 600, color: 'var(--color-on-surface)', margin: 0 }}>
              {f.flightNumber}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <InfoChip label="출발" value={`${f.departure.code} ${f.departure.datetime.slice(11, 16)}`} />
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-neutral)', alignSelf: 'center' }}>arrow_forward</span>
            <InfoChip label="도착" value={`${f.arrival.code} ${f.arrival.datetime.slice(11, 16)}`} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <InfoChip label="SUNGBUHM" value={f.seats[0]} />
            <InfoChip label="JIYONG" value={f.seats[1]} />
          </div>
        </div>
      ))}

      {/* ─── 숙박 ─── */}
      <SectionTitle icon="hotel" label="숙박" />
      <div
        style={{
          background: 'var(--color-surface-container-lowest)',
          borderRadius: 'var(--radius-xl)',
          padding: '14px 16px',
          marginBottom: '10px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>hotel</span>
          <div>
            <p style={{ fontFamily: 'var(--font-headline)', fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface)', margin: 0 }}>
              {acc.name}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', margin: '1px 0 0' }}>{acc.nameJa}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          <InfoChip label="체크인" value="8/6(목)" />
          <InfoChip label="체크아웃" value="8/9(일)" />
          <InfoChip label="기간" value={`${acc.nights}박`} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <CopyRow
            label={`${acc.bookingService} 일정번호`}
            value={acc.bookingRef}
            onCopy={() => handleCopy(acc.bookingRef)}
          />
          <div
            onClick={() => { window.location.href = `tel:${acc.phone}` }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--color-surface-container)',
              borderRadius: 'var(--radius-lg)',
              padding: '10px 12px',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <div>
              <p style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', margin: 0 }}>전화번호</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)', margin: '2px 0 0' }}>
                {acc.phone}
              </p>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)', flexShrink: 0 }}>call</span>
          </div>
        </div>
      </div>

      {/* ─── 알 켓차노 (미확정) ─── */}
      <SectionTitle icon="restaurant" label="식당 예약" />
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
          <p style={{ fontFamily: 'var(--font-headline)', fontSize: '14px', fontWeight: 600, color: 'var(--color-neutral)', margin: 0 }}>
            알 켓차노
          </p>
          <span
            style={{
              marginLeft: 'auto',
              background: 'var(--color-surface-container)',
              color: 'var(--color-neutral)',
              fontSize: '10px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-outline-variant)',
            }}
          >
            예약 미확정
          </span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: 0, lineHeight: 1.5 }}>
          6월 예약 오픈 예정. 예약 확정 후 이 카드를 업데이트합니다.
        </p>
        <p style={{ fontSize: '11px', color: 'var(--color-neutral)', margin: '6px 0 0' }}>
          DAY 3 (8/8 토) · 쓰루오카 · 쇼나이 식재료 이탈리안
        </p>
      </div>

      {/* ─── 일본어 안내 문구 ─── */}
      <SectionTitle icon="translate" label="일본어 안내 문구" />
      {tripData.japaneseRequests.map(jr => (
        <div
          key={jr.id}
          style={{
            background: 'var(--color-surface-container-lowest)',
            borderRadius: 'var(--radius-xl)',
            padding: '14px 16px',
            marginBottom: '10px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)', margin: '0 0 8px' }}>
            {jr.label}
          </p>
          <CopyRow label="탭하여 복사" value={jr.text} onCopy={() => handleCopy(jr.text)} />
        </div>
      ))}

      {/* ─── 참고 정보 ─── */}
      <SectionTitle icon="info" label="참고 정보" />
      <div
        style={{
          background: 'var(--color-surface-container-lowest)',
          borderRadius: 'var(--radius-xl)',
          padding: '14px 16px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <TipItem icon="wb_sunny" text={tripData.tips.weather} />
        <TipItem icon="payments" text={tripData.tips.payment} />
        {tripData.tips.misc.map((t, i) => (
          <TipItem key={i} icon="circle" text={t} />
        ))}
      </div>

      <Toast message={toastMessage} visible={toastVisible} onHide={hideToast} />
    </div>
  )
}

function SectionTitle({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '16px 0 8px' }}>
      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>{icon}</span>
      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </p>
    </div>
  )
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--color-surface-container)', borderRadius: 'var(--radius-lg)', padding: '6px 10px' }}>
      <p style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', margin: 0 }}>{label}</p>
      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)', margin: '1px 0 0' }}>{value}</p>
    </div>
  )
}

function TipItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
      <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-secondary)', flexShrink: 0, marginTop: '2px' }}>{icon}</span>
      <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: 0, lineHeight: 1.6 }}>{text}</p>
    </div>
  )
}
