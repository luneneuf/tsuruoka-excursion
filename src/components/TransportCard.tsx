import type { TransportLeg } from '../data/tripData'

const MODE_ICON: Record<TransportLeg['mode'], string> = {
  bus: 'directions_bus',
  train: 'train',
  taxi: 'local_taxi',
  flight: 'flight',
  walk: 'directions_walk',
}

interface TransportCardProps {
  leg: TransportLeg
}

export default function TransportCard({ leg }: TransportCardProps) {
  return (
    <div
      style={{
        background: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-xl)',
        padding: '14px 16px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        gap: '14px',
        alignItems: 'center',
      }}
    >
      {/* Icon */}
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
          {MODE_ICON[leg.mode]}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--color-on-surface)',
            margin: 0,
          }}
        >
          {leg.from} → {leg.to}
        </p>
        <p
          style={{
            fontSize: '12px',
            color: 'var(--color-on-surface-variant)',
            margin: '2px 0 0',
          }}
        >
          {leg.modeLabel}
        </p>
        {leg.note && (
          <p style={{ fontSize: '11px', color: 'var(--color-neutral)', margin: '2px 0 0' }}>
            {leg.note}
          </p>
        )}
      </div>

      {/* Right */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--color-secondary)',
            margin: 0,
          }}
        >
          {leg.cost}
        </p>
        <p
          style={{
            fontSize: '11px',
            color: 'var(--color-on-surface-variant)',
            margin: '2px 0 0',
          }}
        >
          {leg.duration}
        </p>
      </div>
    </div>
  )
}
