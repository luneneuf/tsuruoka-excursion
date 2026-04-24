interface Tab {
  label: string
  icon: string
}

const TABS: Tab[] = [
  { label: '홈', icon: 'home_pin' },
  { label: '일정', icon: 'event_note' },
  { label: '예약', icon: 'confirmation_number' },
  { label: '더보기', icon: 'more_horiz' },
]

interface BottomNavProps {
  active: number
  onChange: (idx: number) => void
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(251,251,226,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--color-outline-variant)',
        boxShadow: 'var(--shadow-tabbar)',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '8px 4px',
        }}
      >
        {TABS.map((tab, i) => {
          const isActive = i === active
          return (
            <button
              key={tab.label}
              onClick={() => onChange(i)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                border: 'none',
                background: 'none',
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                minWidth: '64px',
                minHeight: '48px',
                justifyContent: 'center',
                transition: 'background 0.15s',
                backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
              }}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={`material-symbols-outlined${isActive ? ' fill' : ''}`}
                style={{
                  fontSize: '22px',
                  color: isActive ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                }}
              >
                {tab.icon}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  color: isActive ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                  lineHeight: 1,
                }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
