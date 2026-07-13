"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

import { DISPLACEMENT_GLSL, SIMPLEX_NOISE_GLSL } from "@/components/hero/displacementShader";
import { createSynapseGraph, type SynapseGraph } from "@/components/hero/SynapseGraph";
import { useMouseParallax } from "@/components/hero/useMouseParallax";

type BrainData = {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  glow: Float32Array;
  phase: Float32Array;
  glowIndices: number[];
};

const C_BLUE = new THREE.Color("#1E5BFF");
const C_TEAL = new THREE.Color("#12C7C0");
const C_VIOLET = new THREE.Color("#8B5CF6");

// ── Act boundaries (scroll progress 0..1) ──────────────────────────────
const ACT2_START = 0.22;
const ACT3_START = 0.55;
const ACT4_START = 0.85;
const MOBILE_BREAKPOINT = 768;
const RESIZE_DEBOUNCE_MS = 150;

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
  const glowIndices: number[] = [];

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
    const isGlow = Math.random() < 0.09;
    if (isGlow) {
      tmp.lerp(C_VIOLET, 0.55);
      glow[i] = 1;
      sizes[i] = 1.5 + Math.random() * 1.0;
      glowIndices.push(i);
    } else {
      glow[i] = 0;
      sizes[i] = 0.55 + Math.random() * 0.5;
    }

    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
    phase[i] = Math.random() * Math.PI * 2;
  }

  return { positions, colors, sizes, glow, phase, glowIndices };
}

/** A faint rotating polar grid (concentric rings + spokes) revealed behind the brain in Ato II. */
function buildPolarGrid(rings: number, segments: number, spokes: number, maxRadius: number) {
  const verts: number[] = [];
  for (let r = 1; r <= rings; r++) {
    const radius = (r / rings) * maxRadius;
    for (let s = 0; s < segments; s++) {
      const a0 = (s / segments) * Math.PI * 2;
      const a1 = ((s + 1) / segments) * Math.PI * 2;
      verts.push(Math.cos(a0) * radius, Math.sin(a0) * radius, 0, Math.cos(a1) * radius, Math.sin(a1) * radius, 0);
    }
  }
  for (let s = 0; s < spokes; s++) {
    const a = (s / spokes) * Math.PI * 2;
    verts.push(0, 0, 0, Math.cos(a) * maxRadius, Math.sin(a) * maxRadius, 0);
  }
  return new Float32Array(verts);
}

const DISPERSE_GLSL = `
  vec3 disperse(vec3 p, float f) {
    float len = length(p.xy);
    vec2 dir = len > 0.0001 ? p.xy / len : vec2(0.0);
    p.xy += dir * f * (1.7 + 0.6 * (p.z + 1.5));
    p.z += f * 3.4;
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
  ${SIMPLEX_NOISE_GLSL}
  ${DISPLACEMENT_GLSL}
  void main() {
    vec3 p = disperse(position, uFly);
    p = displace(p, uDisplace, uTime);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float pulse = 0.5 + 0.5 * sin(uTime * 2.2 + aPhase);
    float size = aSize * (1.0 + aGlow * pulse * 1.4);
    gl_PointSize = clamp(size * uPixelRatio * (4.6 / -mv.z), 0.6, 15.0);
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
    float alpha = 1.0 - smoothstep(0.40, 0.5, d);
    vec3 col = mix(vColor, vec3(0.55, 0.25, 0.95), vGlow * 0.6);
    col = mix(col, vec3(1.0), uBloom * 0.35 * (1.0 - d * 1.6));
    col += vCursorBoost;
    gl_FragColor = vec4(col, alpha * (0.9 + vGlow * 0.1));
  }
`;

