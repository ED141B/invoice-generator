import { useEffect, useState } from "react"

interface Pillar {
  name: string
  hair: string
  haoriL: string
  haoriR: string
  glow: string
}

const HASHIRA: Pillar[] = [
  { name: "Giyu",     hair: "#1a1a3a", haoriL: "#1a2a5a", haoriR: "#8a1a1a", glow: "#4080c0" },
  { name: "Shinobu",  hair: "#1a1010", haoriL: "#c090d0", haoriR: "#9060b0", glow: "#a060d0" },
  { name: "Rengoku",  hair: "#d09010", haoriL: "#f0c020", haoriR: "#e04010", glow: "#e06020" },
  { name: "Tengen",   hair: "#d8d8d8", haoriL: "#f0f0f0", haoriR: "#c02020", glow: "#d0a020" },
  { name: "Mitsuri",  hair: "#d060a0", haoriL: "#f0c0c0", haoriR: "#d06080", glow: "#e080a0" },
  { name: "Obanai",   hair: "#1a1a1a", haoriL: "#2a5a2a", haoriR: "#1a1a1a", glow: "#408040" },
  { name: "Sanemi",   hair: "#e0e0e0", haoriL: "#e0e8e0", haoriR: "#60a060", glow: "#80c080" },
  { name: "Gyomei",   hair: "#808080", haoriL: "#909090", haoriR: "#606060", glow: "#a0a0a0" },
  { name: "Muichiro", hair: "#80c8c8", haoriL: "#d0e8e8", haoriR: "#80b0b0", glow: "#60b0b0" },
]

const PHRASES = [
  "Les Piliers veillent sur les humains…",
  "Neuf souffles, une seule mission…",
  "Par l'acier et la flamme du cœur…",
  "La nuit des démons prend fin…",
]

const DURATION = 5000

function PillarFigure({ p }: { p: Pillar }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg viewBox="0 0 40 88" width="58" height="128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="20" cy="78" rx="15" ry="5" fill={p.glow} opacity="0.3" />
        <path d="M11 34 Q2 50 4 80 L12 80 Q10 54 14 38 Z" fill={p.haoriL} />
        <path d="M29 34 Q38 50 36 80 L28 80 Q30 54 26 38 Z" fill={p.haoriR} />
        <rect x="11" y="34" width="18" height="32" rx="2" fill="#1a1a1a" />
        <rect x="12" y="64" width="7" height="18" rx="2" fill="#1a1a1a" />
        <rect x="21" y="64" width="7" height="18" rx="2" fill="#1a1a1a" />
        <ellipse cx="20" cy="20" rx="9" ry="10" fill="#d4956a" />
        <path d="M12 16 Q10 4 15 1 Q18 0 20 1 Q22 0 25 1 Q30 4 28 16" fill={p.hair} />
        <ellipse cx="17" cy="20" rx="2" ry="1.8" fill="#1a1010" />
        <ellipse cx="23" cy="20" rx="2" ry="1.8" fill="#1a1010" />
      </svg>
      <p className="font-bold tracking-wider" style={{ color: `${p.glow}cc`, fontSize: "10px" }}>
        {p.name}
      </p>
    </div>
  )
}

export function PillarTransition({ onComplete }: { onComplete: () => void }) {
  const [seed, setSeed] = useState(0)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const ni = setInterval(() => setSeed(Math.floor(Math.random() * 9999)), 40)
    const pi = setInterval(() => setProgress(Math.min((performance.now() - start) / DURATION, 1)), 16)
    const phi = setInterval(() => setPhraseIndex(i => (i + 1) % PHRASES.length), 900)
    const ft = setTimeout(() => setFadeOut(true), DURATION - 600)
    const et = setTimeout(onComplete, DURATION)
    return () => { clearInterval(ni); clearInterval(pi); clearInterval(phi); clearTimeout(ft); clearTimeout(et) }
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #1a0a2a 0%, #0d0415 60%, #000 100%)",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <filter id="noise-pillars">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-pillars)" />
      </svg>
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, black 2px, black 4px)" }}
      />
      <svg className="pointer-events-none absolute bottom-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#1a0a2a" opacity="0.5" />
        <path d="M0,55 C360,20 720,70 1080,40 C1260,25 1380,55 1440,50 L1440,80 L0,80 Z" fill="#0d0415" opacity="0.7" />
      </svg>

      <div className="relative flex flex-col items-center gap-4 select-none">
        <div className="flex items-end gap-2">
          {HASHIRA.map(p => (
            <div key={p.name} style={{ filter: `drop-shadow(0 0 8px ${p.glow}99)` }}>
              <PillarFigure p={p} />
            </div>
          ))}
        </div>

        <div className="text-center space-y-1">
          <p className="text-3xl font-black tracking-widest uppercase" style={{ color: "#b060d0", textShadow: "0 0 20px #8040a066" }}>
            Les Piliers
          </p>
          <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "#b060d088" }}>
            Hashira · Demon Slayer Corps
          </p>
        </div>

        <div className="w-72 h-0.5 rounded-full overflow-hidden" style={{ background: "#b060d033" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg, #600080, #d060e0)",
              boxShadow: "0 0 8px #d060e0",
              transition: "none",
            }}
          />
        </div>

        <p className="text-xs tracking-widest" style={{ color: "#b060d066", minHeight: "1.2em" }}>
          {PHRASES[phraseIndex]}
        </p>
      </div>
    </div>
  )
}
