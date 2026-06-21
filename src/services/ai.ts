const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'

function getApiKey(): string {
  return import.meta.env.VITE_GROQ_API_KEY || ''
}

const SYSTEM_PROMPT = `You are a friendly travel assistant for StayEase hotel booking platform. 

Rules:
- Keep responses short and conversational, like texting a friend
- 1-3 sentences max unless asked for specific details
- No fluff, no long paragraphs, no markdown formatting
- Be accurate and helpful about travel, hotels, destinations
- If you don't know something, say so simply
- For itineraries: give a concise day-by-day plan (1 line per day)
- For hotel recs: suggest 2-3 options with price range
- For attractions: list 3-5 spots with 1-line description each`

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

async function groqChat(messages: Array<{ role: string; content: string }>, maxTokens = 500): Promise<string | null> {
  const key = getApiKey()
  if (!key) return null

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 4000)

  try {
    const res = await fetch(GROQ_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      console.error('Groq HTTP error:', res.status)
      return null
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content || null
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

// --- Mock fallbacks for when API key is missing or invalid ---

function mockChat(userMsg: string): string {
  const msg = userMsg.toLowerCase()
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return 'Hey there! How can I help with your travel plans?'
  }
  if (msg.includes('hotel') || msg.includes('place to stay')) {
    return 'We have tons of hotels! What city are you thinking about? I can recommend options based on your budget.'
  }
  if (msg.includes('cheap') || msg.includes('budget') || msg.includes('affordable')) {
    return 'Looking for budget-friendly stays? Cities like Bali, Bangkok, and Goa have great options under $100/night. Want me to check a specific destination?'
  }
  if (msg.includes('luxury') || msg.includes('5 star') || msg.includes('premium')) {
    return 'Love it! Dubai, Paris, and Tokyo have incredible luxury hotels. The Royal Towers in Dubai or the Ritz in Paris are top picks. What\'s your destination?'
  }
  if (msg.includes('flight') || msg.includes('fly') || msg.includes('airfare')) {
    return 'I can help with hotels on the ground! For flights, I\'d suggest checking Google Flights or Skyscanner for the best deals. Want hotel recommendations once you land?'
  }
  if (msg.includes('restaurant') || msg.includes('eat') || msg.includes('food')) {
    return 'Every city has amazing food! Paris has great bistros, Tokyo has incredible ramen joints, and NYC has everything. What city are you visiting?'
  }
  if (msg.includes('weather') || msg.includes('climate') || msg.includes('season')) {
    return 'The best time to travel depends on where you\'re headed! Summer (June-Aug) is peak in Europe, while winter is great for Dubai and Southeast Asia. What\'s your destination?'
  }
  if (msg.includes('visa') || msg.includes('passport') || msg.includes('documents')) {
    return 'Visa requirements vary by country. Most places need at least 6 months of passport validity. Check your destination\'s embassy site for the latest rules!'
  }
  if (msg.includes('thank')) {
    return 'You\'re welcome! Happy travels — let me know if you need anything else!'
  }
  if (msg.includes('by') || msg.includes('goodbye') || msg.includes('see you')) {
    return 'Safe travels! Come back anytime you need trip help :)'
  }
  return `Great question about "${userMsg}"! I'd recommend checking out our hotel listings for the best options. What city are you interested in?`
}

function mockItinerary(destination: string, days: number, budget: string): string {
  const lines: string[] = [
    `Here's a ${days}-day plan for ${destination} (${budget}):`,
  ]
  const activities = [
    `Day 1: Arrive, check into your hotel, explore the city center`,
    `Day 2: Visit the main attractions and local markets`,
    `Day 3: Day trip to nearby sights, enjoy local cuisine`,
    `Day 4: Relax or try an adventure activity`,
    `Day 5: Shopping and souvenir hunting`,
    `Day 6: Explore offbeat neighborhoods`,
    `Day 7: Final day — revisit favorites or relax before departure`,
  ]
  for (let i = 0; i < days; i++) {
    lines.push(activities[i % activities.length])
  }
  lines.push(`\nBudget tip: With a ${budget} budget, you'll have plenty of options. Book early for the best rates!`)
  return lines.join('\n')
}

function mockHotelRecs(destination: string, budget: string): string {
  return `Here are some hotel options in ${destination} (${budget}):\n\n1. **City Comfort Inn** — ~$80/night, great location, free breakfast\n2. **Grand View Hotel** — ~$150/night, rooftop pool, city views\n3. **Royal Stay Suites** — ~$220/night, luxury rooms, spa access\n\nWant me to check availability for specific dates?`
}

function mockAttractions(destination: string): string {
  return `Top attractions in ${destination}:\n\n• **Main Square** — The heart of the city, perfect for photos\n• **Grand Museum** — Learn about local history and culture\n• **Sunset Point** — Best views during golden hour\n• **Local Market** — Great for souvenirs and street food\n• **Botanical Garden** — Peaceful escape from the city buzz`
}

// --- Public API ---

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  try {
    const real = await groqChat([
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ], 500)
    if (real) return real
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    return mockChat(lastUser?.content || 'travel')
  } catch {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    return mockChat(lastUser?.content || 'travel')
  }
}

export async function generateItinerary(destination: string, days: number, budget: string): Promise<string> {
  try {
    const real = await groqChat([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Create a ${days}-day itinerary for ${destination} with a ${budget} budget. Keep it brief — one line per day.` },
    ], 600)
    if (real) return real
    return mockItinerary(destination, days, budget)
  } catch {
    return mockItinerary(destination, days, budget)
  }
}

export async function getHotelRecommendations(destination: string, budget: string): Promise<string> {
  try {
    const real = await groqChat([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Suggest 2-3 hotels in ${destination} for a ${budget} budget. Include approximate price per night. Keep it brief.` },
    ], 400)
    if (real) return real
    return mockHotelRecs(destination, budget)
  } catch {
    return mockHotelRecs(destination, budget)
  }
}

export async function getNearbyAttractions(destination: string): Promise<string> {
  try {
    const real = await groqChat([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `List 4-5 top attractions in ${destination} for tourists. One line each with a brief description.` },
    ], 400)
    if (real) return real
    return mockAttractions(destination)
  } catch {
    return mockAttractions(destination)
  }
}
