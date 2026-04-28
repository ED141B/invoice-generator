import { useEffect, useState } from "react"
import { FileText } from "lucide-react"

interface Props {
  onComplete: () => void
}

const DURATION = 5000

export function NoiseTransition({ onComplete }: Props) {
  const [seed, setSeed] = useState(0)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const start = performance.now()

    // Change le seed toutes les 40ms pour créer l'effet de grain animé
    const noiseInterval = setInterval(() => {
      setSeed(Math.floor(Math.random() * 9999))
    }, 40)

    // Barre de progression fluide
    const progressInterval = setInterval(() => {
      const elapsed = performance.now() - start
      setProgress(Math.min(elapsed / DURATION, 1))
    }, 16)

    // Fade out 600ms avant la fin
    const fadeTimer = setTimeout(() => setFadeOut(true), DURATION - 600)

    // Appelle onComplete à la fin
    const endTimer = setTimeout(onComplete, DURATION)

    return () => {
      clearInterval(noiseInterval)
      clearInterval(progressInterval)
      clearTimeout(fadeTimer)
      clearTimeout(endTimer)
    }
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-600"
      style={{ opacity: fadeOut ? 0 : 1 }}
    >
      {/* Couche de bruit SVG */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="4"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, black 2px, black 4px)",
        }}
      />

      {/* Contenu centré */}
      <div className="relative flex flex-col items-center gap-6 text-white">
        <div className="flex items-center gap-3">
          <FileText className="size-8 opacity-90" />
          <span className="text-2xl font-bold tracking-tight">Invoice Generator</span>
        </div>

        {/* Barre de progression */}
        <div className="w-48 h-px bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-none"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <span className="text-xs text-white/40 tracking-widest uppercase">
          Chargement en cours…
        </span>
      </div>
    </div>
  )
}
