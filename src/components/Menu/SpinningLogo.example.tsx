/**
 * Example usage — delete this file once you've integrated SpinningLogo.
 *
 * Demonstrates:
 *   1. Default usage in a hero section
 *   2. Custom size and spin speed
 *   3. Disabled levitation
 *   4. Loading state with onLoad
 */

import { useState } from "react";
import SpinningLogo from "./SpinningLogo";

export function HeroExample() {
  return (
    <section
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0d",
      }}
    >
      <SpinningLogo size={280} />
    </section>
  );
}

export function CompactNavLogo() {
  // Tiny version for a nav bar — disable levitation so it doesn't bob next to text
  return <SpinningLogo size={48} levitate={false} spinDurationMs={800} />;
}

export function CinematicHero() {
  // Big and slow, more dramatic float
  return (
    <SpinningLogo
      size="min(80vw, 520px)"
      spinDurationMs={2000}
      bobAmplitude={0.14}
      driftAmplitude={0.1}
    />
  );
}

export function WithLoadingState() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: "relative", width: 360, height: 360 }}>
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontSize: 13,
          }}
        >
          Loading…
        </div>
      )}
      <SpinningLogo onLoad={() => setLoaded(true)} />
    </div>
  );
}
