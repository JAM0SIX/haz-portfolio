import { useEffect, useRef, type CSSProperties } from "react";
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export interface SpinningLogoProps {
  /** URL to the .glb file. Default: "/logo.glb" */
  src?: string;
  /** CSS size in px (number) or any CSS string. Default: 360 */
  size?: number | string;
  /** Length of one full hover-spin in ms. Default: 1200 */
  spinDurationMs?: number;
  /** Multiplier on the model's baked-in emissive glow. Default: 1.8 */
  emissiveBoost?: number;
  /** Enable idle bob/drift. Default: true */
  levitate?: boolean;
  /** World-units of vertical float. Default: 0.08 */
  bobAmplitude?: number;
  /** Radians of yaw wobble. Default: 0.06 */
  driftAmplitude?: number;
  /** Radians of pitch breathing. Default: 0.04 */
  tiltAmplitude?: number;
  className?: string;
  style?: CSSProperties;
  /** Accessibility label. Default: "Animated logo" */
  ariaLabel?: string;
  onLoad?: (gltf: GLTF) => void;
  onError?: (err: unknown) => void;
}

/**
 * SpinningLogo
 * 3D chrome logo (.glb) that levitates idly and does a single 360° spin on hover/tap.
 *
 * Setup:
 *   1. npm install three
 *   2. Drop your .glb in /public (e.g. public/logo.glb)
 *   3. <SpinningLogo />
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
}: SpinningLogoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dim = () => ({
      w: container.clientWidth || 1,
      h: container.clientHeight || 1,
    });
    const initial = dim();

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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, initial.w / initial.h, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xbfeaff, 1.0);
    rimLight.position.set(-2, -1, -4);
    scene.add(rimLight);

    const logo = new THREE.Group();
    scene.add(logo);

    const disposables: Array<{ dispose?: () => void }> = [];
    let cancelled = false;

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      src,
      (gltf) => {
        if (cancelled) return;
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const sizeVec = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) || 1;
        model.scale.setScalar(2.4 / maxDim);

        model.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.isMesh && mesh.material) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((mat) => {
              const m = mat as THREE.MeshStandardMaterial;
              if (m.emissive) m.emissiveIntensity = emissiveBoost;
              m.envMapIntensity = 1.2;
              m.needsUpdate = true;
              disposables.push(m);
            });
            if (mesh.geometry) disposables.push(mesh.geometry);
          }
        });

        logo.add(model);
        onLoad?.(gltf);
      },
      undefined,
      (err) => {
        console.error("[SpinningLogo] Failed to load model:", err);
        onError?.(err);
      }
    );

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

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    let pageVisible = !document.hidden;
    let onScreen = true;
    const onVisibility = () => {
      pageVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) onScreen = entry.isIntersecting;
            },
            { threshold: 0.01 }
          )
        : null;
    io?.observe(container);

    let rafId = 0;
    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
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

    const ro = new ResizeObserver(() => {
      const { w, h } = dim();
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(container);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      container.removeEventListener("mouseenter", startSpin);
      container.removeEventListener("touchstart", startSpin);

      disposables.forEach((d) => d?.dispose?.());
      envRT.dispose?.();
      pmrem.dispose();
      renderer.dispose();
      (renderer as THREE.WebGLRenderer & { forceContextLoss?: () => void }).forceContextLoss?.();

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

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label={ariaLabel}
      style={{
        width: size,
        height: size,
        cursor: "pointer",
        background: "transparent",
        display: "inline-block",
        ...style,
      }}
    />
  );
}
