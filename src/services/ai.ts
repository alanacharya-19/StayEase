import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true,
})

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

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    })
    return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
  } catch (err) {
    console.error('Groq API error:', err)
    return 'Oops, something went wrong. Please try again.'
  }
}

export async function generateItinerary(destination: string, days: number, budget: string): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Create a ${days}-day itinerary for ${destination} with a ${budget} budget. Include hotel, attractions, and dining spots. Keep it brief — one line per day.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    })
    return completion.choices[0]?.message?.content || 'Could not generate itinerary.'
  } catch (err) {
    console.error('Groq itinerary error:', err)
    return 'Could not generate itinerary. Please try again.'
  }
}

export async function getHotelRecommendations(destination: string, budget: string): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Suggest 2-3 hotels in ${destination} for a ${budget} budget. Include approximate price per night. Keep it brief.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
    })
    return completion.choices[0]?.message?.content || 'Could not fetch recommendations.'
  } catch (err) {
    console.error('Groq hotel rec error:', err)
    return 'Could not fetch recommendations. Please try again.'
  }
}

export async function getNearbyAttractions(destination: string): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `List 4-5 top attractions in ${destination} for tourists. One line each with a brief description.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
    })
    return completion.choices[0]?.message?.content || 'Could not fetch attractions.'
  } catch (err) {
    console.error('Groq attractions error:', err)
    return 'Could not fetch attractions. Please try again.'
  }
}
