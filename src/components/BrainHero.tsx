"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

import { DISPLACEMENT_GLSL, SIMPLEX_NOISE_GLSL } from "@/components/hero/displacementShader";
import { useMouseParallax } from "@/components/hero/useMouseParallax";

type BrainData = {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  glow: Float32Array;
  phase: Float32Array;
};

// Sourced directly from the brand manual's "Referências Cromáticas" table
// (Web hex column) — not approximated. Strictly cold tones: teal/blue form
// the surface gradient (matching the logo icon's own teal-to-blue hemisphere
// gradient); glow hubs tint toward the manual's vivid blue, not the amber
// swatch used here previously — mixed with the teal/blue base, amber read as
// a muddy brown rather than a clean highlight.
const C_BLUE = new THREE.Color("#1270B0");
const C_TEAL = new THREE.Color("#0F9CAC");
const C_VIOLET = new THREE.Color("#00A5E9");

// ── Act boundaries (scroll progress 0..1) ──────────────────────────────
const ACT2_START = 0.22;
const ACT3_START = 0.55;
const ACT4_START = 0.85;
const MOBILE_BREAKPOINT = 768;
const RESIZE_DEBOUNCE_MS = 150;

// Hemisphere-opening reveal: independent of the 4-act timeline, spans the
// first half of the scroll (0 → 0.5) so it settles alongside the Hero's
// text-block reveal. Max separation is a world-space offset added to each
// particle's existing hemisphere gap (~0.045–0.065 at rest).
const HEMISPHERE_OPEN_END = 0.5;
const HEMISPHERE_SPLIT_MAX = 0.17;

// Fixed lateral/profile viewing angle (90°, i.e. Math.PI/2, from the old
// frontal start) — the camera holds this angle for the whole scroll journey;
// only its distance (radius) changes. See CAMERA_MIN_RADIUS below for why
// the dolly never crosses zero.
const ORBIT_RADIUS = 4.3;
const ORBIT_PHASE = Math.PI / 2;
// Closest the camera ever dollies in to — kept positive and well clear of
// zero so it never crosses through the point cloud's origin (crossing zero
// flips the camera to the opposite side, which read as a sudden pirouette).
const CAMERA_MIN_RADIUS = 1.1;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function fold(x: number, y: number, z: number): number {
  return (
    0.055 * Math.sin(6.0 * y + 8.0 * z) +
    0.045 * Math.sin(9.0 * x + 5.0 * z) +
    0.03 * Math.sin(14.0 * z + 6.5 * y) +
    0.02 * Math.sin(22.0 * x + 11.0 * y)
  );
}

