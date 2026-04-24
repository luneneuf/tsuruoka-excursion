import tripData from '../data/tripData'
import TransportCard from '../components/TransportCard'

const TOTAL_COST_PER_PERSON = '약 ¥9,330'
const TOTAL_DURATION = '약 4시간 25분'
const TOTAL_LEGS = 7

export default function Transport() {
  const acc = tripData.accommodation

  return (
    <div style={{ padding: '0 16px 100px', overflowY: 'auto', flex: 1 }}>
      {/* Header */}
      <div style={{ padding: '20px 0 16px' }}>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', fontWeight: 600, color: 'var(--color-on-surface)', margin: 0 }}>
          교통 요약
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '4px 0 0' }}>
          렌터카 없음 — 전 구간 대중교통 + 택시
        </p>
      </div>

      {/* Summary 3 chips */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[
          { icon: 'payments', label: '1인 교통비', value: TOTAL_COST_PER_PERSON },
          { icon: 'schedule', label: '총 이동', value: TOTAL_DURATION },
          { icon: 'route', label: '구간 수', value: `${TOTAL_LEGS}개` },
        ].map(item => (
          <div
            key={item.label}
            style={{
              flex: 1,
              background: 'var(--color-surface-container-lowest)',
              borderRadius: 'var(--radius-xl)',
              padding: '10px 8px',
              boxShadow: 'var(--shadow-card)',
              textAlign: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>
              {item.icon}
            </span>
            <p style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', margin: '2px 0 1px' }}>{item.label}</p>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', margin: 0 }}>{item.value}</p>
          </div>
        ))}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>flight</span>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-headline)', fontSize: '15px', fontWeight: 600, color: 'var(--color-on-surface)', margin: 0 }}>
                {f.flightNumber}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '2px 0 0' }}>
                {f.departure.code} {f.departure.datetime.slice(11, 16)} → {f.arrival.code} {f.arrival.datetime.slice(11, 16)}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '1px 0 0' }}>
                좌석: SUNGBUHM {f.seats[0]} · JIYONG {f.seats[1]}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* ─── 숙소 연락처 ─── */}
      <SectionLabel icon="hotel" label="숙소 연락처" />
      <div
        style={{
          background: 'var(--color-surface-container-lowest)',
          borderRadius: 'var(--radius-xl)',
          padding: '14px 16px',
          marginBottom: '16px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <p style={{ fontFamily: 'var(--font-headline)', fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface)', margin: '0 0 4px' }}>
          {acc.name}
        </p>
        <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', margin: '0 0 10px' }}>{acc.nameJa}</p>
        <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', margin: '0 0 10px', lineHeight: 1.5 }}>
          {acc.address}
        </p>
        <a
          href={`tel:${acc.phone}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-primary-fixed)',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 12px',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-container)', margin: 0 }}>
            {acc.phone}
          </p>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary-container)' }}>call</span>
        </a>
      </div>

      {/* ─── 구간별 교통 ─── */}
      <SectionLabel icon="route" label="구간별 교통" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tripData.transport.map(leg => (
          <TransportCard key={leg.id} leg={leg} />
        ))}
      </div>

      {/* Note */}
      <div
        style={{
          marginTop: '12px',
          padding: '12px',
          background: 'var(--color-surface-container-low)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', margin: 0, lineHeight: 1.6 }}>
          * 쓰루오카 시내 이동: 쇼나이 교통 버스 + 필요시 택시<br />
          * 총 교통비는 1인 기준 (왕복 사카타 포함, 택시 분담 기준)
        </p>
      </div>
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
