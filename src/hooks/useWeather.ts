import { useState, useEffect } from 'react'
import tripData from '../data/tripData'

export interface WeatherData {
  temperature: number
  weatherCode: number
  isDay: number
  source: 'api' | 'cache' | 'fallback'
}

const CACHE_KEY = 'tsuruoka_weather'
const CACHE_TTL = 6 * 60 * 60 * 1000 // 6 hours

function weatherLabel(code: number): string {
  if (code === 0) return '맑음'
  if (code <= 3) return '구름 조금'
  if (code <= 49) return '안개'
  if (code <= 67) return '비'
  if (code <= 77) return '눈'
  if (code <= 82) return '소나기'
  return '뇌우'
}

function weatherIcon(code: number, isDay: number): string {
  if (code === 0) return isDay ? 'sunny' : 'clear_night'
  if (code <= 3) return isDay ? 'partly_cloudy_day' : 'partly_cloudy_night'
  if (code <= 49) return 'foggy'
  if (code <= 67) return 'rainy'
  if (code <= 77) return 'ac_unit'
  if (code <= 82) return 'grain'
  return 'thunderstorm'
}

interface CachedWeather {
  data: WeatherData
  timestamp: number
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWeather() {
      // Try cache first
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const parsed: CachedWeather = JSON.parse(cached)
          if (Date.now() - parsed.timestamp < CACHE_TTL) {
            setWeather({ ...parsed.data, source: 'cache' })
            setLoading(false)
            return
          }
        }
      } catch {}

      // Try API
      if (!navigator.onLine) {
        setWeather({ temperature: 28, weatherCode: 2, isDay: 1, source: 'fallback' })
        setLoading(false)
        return
      }

      try {
        const url =
          'https://api.open-meteo.com/v1/forecast?latitude=38.73&longitude=139.82&current_weather=true&timezone=Asia/Tokyo'
        const res = await fetch(url)
        if (!res.ok) throw new Error('API error')
        const json = await res.json()
        const cw = json.current_weather
        const data: WeatherData = {
          temperature: Math.round(cw.temperature),
          weatherCode: cw.weathercode,
          isDay: cw.is_day,
          source: 'api',
        }
        setWeather(data)
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
      } catch {
        setWeather({ temperature: 28, weatherCode: 2, isDay: 1, source: 'fallback' })
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  return {
    weather,
    loading,
    weatherLabel: weather ? weatherLabel(weather.weatherCode) : '',
    weatherIcon: weather ? weatherIcon(weather.weatherCode, weather.isDay) : 'wb_sunny',
    fallbackText: tripData.tips.weather,
  }
}
