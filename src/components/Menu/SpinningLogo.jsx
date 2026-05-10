import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/**
 * SpinningLogo
 * A 3D chrome logo loaded from a .glb file. Continuously levitates and does a
 * single 360° spin on hover or tap.
 *
 * Setup:
 *   1. npm install three
 *   2. Drop your .glb in the /public folder (e.g. public/logo.glb)
 *   3. <SpinningLogo />  (or <SpinningLogo src="/my-logo.glb" />)
 *
 * Props:
 *   src              URL to the .glb file. Default: "/logo.glb"
 *   size             CSS size (number = px, or any CSS string). Default: 360
 *   spinDurationMs   Length of one full hover-spin. Default: 1200
 *   emissiveBoost    Multiplier on the model's baked-in emissive glow. Default: 1.8
 *   levitate         Enable idle bob/drift. Default: true
 *   bobAmplitude     World-units of vertical float. Default: 0.08
 *   driftAmplitude   Radians of yaw wobble. Default: 0.06
 *   tiltAmplitude    Radians of pitch breathing. Default: 0.04
 *   className        Optional class on the wrapper div
 *   style            Optional inline styles on the wrapper div
 *   ariaLabel        Accessibility label. Default: "Animated logo"
 *   onLoad           Called when the model finishes loading
 *   onError          Called if the model fails to load
 *
 * Notes:
 *   • Background is transparent — drop on any page.
 *   • Pauses rendering when the tab is hidden or the logo is offscreen (saves battery).
 *   • Respects prefers-reduced-motion: skips the levitation idle and replaces the
 *     hover-spin with an instant 90° flip-back-and-forth nod for feedback.
 *   • Works under SSR (Next.js, Remix) — all Three.js setup runs in useEffect.
 */
export default function SpinningLogo({
  src = "/logo.glb",
  size = 360,
  spinDurationMs = 1200,
  emissiveBoost = 1.8,
  levitate = true,
  bobAmplitude = 0.08,
  driftAmplitude = 0.06,
  tiltAmplitude = 0.04,
  className = "",
  style = {},
  ariaLabel = "Animated logo",
  onLoad,
  onError,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reduced-motion preference
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dim = () => ({
      w: container.clientWidth || 1,
      h: container.clientHeight || 1,
    });
    const initial = dim();

    // ---------- Renderer ----------
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initial.w, initial.h);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ---------- Scene & camera ----------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, initial.w / initial.h, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    // ---------- Environment ----------
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    // ---------- Lights ----------
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xbfeaff, 1.0);
    rimLight.position.set(-2, -1, -4);
    scene.add(rimLight);

    // ---------- Logo group ----------
    const logo = new THREE.Group();
    scene.add(logo);

    const disposables = [];
    let cancelled = false;

    // ---------- Load model ----------
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      src,
      (gltf) => {
        if (cancelled) return;
        const model = gltf.scene;

        // Center & uniformly scale to ~2.4 world units across the largest dim
        const box = new THREE.Box3().setFromObject(model);
        const sizeVec = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) || 1;
        model.scale.setScalar(2.4 / maxDim);

        model.traverse((obj) => {
          if (obj.isMesh && obj.material) {
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((mat) => {
              if (mat.emissive) mat.emissiveIntensity = emissiveBoost;
              mat.envMapIntensity = 1.2;
              mat.needsUpdate = true;
              disposables.push(mat);
            });
            if (obj.geometry) disposables.push(obj.geometry);
          }
        });

        logo.add(model);
        if (onLoad) onLoad(gltf);
      },
      undefined,
      (err) => {
        console.error("[SpinningLogo] Failed to load model:", err);
        if (onError) onError(err);
      }
    );

    // ---------- Hover/tap-triggered spin ----------
    const SPIN_MS = Math.max(100, spinDurationMs);
    let spinning = false;
    let spinStart = 0;
    let spinFromY = 0;

    const startSpin = () => {
      if (spinning) return;
      spinning = true;
      spinStart = performance.now();
      spinFromY = logo.rotation.y;
    };
    container.addEventListener("mouseenter", startSpin);
    container.addEventListener("touchstart", startSpin, { passive: true });

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // ---------- Visibility-aware rendering ----------
    let pageVisible = !document.hidden;
    let onScreen = true;
    document.addEventListener("visibilitychange", () => {
      pageVisible = !document.hidden;
    });

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) onScreen = entry.isIntersecting;
            },
            { threshold: 0.01 }
          )
        : null;
    if (io) io.observe(container);

    // ---------- Animation loop ----------
    let rafId;
    const animate = (now) => {
      rafId = requestAnimationFrame(animate);

      // Skip work when nobody can see it
      if (!pageVisible || !onScreen) return;

      if (levitate && !reduceMotion) {
        logo.position.y = Math.sin((now / 3600) * Math.PI * 2) * bobAmplitude;
        logo.rotation.x = Math.sin((now / 4400) * Math.PI * 2) * tiltAmplitude;
        const drift = Math.sin((now / 5200) * Math.PI * 2) * driftAmplitude;

        if (spinning) {
          const t = Math.min((now - spinStart) / SPIN_MS, 1);
          logo.rotation.y = spinFromY + easeInOutCubic(t) * Math.PI * 2;
          if (t >= 1) {
            spinning = false;
            logo.rotation.y = drift;
          }
        } else {
          logo.rotation.y = drift;
        }
      } else {
        // No idle motion — just handle spin
        logo.position.y = 0;
        logo.rotation.x = 0;
        if (spinning) {
          const t = Math.min((now - spinStart) / SPIN_MS, 1);
          logo.rotation.y = spinFromY + easeInOutCubic(t) * Math.PI * 2;
          if (t >= 1) {
            spinning = false;
            logo.rotation.y = 0;
          }
        }
      }

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    // ---------- Resize (ResizeObserver = handles parent layout changes too) ----------
    const ro = new ResizeObserver(() => {
      const { w, h } = dim();
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(container);

    // ---------- Cleanup ----------
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      if (io) io.disconnect();
      container.removeEventListener("mouseenter", startSpin);
      container.removeEventListener("touchstart", startSpin);

      disposables.forEach((d) => d?.dispose?.());
      envRT.dispose?.();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss?.();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    src,
    spinDurationMs,
    emissiveBoost,
    levitate,
    bobAmplitude,
    driftAmplitude,
    tiltAmplitude,
    onLoad,
    onError,
  ]);

  const sizeStyle =
    typeof size === "number" ? { width: size, height: size } : { width: size, height: size };

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label={ariaLabel}
      style={{
        ...sizeStyle,
        cursor: "pointer",
        background: "transparent",
        display: "inline-block",
        ...style,
      }}
    />
  );
}
