import { useState, useEffect } from 'react'
import tripData from '../data/tripData'

export interface DayWeather {
  date: string
  label: string        // "오늘" | "내일"
  tempMin: number
  tempMax: number
  weatherCode: number
  icon: string
  condition: string
}

export interface WeatherState {
  today: DayWeather | null
  tomorrow: DayWeather | null
  source: 'api' | 'cache' | 'fallback'
}

const CACHE_KEY = 'tsuruoka_weather_v2'
const CACHE_TTL = 60 * 60 * 1000 // 1시간

function conditionLabel(code: number): string {
  if (code === 0) return '맑음'
  if (code <= 3) return '구름 조금'
  if (code <= 49) return '안개'
  if (code <= 67) return '비'
  if (code <= 77) return '눈'
  if (code <= 82) return '소나기'
  return '뇌우'
}

function weatherIcon(code: number): string {
  if (code === 0) return 'sunny'
  if (code <= 3) return 'partly_cloudy_day'
  if (code <= 49) return 'foggy'
  if (code <= 67) return 'rainy'
  if (code <= 77) return 'ac_unit'
  if (code <= 82) return 'grain'
  return 'thunderstorm'
}

interface CachedWeather {
  data: WeatherState
  timestamp: number
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({ today: null, tomorrow: null, source: 'fallback' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      // Try cache
      try {
        const raw = localStorage.getItem(CACHE_KEY)
        if (raw) {
          const cached: CachedWeather = JSON.parse(raw)
          if (Date.now() - cached.timestamp < CACHE_TTL) {
            setState({ ...cached.data, source: 'cache' })
            setLoading(false)
            return
          }
        }
      } catch {}

      if (!navigator.onLine) {
        setState(makeFallback())
        setLoading(false)
        return
      }

      try {
        const url =
          'https://api.open-meteo.com/v1/forecast' +
          '?latitude=38.73&longitude=139.82' +
          '&daily=weathercode,temperature_2m_max,temperature_2m_min' +
          '&timezone=Asia%2FTokyo' +
          '&forecast_days=2'
        const res = await globalThis.fetch(url)
        if (!res.ok) throw new Error('api error')
        const json = await res.json()
        const d = json.daily

        const makeDay = (idx: number, label: string): DayWeather => ({
          date: d.time[idx],
          label,
          tempMin: Math.round(d.temperature_2m_min[idx]),
          tempMax: Math.round(d.temperature_2m_max[idx]),
          weatherCode: d.weathercode[idx],
          icon: weatherIcon(d.weathercode[idx]),
          condition: conditionLabel(d.weathercode[idx]),
        })

        const data: WeatherState = {
          today: makeDay(0, '오늘'),
          tomorrow: makeDay(1, '내일'),
          source: 'api',
        }
        setState(data)
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
      } catch {
        setState(makeFallback())
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [])

  return { ...state, loading, fallbackText: tripData.tips.weather }
}

function makeFallback(): WeatherState {
  return {
    today: null,
    tomorrow: null,
    source: 'fallback',
  }
}