function buildBrain(count: number): BrainData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const glow = new Float32Array(count);
  const phase = new Float32Array(count);

  const tmp = new THREE.Color();

  const nCerebrum = Math.floor(count * 0.72);
  const nCerebellum = Math.floor(count * 0.17);

  const rx = 1.15;
  const ry = 0.92;
  const rz = 1.42;

  for (let i = 0; i < count; i++) {
    let x = 0;
    let y = 0;
    let z = 0;
    let t = 0;

    if (i < nCerebrum) {
      // Surface-only: every cerebrum particle sits on the folded cortex
      // hull, none fill the interior volume — a hollow shell, not a solid
      // mass, so the core reads as empty/transparent rather than a dense
      // inner "aurora".
      const side = Math.random() < 0.5 ? -1 : 1;
      const u = Math.random();
      const v = Math.random();
      const theta = Math.acos(2 * u - 1);
      const ph = 2 * Math.PI * v;
      const nx = Math.abs(Math.sin(theta) * Math.cos(ph));
      const ny = Math.sin(theta) * Math.sin(ph);
      const nz = Math.cos(theta);

      let px = nx * rx;
      let py = ny * ry;
      let pz = nz * rz;

      py -= 0.12 * pz * pz * 0.4;

      let ex = px / (rx * rx);
      let ey = py / (ry * ry);
      let ez = pz / (rz * rz);
      const el = Math.hypot(ex, ey, ez) || 1;
      ex /= el;
      ey /= el;
      ez /= el;

      const f = fold(px, py, pz);
      const layer = 1 - Math.random() * Math.random() * 0.16;

      px = (px + ex * f) * layer;
      py = (py + ey * f) * layer;
      pz = (pz + ez * f) * layer;

      const gap = 0.045 + (1 - nx) * 0.02;
      x = side * (px + gap);
      y = py + 0.15;
      z = pz;
      t = 0.35 + 0.65 * Math.random();
    } else if (i < nCerebrum + nCerebellum) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const u = Math.random();
      const v = Math.random();
      const theta = Math.acos(2 * u - 1);
      const ph = 2 * Math.PI * v;
      const nx = Math.abs(Math.sin(theta) * Math.cos(ph));
      const ny = Math.sin(theta) * Math.sin(ph);
      const nz = Math.cos(theta);

      const cr = 0.62;
      let px = nx * cr;
      let py = ny * 0.42;
      const pz = nz * 0.5;

      const foliation = 0.035 * Math.sin(py * 42.0) + 0.02 * Math.sin(px * 30.0);
      const layer = 1 - Math.random() * 0.2;
      px = (px + foliation) * layer;
      py = (py + foliation * 0.5) * layer;

      x = side * (px + 0.02);
      y = py - 0.62;
      z = pz - 1.02;
      t = 0.0 + 0.35 * Math.random();
    } else {
      const s = Math.random();
      const radius = 0.22 * (1 - s * 0.55);
      const a = Math.random() * Math.PI * 2;
      const rr = radius * Math.sqrt(Math.random());
      x = Math.cos(a) * rr;
      z = Math.sin(a) * rr - 0.5 - s * 0.15;
      y = -0.55 - s * 0.9;
      t = 0.1 + 0.3 * Math.random();
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    tmp.copy(C_TEAL).lerp(C_BLUE, t);
    // 80% small/subtle "mass" particles, 20% larger/brighter "glow" hubs —
    // perspective (see uPixelRatio scaling in the vertex shader) already
    // shrinks whichever of these sit farther from camera, so this ratio
    // reads as background-fill vs. foreground-detail without a separate
    // depth pass.
    const isGlow = Math.random() < 0.2;
    if (isGlow) {
      tmp.lerp(C_VIOLET, 0.55);
      glow[i] = 1;
      sizes[i] = 1.5 + Math.random() * 1.2;
    } else {
      glow[i] = 0;
      sizes[i] = 0.5 + Math.random() * 0.4;
    }

    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
    phase[i] = Math.random() * Math.PI * 2;
  }

  return { positions, colors, sizes, glow, phase };
}

// Fully radial in 3D (was XY-radial + a flat, unconditional +Z push) — the
// old +Z-only term shoved every particle the same direction along Z
// regardless of its own position, which reads as a one-sided drift once
// the camera is viewing from the side (its screen-horizontal axis is world
// Z, not X). Displacing along each particle's own direction from the
// origin keeps the explosion centered from any viewing angle.
const DISPERSE_GLSL = `
  vec3 disperse(vec3 p, float f) {
    float len = length(p);
    vec3 dir = len > 0.0001 ? p / len : vec3(0.0);
    p += dir * f * (2.6 + 0.6 * (p.z + 1.5));
    return p;
  }
`;

// Every cerebrum/cerebellum particle already carries its left/right hemisphere
// side baked into the sign of its rest-position x (see buildBrain's `side`
// variable) — "opening" the brain is just widening that existing gap along x.
const HEMISPHERE_SPLIT_GLSL = `
  vec3 splitHemispheres(vec3 p, float amount) {
    p.x += sign(p.x) * amount;
    return p;
  }
`;

