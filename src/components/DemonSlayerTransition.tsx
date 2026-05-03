import { NoiseTransitionBase } from "@/components/transitions/NoiseTransitionBase"
import { Tanjiro, Nezuko, Zenitsu } from "@/components/transitions/characters"
import { DSCorpsMark } from "@/components/transitions/DSElements"

const PHRASES = [
  "Respiration totale concentration…",
  "Le Corps des Pourfendeurs veille…",
  "Tranchant comme la flamme du soleil…",
  "Les démons ne passeront pas…",
  "Nezuko-chan… en avant !",
]

export function DemonSlayerTransition({ onComplete }: { onComplete: () => void }) {
  return (
    <NoiseTransitionBase
      onComplete={onComplete}
      filterId="noise-ds"
      phrases={PHRASES}
      left={{ name: "Tanjiro", color: "#c02020", component: <Tanjiro /> }}
      right={{ name: "Zenitsu", color: "#d4a010", component: <Zenitsu /> }}
      centerContent={
        <div className="flex flex-col items-center" style={{ marginBottom: "8px" }}>
          <div style={{ marginBottom: "-20px", zIndex: 10, position: "relative" }}>
            <DSCorpsMark />
          </div>
          <p className="text-center mb-1 text-xs font-bold tracking-widest uppercase" style={{ color: "#d0606099" }}>
            Nezuko
          </p>
          <Nezuko />
        </div>
      }
      title="Demon Slayer"
      subtitle="Kimetsu no Yaiba · Reçu"
      accentColor="#c03030"
      background="radial-gradient(ellipse at center, #3a0808 0%, #1a0404 60%, #000 100%)"
      waveColors={["#3a0808", "#1a0404"]}
      barColors={["#800000", "#e03030"]}
      duration={5000}
    />
  )
}
