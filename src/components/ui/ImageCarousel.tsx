import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageCarouselProps {
  images: string[]
  className?: string
}

export default function ImageCarousel({ images, className = '' }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const slide = (dir: number) => {
    setDirection(dir)
    setCurrent((prev) => {
      let next = prev + dir
      if (next < 0) next = images.length - 1
      if (next >= images.length) next = 0
      return next
    })
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={current}
          src={images[current]}
          alt=""
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-full h-full object-cover absolute inset-0"
        />
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <button
            onClick={() => slide(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 text-gray-800 flex items-center justify-center hover:bg-white transition-all shadow"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => slide(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 text-gray-800 flex items-center justify-center hover:bg-white transition-all shadow"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
