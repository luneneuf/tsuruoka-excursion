import tripData from '../data/tripData'
import TransportCard from '../components/TransportCard'

const APP_VERSION = '1.6.2'

export default function Transport() {
  return (
    <div style={{ padding: '0 16px 100px', overflowY: 'auto', flex: 1 }}>
      <div style={{ padding: '20px 0 16px' }}>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', fontWeight: 600, color: 'var(--color-on-surface)', margin: 0 }}>
          더보기
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '4px 0 0' }}>
          렌터카 없음 — 전 구간 대중교통 + 택시
        </p>
      </div>

      {/* ─── 교통 구간 ─── */}
      <SectionLabel icon="route" label="교통 구간" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {tripData.transport.map(leg => (
          <TransportCard key={leg.id} leg={leg} />
        ))}
      </div>

      {/* ─── 시간표 업데이트 안내 ─── */}
      <div
        style={{
          background: 'var(--color-surface-container)',
          borderRadius: 'var(--radius-xl)',
          padding: '14px 16px',
          marginBottom: '16px',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
          border: '1px solid var(--color-outline-variant)',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-tertiary)', flexShrink: 0, marginTop: '1px' }}>
          schedule
        </span>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', margin: '0 0 3px' }}>
            시간표 업데이트 안내
          </p>
          <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: 0, lineHeight: 1.6 }}>
            공항버스·이나호 특급 시간표는 현재 임시값입니다. 여행 전 7월 중 앱 업데이트 예정.
          </p>
        </div>
      </div>

      {/* ─── 참고 정보 ─── */}
      <SectionLabel icon="info" label="참고 정보" />
      <div
        style={{
          background: 'var(--color-surface-container-lowest)',
          borderRadius: 'var(--radius-xl)',
          padding: '14px 16px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <TipItem
          icon="wb_sunny"
          title="날씨 가이드"
          text={tripData.tips.weather}
        />
        <div style={{ height: '1px', background: 'var(--color-outline-variant)', opacity: 0.5 }} />
        <TipItem
          icon="payments"
          title="결제 팁"
          text={tripData.tips.payment}
        />
        <div style={{ height: '1px', background: 'var(--color-outline-variant)', opacity: 0.5 }} />
        {tripData.tips.misc.map((t, i) => (
          <TipItem key={i} icon="circle" title="" text={t} />
        ))}
      </div>
      {/* 버전 */}
      <p style={{ fontSize: '11px', color: 'var(--color-outline)', textAlign: 'center', margin: '24px 0 0' }}>
        v{APP_VERSION}
      </p>
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

function TipItem({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '16px', color: 'var(--color-secondary)', flexShrink: 0, marginTop: '2px' }}
      >
        {icon}
      </span>
      <div>
        {title && (
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', margin: '0 0 2px' }}>
            {title}
          </p>
        )}
        <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: 0, lineHeight: 1.6 }}>
          {text}
        </p>
      </div>
    </div>
  )
}
