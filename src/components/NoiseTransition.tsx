import { useEffect, useState } from "react"
import { CrossBones, Skull, StrawHat } from "@/components/transitions/JollyRoger"

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

function Shanks() {
  return (
    <svg viewBox="0 0 100 210" width="90" height="189" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 70 Q8 120 12 200 L30 200 Q26 140 32 90 Z" fill="#c0201a" />
      <path d="M82 70 Q92 120 88 200 L70 200 Q74 140 68 90 Z" fill="#c0201a" />
      <path d="M18 70 Q50 80 82 70 Q78 130 50 135 Q22 130 18 70 Z" fill="#b01a14" />
      <rect x="28" y="88" width="44" height="70" rx="6" fill="#2a1a0e" />
      <ellipse cx="50" cy="52" rx="22" ry="24" fill="#d4956a" />
      <path d="M28 48 Q22 20 30 8 Q38 0 50 4 Q62 0 70 8 Q78 20 72 48" fill="#c0201a" />
      <path d="M30 30 Q18 44 22 60 Q26 52 30 48 Z" fill="#c0201a" />
      <path d="M70 30 Q82 44 78 60 Q74 52 70 48 Z" fill="#c0201a" />
      <path d="M34 4 Q28 14 26 28 Q32 18 38 14 Z" fill="#a01810" />
      <path d="M66 4 Q72 14 74 28 Q68 18 62 14 Z" fill="#a01810" />
      <line x1="32" y1="44" x2="40" y2="56" stroke="#8b4020" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="35" y1="43" x2="43" y2="55" stroke="#8b4020" strokeWidth="1" strokeLinecap="round" />
      <line x1="38" y1="42" x2="46" y2="54" stroke="#8b4020" strokeWidth="0.8" strokeLinecap="round" />
      <ellipse cx="40" cy="52" rx="4" ry="4.5" fill="#1a0a00" />
      <ellipse cx="60" cy="52" rx="4" ry="4.5" fill="#1a0a00" />
      <circle cx="41" cy="51" r="1.2" fill="white" opacity="0.4" />
      <circle cx="61" cy="51" r="1.2" fill="white" opacity="0.4" />
      <path d="M44 64 Q50 68 56 64" stroke="#8b4020" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M72 92 Q86 110 84 140 L78 138 Q80 112 68 96 Z" fill="#d4956a" />
      <path d="M80 130 Q100 108 96 70" stroke="#c0c0c0" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M80 130 Q100 108 96 70" stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      <ellipse cx="82" cy="127" rx="7" ry="3" fill="#c8860a" transform="rotate(-40 82 127)" />
      <rect x="78" y="128" width="6" height="16" rx="3" fill="#5a2d0a" transform="rotate(-20 81 136)" />
      <path d="M28 92 Q14 110 16 138 L22 136 Q20 112 32 96 Z" fill="#2a1a0e" />
      <path d="M16 136 Q14 142 18 144 Q22 142 22 136 Z" fill="#2a1a0e" />
      <path d="M15 138 Q18 145 21 138" stroke="#1a0e06" strokeWidth="2" fill="none" />
      <rect x="30" y="155" width="16" height="50" rx="5" fill="#1a1a2e" />
      <rect x="54" y="155" width="16" height="50" rx="5" fill="#1a1a2e" />
      <rect x="28" y="195" width="20" height="12" rx="4" fill="#3a2010" />
      <rect x="52" y="195" width="20" height="12" rx="4" fill="#3a2010" />
    </svg>
  )
}

