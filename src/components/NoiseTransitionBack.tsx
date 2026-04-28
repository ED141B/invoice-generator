import { useEffect, useState } from "react"

interface Props {
  onComplete: () => void
}

const DURATION = 3000

const PHRASES = [
  "Retour au port…",
  "À la prochaine aventure…",
  "On remet les voiles…",
  "Jusqu'au prochain voyage…",
]

// Zoro — cheveux verts, 3 épées (Santoryu), boucles d'oreilles, haramaki vert
function Zoro() {
  return (
    <svg viewBox="0 0 100 210" width="90" height="189" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Épée en bouche — Wado Ichimonji (traverse en diagonale) */}
      <path d="M15 72 L75 58" stroke="#d4d0b8" strokeWidth="3" strokeLinecap="round" />
      <path d="M15 72 L75 58" stroke="#f0ece0" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      {/* Garde épée bouche */}
      <ellipse cx="46" cy="65" rx="5" ry="3" fill="#c8860a" transform="rotate(-13 46 65)" />

      {/* Corps — chemise blanche ouverte sur le torse */}
      <rect x="28" y="90" width="44" height="68" rx="6" fill="#e8e0d0" />
      {/* Pectoraux / cicatrice de Mihawk */}
      <path d="M34 100 Q50 95 66 100" stroke="#d0c8b8" strokeWidth="1" fill="none" />
      <path d="M38 108 Q44 96 50 108" stroke="#b05030" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />

      {/* Haramaki vert autour de la taille */}
      <rect x="26" y="140" width="48" height="18" rx="4" fill="#3a6a2a" />
      <path d="M26 148 Q50 144 74 148" stroke="#2a5a1a" strokeWidth="1.5" fill="none" />

      {/* Tête */}
      <ellipse cx="50" cy="56" rx="20" ry="22" fill="#d4956a" />

      {/* Cheveux verts courts et épars */}
      <path d="M30 52 Q28 34 36 24 Q44 16 50 18 Q56 16 64 24 Q72 34 70 52" fill="#2a7a1a" />
      <path d="M32 40 Q26 30 30 20 Q34 24 34 34 Z" fill="#1a6010" />
      <path d="M68 40 Q74 30 70 20 Q66 24 66 34 Z" fill="#1a6010" />
      <path d="M38 18 Q34 10 40 8 Q44 14 40 20 Z" fill="#2a7a1a" />
      <path d="M60 18 Q64 10 60 8 Q56 14 60 20 Z" fill="#2a7a1a" />

      {/* Bandeau rouge sur le bras gauche */}
      <rect x="12" y="116" width="18" height="8" rx="3" fill="#cc2222" transform="rotate(-8 21 120)" />

      {/* Yeux — regard sérieux */}
      <ellipse cx="42" cy="56" rx="4.5" ry="4.5" fill="#1a1010" />
      <ellipse cx="58" cy="56" rx="4.5" ry="4.5" fill="#1a1010" />
      <ellipse cx="42" cy="56" rx="2" ry="2.5" fill="#2a5a1a" />
      <ellipse cx="58" cy="56" rx="2" ry="2.5" fill="#2a5a1a" />
      <circle cx="43" cy="55" r="1" fill="white" opacity="0.4" />
      <circle cx="59" cy="55" r="1" fill="white" opacity="0.4" />

      {/* Bouche — serre l'épée */}
      <path d="M44 68 Q50 70 56 68" stroke="#8b4020" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* 3 boucles d'oreilles à gauche */}
      <circle cx="30" cy="60" r="2.5" fill="#c8a030" />
      <circle cx="30" cy="66" r="2.5" fill="#c8a030" />
      <circle cx="30" cy="72" r="2.5" fill="#c8a030" />

      {/* Bras droit — épée Sandai Kitetsu tenue en main */}
      <path d="M72 94 Q86 112 84 148 L78 146 Q80 118 68 98 Z" fill="#d4956a" />
      {/* Épée droite — Sandai Kitetsu */}
      <path d="M86 100 L90 200" stroke="#8a1a1a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M86 100 L90 200" stroke="#c04040" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="87" cy="104" rx="6" ry="3" fill="#c8860a" transform="rotate(10 87 104)" />
      <rect x="85" y="104" width="5" height="14" rx="2" fill="#4a1a0a" transform="rotate(10 87 111)" />

      {/* Bras gauche — épée Shusui tenue en main */}
      <path d="M28 94 Q14 112 16 148 L22 146 Q20 118 32 98 Z" fill="#d4956a" />
      {/* Épée gauche — Shusui (lame sombre) */}
      <path d="M14 100 L10 200" stroke="#1a1a3a" strokeWidth="4" strokeLinecap="round" />
      <path d="M14 100 L10 200" stroke="#4040a0" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="13" cy="104" rx="6" ry="3" fill="#c8860a" transform="rotate(-10 13 104)" />
      <rect x="10" y="104" width="5" height="14" rx="2" fill="#1a0a0a" transform="rotate(-10 13 111)" />

      {/* Jambes — pantalon sombre */}
      <rect x="29" y="155" width="17" height="50" rx="5" fill="#2a2a1a" />
      <rect x="54" y="155" width="17" height="50" rx="5" fill="#2a2a1a" />
      {/* Bottes */}
      <rect x="27" y="196" width="21" height="12" rx="4" fill="#1a1010" />
      <rect x="52" y="196" width="21" height="12" rx="4" fill="#1a1010" />
    </svg>
  )
}

