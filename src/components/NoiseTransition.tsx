import { useEffect, useState } from "react"

interface Props {
  onComplete: () => void
}

const DURATION = 3000

const PHRASES = [
  "Hissez les voiles…",
  "Cap sur Grand Line…",
  "Le trésor vous attend…",
  "Nakama à bord…",
]

// Chapeau de paille SVG simplifié (Jolly Roger One Piece)
function StrawHat() {
  return (
    <svg viewBox="0 0 120 80" width="120" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bord du chapeau */}
      <ellipse cx="60" cy="62" rx="58" ry="12" fill="#c8860a" />
      <ellipse cx="60" cy="60" rx="58" ry="12" fill="#e8a020" />
      {/* Corps du chapeau */}
      <path d="M22 60 Q30 20 60 18 Q90 20 98 60 Z" fill="#f0c040" />
      {/* Ruban rouge */}
      <path d="M22 52 Q60 44 98 52 Q60 56 22 52 Z" fill="#cc2222" />
      {/* Ombre intérieure */}
      <path d="M30 58 Q60 50 90 58 Q60 62 30 58 Z" fill="#c8860a" opacity="0.4" />
    </svg>
  )
}

// Crâne simplifié
function Skull() {
  return (
    <svg viewBox="0 0 80 90" width="64" height="72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Crâne */}
      <ellipse cx="40" cy="38" rx="30" ry="28" fill="#f5f0e0" />
      {/* Mâchoire */}
      <rect x="22" y="58" width="36" height="18" rx="4" fill="#f5f0e0" />
      {/* Dents */}
      <rect x="24" y="60" width="7" height="10" rx="2" fill="#1a1a2e" />
      <rect x="35" y="60" width="7" height="10" rx="2" fill="#1a1a2e" />
      <rect x="46" y="60" width="7" height="10" rx="2" fill="#1a1a2e" />
      {/* Yeux */}
      <ellipse cx="29" cy="36" rx="9" ry="9" fill="#1a1a2e" />
      <ellipse cx="51" cy="36" rx="9" ry="9" fill="#1a1a2e" />
      {/* Reflet yeux */}
      <ellipse cx="32" cy="33" rx="3" ry="3" fill="#f5f0e0" opacity="0.3" />
      <ellipse cx="54" cy="33" rx="3" ry="3" fill="#f5f0e0" opacity="0.3" />
    </svg>
  )
}

// Os croisés
function CrossBones() {
  return (
    <svg viewBox="0 0 140 30" width="140" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Os gauche */}
      <rect x="2" y="11" width="56" height="8" rx="4" fill="#f5f0e0" transform="rotate(-15 30 15)" />
      <circle cx="6" cy="22" r="7" fill="#f5f0e0" />
      <circle cx="6" cy="8" r="7" fill="#f5f0e0" />
      <circle cx="56" cy="22" r="7" fill="#f5f0e0" />
      <circle cx="56" cy="8" r="7" fill="#f5f0e0" />
      {/* Os droit */}
      <rect x="82" y="11" width="56" height="8" rx="4" fill="#f5f0e0" transform="rotate(15 110 15)" />
      <circle cx="134" cy="22" r="7" fill="#f5f0e0" />
      <circle cx="134" cy="8" r="7" fill="#f5f0e0" />
      <circle cx="84" cy="22" r="7" fill="#f5f0e0" />
      <circle cx="84" cy="8" r="7" fill="#f5f0e0" />
    </svg>
  )
}

export function NoiseTransition({ onComplete }: Props) {
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
      setProgress(Math.min(elapsed / DURATION, 1))
    }, 16)

    const phraseInterval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % PHRASES.length)
    }, 700)

    const fadeTimer = setTimeout(() => setFadeOut(true), DURATION - 600)
    const endTimer = setTimeout(onComplete, DURATION)

    return () => {
      clearInterval(noiseInterval)
      clearInterval(progressInterval)
      clearInterval(phraseInterval)
      clearTimeout(fadeTimer)
      clearTimeout(endTimer)
    }
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #0d1b4b 0%, #070d24 60%, #000 100%)",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* Bruit de grain */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <filter id="noise-op">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-op)" />
      </svg>

      {/* Scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, black 2px, black 4px)",
        }}
      />

      {/* Vagues en bas */}
      <svg className="pointer-events-none absolute bottom-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill="#0a2a6e"
          opacity="0.5"
        />
        <path
          d="M0,55 C360,20 720,70 1080,40 C1260,25 1380,55 1440,50 L1440,80 L0,80 Z"
          fill="#0d1b4b"
          opacity="0.7"
        />
      </svg>

      {/* Contenu centré — Jolly Roger One Piece */}
      <div className="relative flex flex-col items-center gap-3 select-none">

        {/* Jolly Roger */}
        <div className="relative flex flex-col items-center" style={{ filter: "drop-shadow(0 0 18px #e8a02088)" }}>
          <div style={{ marginBottom: "-24px", zIndex: 10, position: "relative" }}>
            <StrawHat />
          </div>
          <Skull />
          <div style={{ marginTop: "-4px" }}>
            <CrossBones />
          </div>
        </div>

        {/* Titre */}
        <div className="mt-4 text-center space-y-1">
          <p
            className="text-3xl font-black tracking-widest uppercase"
            style={{ color: "#e8a020", textShadow: "0 0 20px #e8a02066" }}
          >
            One Piece
          </p>
          <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "#e8a02088" }}>
            Invoice Generator
          </p>
        </div>

        {/* Barre de progression dorée */}
        <div className="mt-4 w-56 h-0.5 rounded-full overflow-hidden" style={{ background: "#e8a02033" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg, #c8860a, #f0c040)",
              boxShadow: "0 0 8px #f0c040",
              transition: "none",
            }}
          />
        </div>

        {/* Phrase animée */}
        <p
          className="text-xs tracking-widest"
          style={{ color: "#e8a02066", minHeight: "1.2em" }}
        >
          {PHRASES[phraseIndex]}
        </p>
      </div>
    </div>
  )
}
