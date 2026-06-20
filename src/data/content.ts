import type { Destination, Testimonial, FAQ, TeamMember } from '../types'

export const popularDestinations: Destination[] = [
  { id: 1, name: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', hotelCount: 45 },
  { id: 2, name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', hotelCount: 62 },
  { id: 3, name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', hotelCount: 38 },
  { id: 4, name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', hotelCount: 51 },
  { id: 5, name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', hotelCount: 29 },
  { id: 6, name: 'London', country: 'UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', hotelCount: 73 },
]

export const testimonials: Testimonial[] = [
  { id: 1, name: 'Sarah Johnson', location: 'New York, USA', avatar: '', text: 'StayEase made booking our Paris trip effortless. The best hotel deals and incredible customer service!', rating: 5 },
  { id: 2, name: 'James Mitchell', location: 'London, UK', avatar: '', text: 'I use StayEase for all my business trips. The filters make it so easy to find exactly what I need.', rating: 5 },
  { id: 3, name: 'Priya Patel', location: 'Mumbai, India', avatar: '', text: 'The Dubai Royal Towers experience was unforgettable. Thank you StayEase for the amazing deal!', rating: 5 },
  { id: 4, name: 'Carlos Garcia', location: 'Madrid, Spain', avatar: '', text: 'Best hotel booking platform I have ever used. The interface is beautiful and intuitive.', rating: 4 },
]

export const faqs: FAQ[] = [
  { q: 'How do I book a hotel?', a: 'Simply search for your destination, select dates, browse hotels, and complete your booking in minutes.' },
  { q: 'Can I cancel my booking?', a: 'Yes, most hotels offer free cancellation within a specified timeframe. Check the cancellation policy on each hotel page.' },
  { q: 'Is my payment information secure?', a: 'Absolutely. We use industry-standard encryption to protect all your personal and payment information.' },
  { q: 'How do I contact customer support?', a: 'You can reach us 24/7 via live chat, email at support@stayease.com, or phone at +1-800-STAYEASE.' },
  { q: 'Are there any hidden fees?', a: 'No hidden fees! The price you see includes all taxes and charges. We believe in complete transparency.' },
  { q: 'Can I earn rewards?', a: 'Yes! Join our StayEase Rewards program to earn points on every booking and redeem them for discounts.' },
]

export const teamMembers: TeamMember[] = [
  { id: 1, name: 'Emma Williams', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', bio: 'Former hospitality executive with 15 years of experience in the hotel industry.' },
  { id: 2, name: 'David Chen', role: 'CTO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', bio: 'Tech visionary who built scalable platforms serving millions of users.' },
  { id: 3, name: 'Sophie Martin', role: 'Head of Design', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', bio: 'Award-winning designer passionate about creating delightful user experiences.' },
  { id: 4, name: 'Michael Torres', role: 'VP of Operations', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', bio: 'Operations expert ensuring seamless experiences for millions of travelers.' },
]
