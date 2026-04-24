import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  visible: boolean
  onHide: () => void
}

export default function Toast({ message, visible, onHide }: ToastProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (visible) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(onHide, 300)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [visible, onHide])

  if (!visible && !show) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '96px',
        left: '50%',
        transform: `translateX(-50%) translateY(${show ? 0 : '8px'})`,
        opacity: show ? 1 : 0,
        transition: 'opacity 0.2s, transform 0.2s',
        background: 'var(--color-on-surface)',
        color: 'var(--color-surface)',
        padding: '10px 20px',
        borderRadius: 'var(--radius-full)',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'var(--font-body)',
        whiteSpace: 'nowrap',
        zIndex: 9999,
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  )
}

export function useToast() {
  const [state, setState] = useState({ message: '', visible: false })

  const show = (message: string) => {
    setState({ message, visible: true })
  }

  const hide = () => {
    setState(s => ({ ...s, visible: false }))
  }

  return { toastMessage: state.message, toastVisible: state.visible, showToast: show, hideToast: hide }
}
