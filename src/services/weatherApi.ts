interface WeatherData {
  city: string
  country: string
  temp: number
  feelsLike: number
  condition: string
  humidity: number
  wind: number
  icon: string
  forecast: Array<{ day: string; temp: number; condition: string; icon: string }>
}

const weatherConditions = [
  { condition: 'Sunny', icon: '☀️' },
  { condition: 'Partly Cloudy', icon: '⛅' },
  { condition: 'Cloudy', icon: '☁️' },
  { condition: 'Light Rain', icon: '🌦️' },
  { condition: 'Clear', icon: '🌙' },
]

const cityWeather: Record<string, Partial<WeatherData>> = {
  'New York': { country: 'USA', temp: 22, condition: 'Partly Cloudy', humidity: 65, wind: 12, icon: '⛅' },
  'Paris': { country: 'France', temp: 19, condition: 'Cloudy', humidity: 70, wind: 8, icon: '☁️' },
  'Dubai': { country: 'UAE', temp: 38, condition: 'Sunny', humidity: 25, wind: 10, icon: '☀️' },
  'Tokyo': { country: 'Japan', temp: 26, condition: 'Light Rain', humidity: 75, wind: 6, icon: '🌦️' },
  'London': { country: 'UK', temp: 16, condition: 'Cloudy', humidity: 80, wind: 14, icon: '☁️' },
  'Bali': { country: 'Indonesia', temp: 30, condition: 'Partly Cloudy', humidity: 78, wind: 5, icon: '⛅' },
  'Rome': { country: 'Italy', temp: 28, condition: 'Sunny', humidity: 55, wind: 7, icon: '☀️' },
  'Barcelona': { country: 'Spain', temp: 25, condition: 'Sunny', humidity: 60, wind: 9, icon: '☀️' },
  'Singapore': { country: 'Singapore', temp: 31, condition: 'Thunderstorms', humidity: 82, wind: 4, icon: '⛈️' },
  'Sydney': { country: 'Australia', temp: 18, condition: 'Partly Cloudy', humidity: 62, wind: 15, icon: '⛅' },
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getForecast(baseTemp: number, baseCondition: string) {
  const conditions = Object.values(weatherConditions)
  const startIdx = conditions.findIndex((c) => c.condition === baseCondition)
  return Array.from({ length: 5 }, (_, i) => {
    const idx = (startIdx + i) % conditions.length
    return {
      day: days[(new Date().getDay() + i) % 7],
      temp: baseTemp + Math.round((Math.random() - 0.5) * 8),
      condition: conditions[idx].condition,
      icon: conditions[idx].icon,
    }
  })
}

export async function getWeather(city: string): Promise<WeatherData> {
  const base = cityWeather[city] || { country: 'Unknown', temp: 25, condition: 'Sunny', humidity: 60, wind: 10, icon: '☀️' }
  return {
    city,
    country: base.country || 'Unknown',
    temp: base.temp || 25,
    feelsLike: (base.temp || 25) - 2,
    condition: base.condition || 'Sunny',
    humidity: base.humidity || 60,
    wind: base.wind || 10,
    icon: base.icon || '☀️',
    forecast: getForecast(base.temp || 25, base.condition || 'Sunny'),
  }
}