// ── ATO III/IV: fly-through disperses points outward; uDissolve stochastically
// discards points per-particle (via their phase as a stable random seed) for
// the Ato IV "dot-matrix dissolve" instead of a uniform fade. uBloom brightens
// the core toward white, approximating a bloom pass without a postprocess cost.
// uDisplace (Ato III only, desktop only — see CAMADA 3) folds in simplex-noise
// vertex displacement for an organic "boiling" surface during the fly-through.
// uCursorNDC/uCursorActive give hub ("glow") particles a brightness boost when
// the pointer is near their projected screen position.
const POINT_VERT = `
  uniform float uTime;
  uniform float uFly;
  uniform float uPixelRatio;
  uniform float uDisplace;
  uniform float uHemisphereSplit;
  uniform vec2 uCursorNDC;
  uniform float uCursorActive;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aGlow;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vGlow;
  varying float vPhase;
  varying float vCursorBoost;
  ${DISPERSE_GLSL}
  ${HEMISPHERE_SPLIT_GLSL}
  ${SIMPLEX_NOISE_GLSL}
  ${DISPLACEMENT_GLSL}
  void main() {
    vec3 p = splitHemispheres(position, uHemisphereSplit);
    p = disperse(p, uFly);
    p = displace(p, uDisplace, uTime);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float pulse = 0.5 + 0.5 * sin(uTime * 0.9 + aPhase);
    float size = aSize * (1.0 + aGlow * pulse * 0.35);
    gl_PointSize = clamp(size * uPixelRatio * (4.6 / -mv.z), 1.1, 15.0);
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
    vGlow = aGlow * pulse;
    vPhase = fract(aPhase / 6.2831853);

    vCursorBoost = 0.0;
    if (uCursorActive > 0.5 && aGlow > 0.5) {
      vec2 ndc = gl_Position.xy / gl_Position.w;
      float d = distance(ndc, uCursorNDC);
      vCursorBoost = (1.0 - smoothstep(0.0, 0.35, d)) * 0.15;
    }
  }
`;

const POINT_FRAG = `
  precision mediump float;
  uniform float uBloom;
  uniform float uDissolve;
  varying vec3 vColor;
  varying float vGlow;
  varying float vPhase;
  varying float vCursorBoost;
  void main() {
    if (vPhase < uDissolve) discard;
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.42, 0.48, d);
    // vec3(0.0, 0.647, 0.914) = #00A5E9, the brand manual's vivid-blue
    // swatch — cold, not the amber this used to be (which muddied toward
    // brown when mixed with the teal/blue base).
    vec3 col = mix(vColor, vec3(0.0, 0.647, 0.914), vGlow * 0.6);
    col = mix(col, vec3(1.0), uBloom * 0.35 * (1.0 - d * 1.6));
    col += vCursorBoost;
    gl_FragColor = vec4(col, alpha * (0.9 + vGlow * 0.1));
  }
`;

// ── Chromatic-aberration post pass (Ato III): renders the scene to a target,
// then samples it three times with per-channel UV offsets on a fullscreen
// quad. Built from THREE.WebGLRenderTarget directly — no postprocessing
// addon/dependency needed. Skipped on mobile (see CAMADA performance spec).
const POST_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const POST_FRAG = `
  precision mediump float;
  uniform sampler2D uScene;
  uniform vec2 uAberration;
  varying vec2 vUv;
  void main() {
    float r = texture2D(uScene, vUv + uAberration).r;
    float g = texture2D(uScene, vUv).g;
    float b = texture2D(uScene, vUv - uAberration).b;
    float a = texture2D(uScene, vUv).a;
    gl_FragColor = vec4(r, g, b, a);
  }
`;