// Sanji — costume noir, sourcil bouclé, cheveux blonds, cigarette, jambe en coup de pied
function Sanji() {
  return (
    <svg viewBox="0 0 100 210" width="90" height="189" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Flammes de Diable Jambe autour de la jambe droite */}
      <path d="M64 130 Q72 120 70 108 Q78 118 76 132 Q84 122 80 110 Q88 122 84 138 Q80 155 68 162 Q56 155 60 138 Q56 148 64 130 Z" fill="#e85010" opacity="0.8" />
      <path d="M66 132 Q74 124 72 114 Q78 124 76 136 Q72 148 66 155 Q60 148 64 136 Z" fill="#f07020" opacity="0.9" />
      <path d="M68 138 Q74 130 72 122 Q76 132 74 142 Q70 150 68 154 Q66 150 68 142 Z" fill="#f8c040" opacity="0.9" />

      {/* Jambe droite levée en coup de pied */}
      <path d="M56 158 Q72 140 78 118 Q84 126 80 148 Q78 162 66 172 Z" fill="#1a1a1a" />
      {/* Chaussure droite en coup de pied */}
      <ellipse cx="80" cy="114" rx="12" ry="7" fill="#0a0a0a" transform="rotate(-40 80 114)" />
      <ellipse cx="78" cy="112" rx="10" ry="5" fill="#1a1a1a" transform="rotate(-40 78 112)" />

      {/* Corps — costume noir impeccable */}
      <rect x="28" y="88" width="44" height="72" rx="6" fill="#1a1a1a" />
      {/* Revers du costume */}
      <path d="M28 88 Q50 82 72 88 L62 108 Q50 112 38 108 Z" fill="#f5f0e8" />
      <path d="M38 88 Q50 84 62 88 L56 106 Q50 110 44 106 Z" fill="#e8e0d0" />
      {/* Nœud papillon */}
      <path d="M45 96 Q50 100 55 96 Q50 104 45 96 Z" fill="#1a1a1a" />
      <circle cx="50" cy="100" r="2" fill="#1a1a1a" />
      {/* Bouton de costume */}
      <circle cx="50" cy="115" r="1.5" fill="#2a2a2a" />
      <circle cx="50" cy="124" r="1.5" fill="#2a2a2a" />

      {/* Tête */}
      <ellipse cx="50" cy="56" rx="20" ry="22" fill="#d4956a" />

      {/* Cheveux blonds — couvrent l'œil droit */}
      <path d="M34 52 Q32 30 42 20 Q50 16 60 20 Q70 28 70 52" fill="#d4aa10" />
      <path d="M30 48 Q28 28 36 20 Q40 26 38 40 Z" fill="#b89010" />
      {/* Mèche qui cache l'œil droit */}
      <path d="M50 18 Q62 16 70 26 Q64 30 56 48 Q50 40 50 18 Z" fill="#d4aa10" />
      <path d="M52 20 Q64 18 72 28 Q66 32 60 50 Z" fill="#c09a00" opacity="0.7" />

      {/* Sourcil gauche bouclé — signature de Sanji */}
      <path d="M32 46 Q36 40 42 44 Q38 44 36 48 Q33 48 32 46 Z" fill="#c09a10" />
      {/* Spirale du sourcil */}
      <path d="M34 45 Q38 40 42 44" stroke="#8a6a00" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M36 44 Q34 42 36 40" stroke="#8a6a00" strokeWidth="1" strokeLinecap="round" fill="none" />

      {/* Œil gauche visible */}
      <ellipse cx="40" cy="56" rx="4.5" ry="4.5" fill="#1a1010" />
      <ellipse cx="40" cy="56" rx="2" ry="2.5" fill="#1a3a5a" />
      <circle cx="41" cy="55" r="1" fill="white" opacity="0.4" />
      {/* Œil droit caché sous la mèche */}
      <path d="M54 52 Q60 48 66 52" stroke="#c09a10" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* Cigarette en bouche */}
      <rect x="54" y="67" width="18" height="3" rx="1.5" fill="#f5f0e0" />
      <rect x="69" y="66" width="5" height="5" rx="1" fill="#e05010" opacity="0.8" />
      {/* Fumée */}
      <path d="M74 64 Q76 58 74 52 Q78 56 76 50" stroke="#a0a0a0" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* Bouche */}
      <path d="M46 68 Q50 71 54 68" stroke="#8b4020" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Bras droit — le long du corps (il ne se bat pas avec les mains) */}
      <path d="M72 92 Q82 108 80 138 L74 136 Q76 110 66 96 Z" fill="#d4956a" />
      {/* Main droite dans la poche */}
      <path d="M76 132 Q82 138 80 146 Q74 144 74 136 Z" fill="#1a1a1a" />

      {/* Bras gauche — main dans le dos ou poche */}
      <path d="M28 92 Q18 108 20 138 L26 136 Q24 110 34 96 Z" fill="#d4956a" />
      <path d="M24 132 Q18 138 20 146 Q26 144 26 136 Z" fill="#1a1a1a" />

      {/* Jambe gauche — pantalon noir */}
      <rect x="28" y="158" width="18" height="48" rx="5" fill="#1a1a1a" />
      {/* Chaussure gauche */}
      <ellipse cx="37" cy="208" rx="12" ry="6" fill="#0a0a0a" />
    </svg>
  )
}