const GRID_VERT = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GRID_FRAG = `
  precision mediump float;
  uniform float uOpacity;
  void main() {
    gl_FragColor = vec4(0.118, 0.357, 1.0, uOpacity);
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
    camera.position.set(0, 0, 4.3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    mount.appendChild(renderer.domElement);

    // ── Mobile: 5 "planes" worth of density instead of 7 — reduce particle
    // and node counts, and (below) disable the displacement shader and the
    // chromatic-aberration post pass entirely.
    const COUNT = isMobile ? 5000 : 9000;
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
        uCursorNDC: { value: new THREE.Vector2(0, 0) },
        uCursorActive: { value: 0 },
      },
      vertexShader: POINT_VERT,
      fragmentShader: POINT_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const points = new THREE.Points(geom, pointMat);
    scene.add(points);

    // ── Ato IV synapse graph — extracted module (kNN=3, blue-noise node
    // spread, traveling pulses, hover-triggered spikes).
    const synapse: SynapseGraph = createSynapseGraph({
      positions: brain.positions,
      glowIndices: brain.glowIndices,
      maxNodes: isMobile ? 50 : 90,
      kNeighbors: 3,
      minNodeSeparation: 0.14,
      pulseCount: isMobile ? 120 : 240,
      pixelRatio,
    });
    scene.add(synapse.lines);
    if (synapse.pulses) scene.add(synapse.pulses);

    // ── Ato II: faint rotating vector grid behind the brain ──────────────
    const gridGeom = new THREE.BufferGeometry();
    gridGeom.setAttribute("position", new THREE.BufferAttribute(buildPolarGrid(6, 48, 16, 3.6), 3));
    const gridMat = new THREE.ShaderMaterial({
      uniforms: { uOpacity: { value: 0 } },
      vertexShader: GRID_VERT,
      fragmentShader: GRID_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const grid = new THREE.LineSegments(gridGeom, gridMat);
    grid.position.z = -2.4;
    scene.add(grid);

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
      camera.position.z = 4.3;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      window.addEventListener("resize", resize);
      return () => {
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", resize);
        geom.dispose();
        pointMat.dispose();
        synapse.dispose();
        gridGeom.dispose();
        gridMat.dispose();
        renderTarget?.dispose();
        postMat.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      };
    }

    // ── Hub-node hover detection: project each synapse node to screen space
    // and, if the pointer sits within its hit radius, fire an immediate spike.
    const nodeWorldPos = new THREE.Vector3();
    let lastHoverCheck = 0;
    const checkHover = (elapsed: number) => {
      if (elapsed - lastHoverCheck < 0.05) return; // ~20Hz is plenty for a hover check
      lastHoverCheck = elapsed;
      const cursorNdcX = parallax.xRef.current;
      const cursorNdcY = -parallax.yRef.current;
      const nodeCount = synapse.nodePositions.length / 3;
      for (let i = 0; i < nodeCount; i++) {
        nodeWorldPos.set(
          synapse.nodePositions[i * 3]!,
          synapse.nodePositions[i * 3 + 1]!,
          synapse.nodePositions[i * 3 + 2]!,
        );
        nodeWorldPos.applyMatrix4(points.matrixWorld).project(camera);
        const dx = nodeWorldPos.x - cursorNdcX;
        const dy = nodeWorldPos.y - cursorNdcY;
        if (dx * dx + dy * dy < 0.02 * 0.02) {
          synapse.triggerSpikeFrom(i);
        }
      }
    };

    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const render = () => {
      // THREE.Clock.getElapsedTime() calls getDelta() internally — calling
      // both in the same frame would double-consume the clock's timer.
      // getDelta() alone gives us both values (it also updates
      // clock.elapsedTime as a side effect).
      const dt = Math.min(0.05, clock.getDelta());
      const t = clock.elapsedTime;
      const progress = progressRef?.current ?? 0;

      // ── ATO I (0–0.22): revelação — quase parado, cérebro a assentar ──
      // ── ATO II (0.22–0.55): dissecação — grid vetorial surge atrás ──
      const act2 = smoothstep(ACT2_START, ACT3_START, progress);
      // ── ATO III (0.55–0.85): fly-through — explosão + aberração + displacement ──
      const act3 = smoothstep(ACT3_START, ACT4_START, progress);
      // ── ATO IV (0.85–1.0): emergência de dados — dissolve em pontos ──
      const act4 = smoothstep(ACT4_START, 1.0, progress);

      const fly = act3; // macro dive, driven by scroll
      pointMat.uniforms.uTime!.value = t;
      pointMat.uniforms.uFly!.value = fly;
      pointMat.uniforms.uBloom!.value = act2 * (1 - act4);
      pointMat.uniforms.uDissolve!.value = act4;
      pointMat.uniforms.uDisplace!.value = isMobile ? 0 : act3 * 0.18;
      pointMat.uniforms.uCursorNDC!.value.set(parallax.xRef.current, -parallax.yRef.current);
      pointMat.uniforms.uCursorActive!.value = 1;

      synapse.lineMat.uniforms.uFly!.value = fly;
      synapse.lineMat.uniforms.uOpacity!.value = 0.16 * (1 - act4) * (1 - act3 * 0.5);
      gridMat.uniforms.uOpacity!.value = act2 * (1 - act4) * 0.22;
      grid.rotation.z = t * 0.03 + act2 * ((8 * Math.PI) / 180);

      // Micro-tremor idle (±0.4px equivalent, ~0.6Hz) on the core when the
      // narrative is resting (Ato I) and the pointer parallax is near zero —
      // reads as "alive" rather than a static render.
      const idleTremor = (1 - smoothstep(0.02, ACT2_START, progress)) * 0.0025;
      const tremorX = Math.sin(t * 0.6 * Math.PI * 2) * idleTremor;
      const tremorY = Math.cos(t * 0.51 * Math.PI * 2) * idleTremor;

      points.rotation.y = parallax.xRef.current * 0.25 + t * 0.05;
      points.rotation.x = parallax.yRef.current * 0.15;
      points.position.set(tremorX, tremorY, 0);
      points.updateMatrixWorld();
      synapse.lines.rotation.copy(points.rotation);
      if (synapse.pulses) synapse.pulses.rotation.copy(points.rotation);

      synapse.update(dt);
      checkHover(t);

      camera.position.z = lerp(4.3, -1.4, fly);
      camera.lookAt(0, 0, 0);

      const aberration = isMobile ? 0 : act3 * 0.006;

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
      synapse.dispose();
      gridGeom.dispose();
      gridMat.dispose();
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
