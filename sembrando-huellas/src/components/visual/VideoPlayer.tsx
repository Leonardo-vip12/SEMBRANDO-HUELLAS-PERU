import { useState, useRef, forwardRef } from 'react'
import { Play } from 'lucide-react'
import { cn } from '@/lib/cn'

interface VideoPlayerProps {
  src: string
  poster?: string
  controls?: boolean
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  className?: string
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ src, poster, controls = true, autoPlay = false, loop = false, muted = false, className }, ref) => {
    const [isPlaying, setIsPlaying] = useState(autoPlay)
    const videoRef = useRef<HTMLVideoElement>(null)

    const togglePlay = () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play()
          setIsPlaying(true)
        } else {
          videoRef.current.pause()
          setIsPlaying(false)
        }
      }
    }

    return (
      <div
        className={cn('group relative overflow-hidden rounded-lg bg-black', className)}
      >
        <video
          ref={(node) => {
            videoRef.current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
          }}
          src={src}
          poster={poster}
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="h-full w-full"
          playsInline
        />
        {!controls && !isPlaying && (
          <button
            onClick={togglePlay}
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              'bg-black/20 transition-colors hover:bg-black/30',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
            )}
            aria-label="Play video"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-105">
              <Play size={28} className="ml-1 text-neutral-900" />
            </div>
          </button>
        )}
      </div>
    )
  }
)

VideoPlayer.displayName = 'VideoPlayer'

export default VideoPlayer