// Chapeau de paille SVG (Jolly Roger)
function StrawHat() {
  return (
    <svg viewBox="0 0 120 80" width="120" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="62" rx="58" ry="12" fill="#c8860a" />
      <ellipse cx="60" cy="60" rx="58" ry="12" fill="#e8a020" />
      <path d="M22 60 Q30 20 60 18 Q90 20 98 60 Z" fill="#f0c040" />
      <path d="M22 52 Q60 44 98 52 Q60 56 22 52 Z" fill="#cc2222" />
      <path d="M30 58 Q60 50 90 58 Q60 62 30 58 Z" fill="#c8860a" opacity="0.4" />
    </svg>
  )
}

function Skull() {
  return (
    <svg viewBox="0 0 80 90" width="64" height="72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="38" rx="30" ry="28" fill="#f5f0e0" />
      <rect x="22" y="58" width="36" height="18" rx="4" fill="#f5f0e0" />
      <rect x="24" y="60" width="7" height="10" rx="2" fill="#1a1a2e" />
      <rect x="35" y="60" width="7" height="10" rx="2" fill="#1a1a2e" />
      <rect x="46" y="60" width="7" height="10" rx="2" fill="#1a1a2e" />
      <ellipse cx="29" cy="36" rx="9" ry="9" fill="#1a1a2e" />
      <ellipse cx="51" cy="36" rx="9" ry="9" fill="#1a1a2e" />
      <ellipse cx="32" cy="33" rx="3" ry="3" fill="#f5f0e0" opacity="0.3" />
      <ellipse cx="54" cy="33" rx="3" ry="3" fill="#f5f0e0" opacity="0.3" />
    </svg>
  )
}

function CrossBones() {
  return (
    <svg viewBox="0 0 140 30" width="140" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="11" width="56" height="8" rx="4" fill="#f5f0e0" transform="rotate(-15 30 15)" />
      <circle cx="6" cy="22" r="7" fill="#f5f0e0" />
      <circle cx="6" cy="8" r="7" fill="#f5f0e0" />
      <circle cx="56" cy="22" r="7" fill="#f5f0e0" />
      <circle cx="56" cy="8" r="7" fill="#f5f0e0" />
      <rect x="82" y="11" width="56" height="8" rx="4" fill="#f5f0e0" transform="rotate(15 110 15)" />
      <circle cx="134" cy="22" r="7" fill="#f5f0e0" />
      <circle cx="134" cy="8" r="7" fill="#f5f0e0" />
      <circle cx="84" cy="22" r="7" fill="#f5f0e0" />
      <circle cx="84" cy="8" r="7" fill="#f5f0e0" />
    </svg>
  )
}

export function NoiseTransitionBack({ onComplete }: Props) {
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
        <filter id="noise-back">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-back)" />
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
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#0a2a6e" opacity="0.5" />
        <path d="M0,55 C360,20 720,70 1080,40 C1260,25 1380,55 1440,50 L1440,80 L0,80 Z" fill="#0d1b4b" opacity="0.7" />
      </svg>

      {/* Trio : Zoro — Jolly Roger — Sanji */}
      <div className="relative flex flex-col items-center gap-3 select-none">

        <div className="flex items-end gap-6">

          {/* Zoro — gauche */}
          <div style={{ filter: "drop-shadow(0 0 12px #2a7a1a88)", marginBottom: "8px" }}>
            <p className="text-center mb-1 text-xs font-bold tracking-widest uppercase" style={{ color: "#2a7a1a99" }}>Zoro</p>
            <Zoro />
          </div>

          {/* Jolly Roger — centre */}
          <div className="relative flex flex-col items-center" style={{ filter: "drop-shadow(0 0 18px #e8a02088)" }}>
            <div style={{ marginBottom: "-24px", zIndex: 10, position: "relative" }}>
              <StrawHat />
            </div>
            <Skull />
            <div style={{ marginTop: "-4px" }}>
              <CrossBones />
            </div>
          </div>

          {/* Sanji — droite */}
          <div style={{ filter: "drop-shadow(0 0 12px #e8501088)", marginBottom: "8px" }}>
            <p className="text-center mb-1 text-xs font-bold tracking-widest uppercase" style={{ color: "#e8501099" }}>Sanji</p>
            <Sanji />
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
        <p className="text-xs tracking-widest" style={{ color: "#e8a02066", minHeight: "1.2em" }}>
          {PHRASES[phraseIndex]}
        </p>
      </div>
    </div>
  )
}
