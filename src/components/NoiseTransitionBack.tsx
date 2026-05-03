import { NoiseTransitionBase } from "@/components/transitions/NoiseTransitionBase"
import { Zoro, Sanji } from "@/components/transitions/characters"

interface Props {
  onComplete: () => void
}

const PHRASES = [
  "Retour au port…",
  "À la prochaine aventure…",
  "On remet les voiles…",
  "Jusqu'au prochain voyage…",
]

export function NoiseTransitionBack({ onComplete }: Props) {
  return (
    <NoiseTransitionBase
      onComplete={onComplete}
      filterId="noise-back"
      phrases={PHRASES}
      left={{ name: "Zoro", color: "#2a7a1a", component: <Zoro /> }}
      right={{ name: "Sanji", color: "#e85010", component: <Sanji /> }}
    />
  )
}
