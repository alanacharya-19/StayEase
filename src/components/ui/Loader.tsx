import { motion } from 'framer-motion'

interface LoaderProps {
  fullScreen?: boolean
}

export default function Loader({ fullScreen = false }: LoaderProps) {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-20'}`}>
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-10 h-10 gradient-primary rounded-xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-sm text-gray-400 font-medium">Loading...</p>
      </div>
    </div>
  )
}
