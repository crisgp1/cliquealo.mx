import { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'

interface VideoPlayerProps {
  url: string
  title?: string
  className?: string
  width?: string | number
  height?: string | number
  controls?: boolean
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  poster?: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  light?: boolean | string
  playsinline?: boolean
}

export function VideoPlayer({
  url,
  title,
  className = '',
  width = '100%',
  height = '100%',
  controls = true,
  autoplay = false,
  muted = true,
  loop = false,
  poster,
  onPlay,
  onPause,
  onEnded,
  light = false,
  playsinline = true
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(autoplay)
  const [volume, setVolume] = useState(muted ? 0 : 0.8)
  const [isMuted, setIsMuted] = useState(muted)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [duration, setDuration] = useState(0)
  const [played, setPlayed] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isReady, setIsReady] = useState(false)

  const playerRef = useRef<ReactPlayer>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (playing && showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [playing, showControls])

  const handlePlayPause = () => {
    const newPlaying = !playing
    setPlaying(newPlaying)
    
    if (newPlaying) {
      onPlay?.()
    } else {
      onPause?.()
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleMute = () => {
    if (isMuted) {
      setVolume(0.8)
      setIsMuted(false)
    } else {
      setVolume(0)
      setIsMuted(true)
    }
  }

  const handleSeekChange = (newPlayed: number) => {
    setPlayed(newPlayed)
  }

  const handleSeekMouseDown = () => {
    setSeeking(true)
  }

  const handleSeekMouseUp = (newPlayed: number) => {
    setSeeking(false)
    playerRef.current?.seekTo(newPlayed)
  }

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played)
    }
  }

  const handleDuration = (duration: number) => {
    setDuration(duration)
  }

  const handleEnded = () => {
    setPlaying(false)
    onEnded?.()
  }

  const handleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
      style={{ width, height }}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={isMuted}
        loop={loop}
        controls={false}
        light={light}
        playsinline={playsinline}
        onPlay={() => {
          setPlaying(true)
          onPlay?.()
        }}
        onPause={() => {
          setPlaying(false)
          onPause?.()
        }}
        onEnded={handleEnded}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onReady={() => setIsReady(true)}
        config={{
          file: {
            attributes: {
              poster: poster,
              preload: 'metadata'
            }
          }
        }}
      />

      {/* Loading overlay */}
      {!isReady && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Custom controls */}
      {controls && (
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            showControls || !playing ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Play/Pause overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={handlePlayPause}
          >
            {!playing && (
              <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                <Play className="w-8 h-8 text-gray-800 ml-1" />
              </div>
            )}
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4">
            {/* Progress bar */}
            <div className="mb-3">
              <div
                className="w-full h-1 bg-white bg-opacity-30 rounded-full cursor-pointer"
                onMouseDown={handleSeekMouseDown}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const newPlayed = (e.clientX - rect.left) / rect.width
                  handleSeekMouseUp(newPlayed)
                }}
              >
                <div
                  className="h-full bg-red-500 rounded-full relative"
                  style={{ width: `${played * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-red-400 transition-colors"
                >
                  {playing ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={handleMute}
                  className="text-white hover:text-red-400 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-white bg-opacity-30 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%, rgba(255,255,255,0.3) 100%)`
                    }}
                  />
                </div>

                {duration > 0 && (
                  <span className="text-white text-sm">
                    {formatTime(played * duration)} / {formatTime(duration)}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {title && (
                  <span className="text-white text-sm font-medium truncate max-w-48">
                    {title}
                  </span>
                )}
                
                <button
                  onClick={handleFullscreen}
                  className="text-white hover:text-red-400 transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5" />
                  ) : (
                    <Maximize className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer