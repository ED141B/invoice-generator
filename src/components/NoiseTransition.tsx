import { NoiseTransitionBase } from "@/components/transitions/NoiseTransitionBase"
import { Shanks, TrafalgaLaw } from "@/components/transitions/characters"

interface Props {
  onComplete: () => void
}

const PHRASES = [
  "Hissez les voiles…",
  "Cap sur Grand Line…",
  "Le trésor vous attend…",
  "Nakama à bord…",
]

export function NoiseTransition({ onComplete }: Props) {
  return (
    <NoiseTransitionBase
      onComplete={onComplete}
      filterId="noise-op"
      phrases={PHRASES}
      left={{ name: "Shanks", color: "#c0201a", component: <Shanks /> }}
      right={{ name: "Law", color: "#6060a0", component: <TrafalgaLaw /> }}
    />
  )
}