export default function BrainHero({ progressRef }: { progressRef?: RefObject<number> }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;
  const parallax = useMouseParallax(mountRef);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
    // Lateral/profile view, not frontal: the brain's front-back axis (z) is
    // its longest (rz=1.42 vs rx=1.15, ry=0.92 in buildBrain), so viewing
    // along world +X reads that length as the horizontal silhouette —
    // frontal lobe curve on one side, cerebellum/brainstem on the other —
    // instead of the symmetric, mirrored left/right hemisphere view. Starts
    // at full viewing distance (ORBIT_RADIUS) — clarity and impact first;
    // the render loop dives in from here as the user scrolls.
    camera.position.set(ORBIT_RADIUS, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    mount.appendChild(renderer.domElement);

    // ── Density bumped ~2.8x on desktop (~2.4x on mobile, kept a bit more
    // conservative to protect frame rate on lower-power devices) so the
    // hollow surface shell still reads as a dense, detailed silhouette
    // rather than a sparse wireframe. Mobile still runs a reduced count,
    // and (below) disables the displacement shader and the
    // chromatic-aberration post pass entirely.
    const COUNT = isMobile ? 12000 : 25000;
    const brain = buildBrain(COUNT);

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(brain.positions, 3));
    geom.setAttribute("aColor", new THREE.BufferAttribute(brain.colors, 3));
    geom.setAttribute("aSize", new THREE.BufferAttribute(brain.sizes, 1));
    geom.setAttribute("aGlow", new THREE.BufferAttribute(brain.glow, 1));
    geom.setAttribute("aPhase", new THREE.BufferAttribute(brain.phase, 1));

    const pointMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uFly: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uBloom: { value: 0 },
        uDissolve: { value: 0 },
        uDisplace: { value: 0 },
        uHemisphereSplit: { value: 0 },
        uCursorNDC: { value: new THREE.Vector2(0, 0) },
        uCursorActive: { value: 0 },
      },
      vertexShader: POINT_VERT,
      fragmentShader: POINT_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    // Clean point-cloud only — no connecting lines/synapse graph, no
    // internal mesh or "aurora" volume. The brain's silhouette is defined
    // purely by these points.
    const points = new THREE.Points(geom, pointMat);
    scene.add(points);

    // ── Chromatic-aberration post pass setup (desktop only) ───────────────
    let renderTarget = isMobile
      ? null
      : new THREE.WebGLRenderTarget(mount.clientWidth * pixelRatio, mount.clientHeight * pixelRatio);
    const postScene = new THREE.Scene();
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const postMat = new THREE.ShaderMaterial({
      uniforms: {
        uScene: { value: renderTarget?.texture ?? null },
        uAberration: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: POST_VERT,
      fragmentShader: POST_FRAG,
      depthTest: false,
      depthWrite: false,
    });
    const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat);
    postScene.add(postQuad);

    let resizeTimer = 0;
    const applyResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h || 1;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (renderTarget) {
        renderTarget.dispose();
        renderTarget = new THREE.WebGLRenderTarget(w * pixelRatio, h * pixelRatio);
        postMat.uniforms.uScene!.value = renderTarget.texture;
      }
    };
    // Debounced resize (150ms) — avoids thrashing the render target during
    // a drag-resize.
    const resize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(applyResize, RESIZE_DEBOUNCE_MS);
    };

    // ── Reduced motion: one static, centered frame — no scroll-jack, no RAF ──
    if (reduced) {
      camera.position.set(ORBIT_RADIUS, 0, 0);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      window.addEventListener("resize", resize);
      return () => {
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", resize);
        geom.dispose();
        pointMat.dispose();
        renderTarget?.dispose();
        postMat.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      };
    }

    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const render = () => {
      // THREE.Clock.getElapsedTime() calls getDelta() internally — calling
      // both in the same frame would double-consume the clock's timer, so
      // getDelta() is called for its side effect of advancing
      // clock.elapsedTime, and only that elapsed value is used below.
      clock.getDelta();
      const t = clock.elapsedTime;
      const progress = progressRef?.current ?? 0;

      // ── ATO I (0–0.22): revelação — quase parado, cérebro a assentar ──
      // ── ATO II (0.22–0.55): dissecação — bloom sobe no núcleo ──
      const act2 = smoothstep(ACT2_START, ACT3_START, progress);
      // ── ATO III (0.55–0.85): fly-through — explosão + aberração + displacement ──
      const act3 = smoothstep(ACT3_START, ACT4_START, progress);
      // ── ATO IV (0.85–1.0): emergência de dados — dissolve em pontos ──
      const act4 = smoothstep(ACT4_START, 1.0, progress);

      const fly = act3; // macro dive, driven by scroll
      const hemisphereOpen = smoothstep(0, HEMISPHERE_OPEN_END, progress);
      pointMat.uniforms.uTime!.value = t;
      pointMat.uniforms.uFly!.value = fly;
      pointMat.uniforms.uBloom!.value = act2 * (1 - act4);
      pointMat.uniforms.uDissolve!.value = act4;
      pointMat.uniforms.uDisplace!.value = isMobile ? 0 : act3 * 0.04;
      pointMat.uniforms.uHemisphereSplit!.value = hemisphereOpen * HEMISPHERE_SPLIT_MAX;
      pointMat.uniforms.uCursorNDC!.value.set(parallax.xRef.current, -parallax.yRef.current);
      pointMat.uniforms.uCursorActive!.value = 1;

      // Micro-tremor idle (±0.4px equivalent, ~0.6Hz) on the core when the
      // narrative is resting (Ato I) and the pointer parallax is near zero —
      // reads as "alive" rather than a static render.
      const idleTremor = (1 - smoothstep(0.02, ACT2_START, progress)) * 0.0025;
      const tremorX = Math.sin(t * 0.6 * Math.PI * 2) * idleTremor;
      const tremorY = Math.cos(t * 0.51 * Math.PI * 2) * idleTremor;

      // Continuous idle spin while resting at the very top (time-driven, not
      // scroll-driven) — hands off fast (within the first 5% of scroll) to
      // the scroll-driven hemisphere opening, instead of the two competing.
      const idleSpinFade = 1 - smoothstep(0.0, 0.05, progress);
      const idleSpinAngle = t * 0.18 * idleSpinFade;

      points.rotation.y = parallax.xRef.current * 0.25 + idleSpinAngle;
      points.rotation.x = parallax.yRef.current * 0.15;
      points.position.set(tremorX, tremorY, 0);
      points.updateMatrixWorld();

      // ── Camera: holds the fixed lateral/profile angle (ORBIT_PHASE) for the
      // entire scroll journey — no rotation, no orbit. The brain itself
      // idle-spins in place at rest (see idleSpin above); scroll drives only
      // a straight dolly-in from ORBIT_RADIUS toward CAMERA_MIN_RADIUS, read
      // as a clean, direct expansion/zoom with no swirl or pirouette.
      const zoomIn = smoothstep(0.0, 0.9, progress);
      const orbitRadius = lerp(ORBIT_RADIUS, CAMERA_MIN_RADIUS, zoomIn);
      camera.position.x = Math.sin(ORBIT_PHASE) * orbitRadius;
      camera.position.z = Math.cos(ORBIT_PHASE) * orbitRadius;
      camera.position.y = 0;
      camera.lookAt(0, 0, 0);

      const aberration = isMobile ? 0 : act3 * 0.0015;

      // The render-target + fullscreen-quad pass doubles fill-rate cost —
      // only pay for it while the effect is actually visible (Ato III), and
      // never on mobile (see performance spec).
      if (renderTarget && aberration > 0.00005) {
        postMat.uniforms.uAberration!.value.set(aberration, aberration);
        renderer.setRenderTarget(renderTarget);
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);
        renderer.render(postScene, postCamera);
      } else {
        renderer.render(scene, camera);
      }

      if (running) raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    // Pause the RAF loop entirely once the visual scrolls out of view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        running = !!entry?.isIntersecting;
        if (running) {
          clock.getDelta(); // avoid a big dt jump after being paused
          raf = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    observer.observe(mount);

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      geom.dispose();
      pointMat.dispose();
      renderTarget?.dispose();
      postMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [reduced, progressRef, parallax.xRef, parallax.yRef]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
