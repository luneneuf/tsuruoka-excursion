import { useState, useRef, useCallback, useEffect } from 'react'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Timeline from './pages/Timeline'
import Bookings from './pages/Bookings'
import Transport from './pages/Transport'
import './index.css'

const PAGES = ['home', 'timeline', 'bookings', 'transport'] as const

export default function App() {
  const [activeTab, setActiveTab] = useState(0)
  const [timelineDay, setTimelineDay] = useState<number | undefined>(undefined)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [offlineBanner, setOfflineBanner] = useState(false)

  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)

  // Online/offline detection
  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true)
      setOfflineBanner(false)
    }
    const onOffline = () => {
      setIsOnline(false)
      setOfflineBanner(true)
    }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    if (!navigator.onLine) setOfflineBanner(true)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  // Auto-hide offline banner when back online
  useEffect(() => {
    if (isOnline && offlineBanner) {
      const t = setTimeout(() => setOfflineBanner(false), 2000)
      return () => clearTimeout(t)
    }
  }, [isOnline, offlineBanner])

  // Swipe navigation between tabs
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0 && activeTab < PAGES.length - 1) {
        setActiveTab(t => t + 1)
      } else if (dx > 0 && activeTab > 0) {
        setActiveTab(t => t - 1)
      }
    }
  }, [activeTab])

  const handleGoTimeline = useCallback((dayIdx: number) => {
    setTimelineDay(dayIdx)
    setActiveTab(1)
  }, [])

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', overflow: 'hidden' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Offline banner */}
      {offlineBanner && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '480px',
            zIndex: 500,
            background: isOnline ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
            color: isOnline ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 500,
            padding: '6px 16px',
            transition: 'background 0.3s, color 0.3s',
          }}
        >
          {isOnline ? '온라인 복귀' : '오프라인 모드 · 모든 정보 이용 가능'}
        </div>
      )}

      {/* Page content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginTop: offlineBanner ? '30px' : 0 }}>
        {activeTab === 0 && <Home onGoTimeline={handleGoTimeline} />}
        {activeTab === 1 && <Timeline initialDay={timelineDay} />}
        {activeTab === 2 && <Bookings />}
        {activeTab === 3 && <Transport />}
      </div>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
