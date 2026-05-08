# SpinningLogo — drop-in 3D portfolio logo

A self-contained React component that renders a 3D `.glb` logo with:

- continuous gentle levitation (bob + drift + tilt)
- single 360° spin on hover or tap
- transparent background — sits on any page
- chrome-friendly studio environment lighting
- baked-in emissive glow boosted for screens
- pause-when-offscreen / pause-when-tab-hidden (battery-friendly)
- `prefers-reduced-motion` support
- SSR-safe (Next.js, Remix, Astro islands)
- TypeScript and JavaScript versions included

## Files in this package

```
SpinningLogo.tsx     – TypeScript component (use this if your project is TS)
SpinningLogo.jsx     – Plain-JS component (use if you don't have TS)
logo.glb             – The 3D model
SpinningLogo.README.md – this file
logo-demo.html       – standalone demo (preview the look without React)
```

You only need **one** of `.tsx` / `.jsx` plus `logo.glb`. Delete the other.

## Install

```bash
npm install three
# or
pnpm add three
# or
yarn add three
```

If you're using TypeScript, also install Three's types:

```bash
npm install -D @types/three
```

## Drop in

1. Copy `SpinningLogo.tsx` (or `.jsx`) into your components folder, e.g.
   `src/components/SpinningLogo.tsx`.
2. Copy `logo.glb` into your `public/` folder (Next.js, Vite, Remix, CRA all
   serve `public/` at the URL root).
3. Use it:

```tsx
import SpinningLogo from "@/components/SpinningLogo";

export default function Hero() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <SpinningLogo size={280} />
    </div>
  );
}
```

That's it. Hover the logo and it spins.

## Props

| Prop             | Type                  | Default          | Notes                                            |
| ---------------- | --------------------- | ---------------- | ------------------------------------------------ |
| `src`            | `string`              | `"/logo.glb"`    | URL to the .glb file                             |
| `size`           | `number \| string`    | `360`            | Number = px, string = any CSS value (`"20rem"`)  |
| `spinDurationMs` | `number`              | `1200`           | Length of one full hover-spin                    |
| `emissiveBoost`  | `number`              | `1.8`            | Multiplier on the model's baked emissive glow    |
| `levitate`       | `boolean`             | `true`           | Toggle the idle bob/drift                        |
| `bobAmplitude`   | `number`              | `0.08`           | Vertical float in world units                    |
| `driftAmplitude` | `number`              | `0.06`           | Yaw wobble in radians (~3.4°)                    |
| `tiltAmplitude`  | `number`              | `0.04`           | Pitch breathing in radians (~2.3°)               |
| `className`      | `string`              | `""`             | Class on the wrapper div                         |
| `style`          | `CSSProperties`       | `{}`             | Inline style on the wrapper div                  |
| `ariaLabel`      | `string`              | `"Animated logo"`| Screen-reader label                              |
| `onLoad`         | `(gltf) => void`      | —                | Fires when the model is ready                    |
| `onError`        | `(err) => void`       | —                | Fires if the model fails to load                 |

## Common tweaks

**Make the levitation more dramatic:**

```tsx
<SpinningLogo bobAmplitude={0.16} driftAmplitude={0.12} />
```

**Disable levitation entirely (just hover-spin):**

```tsx
<SpinningLogo levitate={false} />
```

**Slower, more cinematic spin:**

```tsx
<SpinningLogo spinDurationMs={2200} />
```

**Click to spin** (instead of just hover):

```tsx
const ref = useRef<HTMLDivElement>(null);

<div
  onClick={() => {
    // Trigger a synthetic mouseenter — the component listens for it
    ref.current?.dispatchEvent(new MouseEvent("mouseenter"));
  }}
>
  <SpinningLogo />
</div>
```

(If you'd rather have a true `onClick` prop, ask Claude to wire one up.)

## Framework-specific notes

### Next.js (App Router)

The component uses browser-only APIs (Three.js, ResizeObserver). Import it as
a client component:

```tsx
// app/components/SpinningLogo.tsx
"use client";
export { default } from "@/components/SpinningLogo";
```

Or use `dynamic` with SSR off:

```tsx
import dynamic from "next/dynamic";
const SpinningLogo = dynamic(() => import("@/components/SpinningLogo"), {
  ssr: false,
});
```

### Vite / CRA / Remix

No special handling needed — just import and use.

### Astro

Wrap in a client island:

```astro
<SpinningLogo client:visible />
```

## Performance

- The component pauses rendering when the logo is offscreen
  (`IntersectionObserver`) and when the tab is hidden (`document.hidden`), so
  it consumes ~0% CPU when nobody is looking at it.
- Pixel ratio is capped at 2 to avoid Retina overdraw on 3x devices.
- The included `logo.glb` is **636 KB**, compressed from a 7.9 MB source using
  [meshopt](https://meshoptimizer.org/) compression and JPEG texture
  re-encoding. The component already loads the meshopt decoder (~25 KB
  gzipped), so there's nothing extra to install or configure.
- If you ever need an even smaller version (e.g. for a small nav-bar logo),
  you can re-compress with `npx @gltf-transform/cli` — ask Claude to redo it.
- If you swap in your own model that *isn't* meshopt-compressed, the loader
  still handles it fine — meshopt support is additive.

## Customizing the look

Edit these spots in `SpinningLogo.tsx`:

- **Studio lighting tint** — `keyLight` and `rimLight` colors near the top.
- **Reflection environment** — replace `RoomEnvironment` with your own HDR
  via `RGBELoader` for a custom mood.
- **Camera distance** — `camera.position.set(0, 0, 4.5)`. Smaller = closer.
- **Fit scale** — the `2.4 / maxDim` line. Higher = larger model in frame.

## Troubleshooting

**Black/blank canvas in the browser, model never appears.**
Check the console. If you see CORS or 404 errors, your `.glb` isn't being
served. Confirm it's in `public/logo.glb` and the dev server is restarted.

**Looks dull/grey, no shine.**
The emissive glow needs the model's emissive texture. If your `.glb` has no
emissive map, set `emissiveBoost={0}` and increase `keyLight.intensity` to
2.0+ in the source.

**Spins on every render in dev.**
React 18 Strict Mode mounts twice in dev — the cleanup function handles that
correctly, but you'll see two console warnings on first paint. This does not
happen in production.

## License

The component code is yours — use it however you like. The `.glb` model is
yours under whatever terms Meshy granted you when you generated it.