function TrafalgaLaw() {
  return (
    <svg viewBox="0 0 100 210" width="90" height="189" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M82 10 L20 190" stroke="#3a3a5a" strokeWidth="5" strokeLinecap="round" />
      <path d="M82 10 L20 190" stroke="#6060a0" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M84 12 L22 192" stroke="#a0a0d0" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <rect x="44" y="136" width="18" height="10" rx="2" fill="#c8860a" transform="rotate(-55 53 141)" />
      <path d="M23 183 L32 158" stroke="#2a1a0e" strokeWidth="6" strokeLinecap="round" />
      <path d="M24 175 L28 165" stroke="#5a3a1a" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M26 180 L30 170" stroke="#5a3a1a" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <rect x="26" y="90" width="46" height="72" rx="8" fill="#1a1a1a" />
      <path d="M26 90 Q50 82 74 90 Q68 104 50 106 Q32 104 26 90 Z" fill="#e8e0d0" />
      <path d="M28 90 Q50 84 72 90 Q66 102 50 104 Q34 102 28 90 Z" fill="#d0c8b8" />
      <path d="M32 92 Q38 88 44 92" stroke="#b8b0a0" strokeWidth="1" fill="none" />
      <path d="M44 92 Q50 88 56 92" stroke="#b8b0a0" strokeWidth="1" fill="none" />
      <path d="M56 92 Q62 88 68 92" stroke="#b8b0a0" strokeWidth="1" fill="none" />
      <ellipse cx="50" cy="62" rx="20" ry="22" fill="#c8906a" />
      <path d="M34 66 Q30 72 32 78 Q36 74 38 68 Z" fill="#1a1010" />
      <path d="M66 66 Q70 72 68 78 Q64 74 62 68 Z" fill="#1a1010" />
      <ellipse cx="42" cy="62" rx="5" ry="5.5" fill="#1a1010" />
      <ellipse cx="58" cy="62" rx="5" ry="5.5" fill="#1a1010" />
      <ellipse cx="42" cy="62" rx="3" ry="3.5" fill="#d4a800" />
      <ellipse cx="58" cy="62" rx="3" ry="3.5" fill="#d4a800" />
      <circle cx="43" cy="61" r="1.2" fill="white" opacity="0.5" />
      <circle cx="59" cy="61" r="1.2" fill="white" opacity="0.5" />
      <path d="M45 72 Q50 75 55 72" stroke="#7a4a30" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <ellipse cx="50" cy="44" rx="44" ry="9" fill="#d0c8b0" />
      <ellipse cx="50" cy="42" rx="44" ry="9" fill="#e8e0c8" />
      <path d="M16 42 Q20 10 50 8 Q80 10 84 42 Z" fill="#f0e8d0" />
      <path d="M16 38 Q50 30 84 38 Q50 44 16 38 Z" fill="#1a1a1a" />
      <circle cx="28" cy="24" r="4" fill="#1a1a1a" />
      <circle cx="42" cy="18" r="3.5" fill="#1a1a1a" />
      <circle cx="58" cy="18" r="3.5" fill="#1a1a1a" />
      <circle cx="72" cy="24" r="4" fill="#1a1a1a" />
      <circle cx="35" cy="30" r="3" fill="#1a1a1a" />
      <circle cx="65" cy="30" r="3" fill="#1a1a1a" />
      <circle cx="50" cy="14" r="3" fill="#1a1a1a" />
      <path d="M72 108 Q86 120 82 148 L76 146 Q80 122 68 112 Z" fill="#c8906a" />
      <text x="72" y="140" fontSize="6" fill="#1a1a2e" fontFamily="monospace" transform="rotate(20 72 140)" fontWeight="bold">D</text>
      <text x="72" y="147" fontSize="6" fill="#1a1a2e" fontFamily="monospace" transform="rotate(20 72 147)" fontWeight="bold">E</text>
      <path d="M28 108 Q18 128 22 155 L28 153 Q24 130 34 112 Z" fill="#c8906a" />
      <rect x="28" y="158" width="18" height="48" rx="5" fill="#2a3a6a" />
      <rect x="54" y="158" width="18" height="48" rx="5" fill="#2a3a6a" />
      <rect x="26" y="196" width="22" height="12" rx="4" fill="#1a1a1a" />
      <rect x="52" y="196" width="22" height="12" rx="4" fill="#1a1a1a" />
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
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <filter id="noise-op">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-op)" />
      </svg>

      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, black 2px, black 4px)" }}
      />

      <svg className="pointer-events-none absolute bottom-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#0a2a6e" opacity="0.5" />
        <path d="M0,55 C360,20 720,70 1080,40 C1260,25 1380,55 1440,50 L1440,80 L0,80 Z" fill="#0d1b4b" opacity="0.7" />
      </svg>

      <div className="relative flex flex-col items-center gap-3 select-none">
        <div className="flex items-end gap-6">
          <div style={{ filter: "drop-shadow(0 0 12px #c0201a88)", marginBottom: "8px" }}>
            <p className="text-center mb-1 text-xs font-bold tracking-widest uppercase" style={{ color: "#c0201a99" }}>Shanks</p>
            <Shanks />
          </div>

          <div className="relative flex flex-col items-center" style={{ filter: "drop-shadow(0 0 18px #e8a02088)" }}>
            <div style={{ marginBottom: "-24px", zIndex: 10, position: "relative" }}>
              <StrawHat />
            </div>
            <Skull />
            <div style={{ marginTop: "-4px" }}>
              <CrossBones />
            </div>
          </div>

          <div style={{ filter: "drop-shadow(0 0 12px #6060a088)", marginBottom: "8px" }}>
            <p className="text-center mb-1 text-xs font-bold tracking-widest uppercase" style={{ color: "#6060a099" }}>Law</p>
            <TrafalgaLaw />
          </div>
        </div>

        <div className="mt-4 text-center space-y-1">
          <p className="text-3xl font-black tracking-widest uppercase" style={{ color: "#e8a020", textShadow: "0 0 20px #e8a02066" }}>
            One Piece
          </p>
          <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "#e8a02088" }}>
            Invoice Generator
          </p>
        </div>

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

        <p className="text-xs tracking-widest" style={{ color: "#e8a02066", minHeight: "1.2em" }}>
          {PHRASES[phraseIndex]}
        </p>
      </div>
    </div>
  )
}
