import { useEffect, useState, type ReactNode } from "react"
import { CrossBones, Skull, StrawHat } from "@/components/transitions/JollyRoger"

interface Character {
  name: string
  color: string
  component: ReactNode
}

interface Props {
  onComplete: () => void
  filterId: string
  phrases: string[]
  left: Character
  right: Character
  centerContent?: ReactNode
  title?: string
  subtitle?: string
  accentColor?: string
  background?: string
  waveColors?: [string, string]
  barColors?: [string, string]
  duration?: number
}

export function NoiseTransitionBase({
  onComplete,
  filterId,
  phrases,
  left,
  right,
  centerContent,
  title = "One Piece",
  subtitle = "Invoice Generator",
  accentColor = "#e8a020",
  background = "radial-gradient(ellipse at center, #0d1b4b 0%, #070d24 60%, #000 100%)",
  waveColors = ["#0a2a6e", "#0d1b4b"],
  barColors = ["#c8860a", "#f0c040"],
  duration = 3000,
}: Props) {
  const [seed, setSeed] = useState(0)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const start = performance.now()

    const noiseInterval = setInterval(() => {
      setSeed(Math.floor(Math.random() * 9999))
    }, 40)

    const progressInterval = setInterval(() => {
      const elapsed = performance.now() - start
      setProgress(Math.min(elapsed / duration, 1))
    }, 16)

    const phraseInterval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % phrases.length)
    }, 700)

    const fadeTimer = setTimeout(() => setFadeOut(true), duration - 600)
    const endTimer = setTimeout(onComplete, duration)

    return () => {
      clearInterval(noiseInterval)
      clearInterval(progressInterval)
      clearInterval(phraseInterval)
      clearTimeout(fadeTimer)
      clearTimeout(endTimer)
    }
  }, [onComplete, phrases.length, duration])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background,
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>

      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, black 2px, black 4px)" }}
      />

      <svg className="pointer-events-none absolute bottom-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill={waveColors[0]} opacity="0.5" />
        <path d="M0,55 C360,20 720,70 1080,40 C1260,25 1380,55 1440,50 L1440,80 L0,80 Z" fill={waveColors[1]} opacity="0.7" />
      </svg>

      <div className="relative flex flex-col items-center gap-3 select-none">
        <div className="flex items-end gap-6">
          <div style={{ filter: `drop-shadow(0 0 12px ${left.color}88)`, marginBottom: "8px" }}>
            <p className="text-center mb-1 text-xs font-bold tracking-widest uppercase" style={{ color: `${left.color}99` }}>
              {left.name}
            </p>
            {left.component}
          </div>

          <div className="relative flex flex-col items-center" style={{ filter: `drop-shadow(0 0 18px ${accentColor}88)` }}>
            {centerContent ?? (
              <>
                <div style={{ marginBottom: "-24px", zIndex: 10, position: "relative" }}>
                  <StrawHat />
                </div>
                <Skull />
                <div style={{ marginTop: "-4px" }}>
                  <CrossBones />
                </div>
              </>
            )}
          </div>

          <div style={{ filter: `drop-shadow(0 0 12px ${right.color}88)`, marginBottom: "8px" }}>
            <p className="text-center mb-1 text-xs font-bold tracking-widest uppercase" style={{ color: `${right.color}99` }}>
              {right.name}
            </p>
            {right.component}
          </div>
        </div>

        <div className="mt-4 text-center space-y-1">
          <p className="text-3xl font-black tracking-widest uppercase" style={{ color: accentColor, textShadow: `0 0 20px ${accentColor}66` }}>
            {title}
          </p>
          <p className="text-xs tracking-[0.3em] uppercase" style={{ color: `${accentColor}88` }}>
            {subtitle}
          </p>
        </div>

        <div className="mt-4 w-56 h-0.5 rounded-full overflow-hidden" style={{ background: `${accentColor}33` }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${barColors[0]}, ${barColors[1]})`,
              boxShadow: `0 0 8px ${barColors[1]}`,
              transition: "none",
            }}
          />
        </div>

        <p className="text-xs tracking-widest" style={{ color: `${accentColor}66`, minHeight: "1.2em" }}>
          {phrases[phraseIndex]}
        </p>
      </div>
    </div>
  )
}
