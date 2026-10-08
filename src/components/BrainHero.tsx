"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

import { DISPLACEMENT_GLSL, SIMPLEX_NOISE_GLSL } from "@/components/hero/displacementShader";
import { HEART_RED_RGB, HEARTBEAT_BLINK_DECAY, heartbeatPhase } from "@/components/hero/heartbeat";
import { useMouseParallax } from "@/components/hero/useMouseParallax";

type BrainData = {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  glow: Float32Array;
  phase: Float32Array;
  /** Particles [0, cerebrumCount) are the cerebrum's folded cortex surface. */
  cerebrumCount: number;
};

// The version 2 palette, which the team preferred for the 3D brain: electric
// cyan → royal blue across the surface, glow hubs toward a bright cyan.
// Additive blending (see pointMat) lets dense regions bloom on the dark Hero.
const C_BLUE = new THREE.Color("#3B82F6");
const C_TEAL = new THREE.Color("#22D3EE");
const C_CYAN = new THREE.Color("#00F0FF");

// Neural-connection graph: a subset of glow hubs linked to their nearest
// same-hemisphere neighbours (see buildConnections).
const LINK_MAX_DIST = 0.24;
const LINK_MAX_DEGREE = 3;

// Vital-sign spot: a handful of the brain's own surface points on the upper
// front of the frontal lobe, turned heart-red and blinking on the shared
// heartbeat clock — the brain-side echo of the ECG in the Hero's HUD card.
// The anchor blinks first; the signal then travels along red edges to the
// neighbours, each blinking as it arrives.
const VITAL_NEIGHBOURS = 7; // extra points around the anchor (0 = a single red point)
const VITAL_SPREAD = 0.36; // max distance of a neighbour from the anchor (world units)
const VITAL_MIN_GAP = 0.07; // keeps the constellation spread out rather than clumped
const VITAL_DELAY_PER_UNIT = 0.35; // signal travel time, in beat fractions per world unit
const VITAL_ANCHOR_SIZE = 5.5;
const VITAL_NEIGHBOUR_SIZE = 3.0;

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
// On narrow viewports the sticky Hero section is much shorter relative to
// its width, so the same radius reads as a much larger silhouette relative
// to the screen — big enough to crowd under the fixed Navbar and blow past
// the section's own side margins. A larger starting radius (camera farther
// back) keeps the point cloud proportionally smaller on mobile instead.
const MOBILE_ORBIT_RADIUS = 5.6;
const ORBIT_PHASE = Math.PI / 2;
// The brain's own turn on top of that profile. 0 = a true side view (asked
// for on 6 Oct 2026, replacing the near-frontal 80° pose): frontal lobe to
// the left, cerebellum and brainstem to the right, and the red vital spot on
// the upper front of the hemisphere facing the camera.
const BRAIN_YAW = THREE.MathUtils.degToRad(0);
// Seen from the side the brain is wider than tall: about 3.1 world units from
// frontal lobe to cerebellum. On portrait screens (phones, tablets) the start
// distance is pushed back until that width fills at most ~86% of the screen.
const CAMERA_FOV = 55;
const PROFILE_FIT_WIDTH = 3.6;

function startRadius(isMobile: boolean, width: number, height: number): number {
  const base = isMobile ? MOBILE_ORBIT_RADIUS : ORBIT_RADIUS;
  const aspect = width / height || 1;
  const fit = PROFILE_FIT_WIDTH / (2 * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2)) * aspect);
  return Math.max(base, fit);
}

// ── The star field (Pedro, 8 Oct 2026): after the explosion the points stay
// as stars behind the whole Home instead of dissolving to nothing, and
// scrolling on "navigates" inside them.
// Share of points the Ato IV dissolve removes when the field continues.
const STAR_DISSOLVE = 0.32;
// Connections never fade below this once they are stars' links.
const STAR_LINE_FLOOR = 0.2;

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
      tmp.lerp(C_CYAN, 0.6);
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

  return { positions, colors, sizes, glow, phase, cerebrumCount: nCerebrum };
}

type VitalSpot = {
  /** Brain particle indices, anchor first. */
  nodes: number[];
  /** Blink delay per node, as a fraction of the beat (0 for the anchor). */
  delays: number[];
  /** Signal-carrying edges as [from, to] positions in `nodes`, oriented away from the anchor. */
  edges: [number, number][];
};

/**
 * Picks the vital-sign spot (see VITAL_* above) among the cerebrum's glow
 * hubs on the +x hemisphere — the side that faces the camera.
 * Must run before buildConnections: the caller zeroes these points' glow,
 * which keeps them out of the cyan hub graph.
 */
function pickVitalSpot(brain: BrainData): VitalSpot {
  const p = brain.positions;
  const dist = (a: number, b: number) =>
    Math.hypot(p[a * 3]! - p[b * 3]!, p[a * 3 + 1]! - p[b * 3 + 1]!, p[a * 3 + 2]! - p[b * 3 + 2]!);

  const pool: number[] = [];
  for (let i = 0; i < brain.cerebrumCount; i++) {
    if (brain.glow[i] === 1 && p[i * 3]! > 0) pool.push(i);
  }

  // Anchor: on the frontal lobe's outer face. +z is the front, +y up, +x
  // toward the camera: weighting x first keeps it on the face the side view
  // looks at, instead of on the silhouette's front edge.
  let anchor = pool[0] ?? 0;
  let best = -Infinity;
  for (const i of pool) {
    const score = p[i * 3]! + 0.6 * p[i * 3 + 2]! + 0.4 * p[i * 3 + 1]!;
    if (score > best) {
      best = score;
      anchor = i;
    }
  }

  // Neighbours: farthest-point sampling within VITAL_SPREAD of the anchor, so
  // the few red points form an even little constellation.
  const near = pool.filter((i) => i !== anchor && dist(i, anchor) <= VITAL_SPREAD);
  const nodes = [anchor];
  while (nodes.length < 1 + VITAL_NEIGHBOURS) {
    let pick = -1;
    let pickGap = VITAL_MIN_GAP;
    for (const i of near) {
      const gap = Math.min(...nodes.map((n) => dist(i, n)));
      if (gap > pickGap) {
        pickGap = gap;
        pick = i;
      }
    }
    if (pick < 0) break;
    nodes.push(pick);
  }

  // Minimum spanning tree grown from the anchor (Prim) — each point's delay
  // is the signal's travel time along the tree, so it blinks on arrival.
  const delays = nodes.map(() => 0);
  const edges: [number, number][] = [];
  const inTree = [0];
  while (inTree.length < nodes.length) {
    let from = -1;
    let to = -1;
    let shortest = Infinity;
    for (const a of inTree) {
      for (let b = 0; b < nodes.length; b++) {
        if (inTree.includes(b)) continue;
        const d = dist(nodes[a]!, nodes[b]!);
        if (d < shortest) {
          shortest = d;
          from = a;
          to = b;
        }
      }
    }
    inTree.push(to);
    edges.push([from, to]);
    delays[to] = delays[from]! + shortest * VITAL_DELAY_PER_UNIT;
  }

  return { nodes, delays, edges };
}

/**
 * Links up to `maxHubs` glow hubs to their nearest neighbours (same
 * hemisphere only — cross-hemisphere edges would stretch across the gap as
 * the hemispheres open), then appends the vital spot's red edges. Each edge
 * carries a 0/1 end marker (for the travelling pulse), a stable random
 * phase, and — vital edges only — `vital` = 1 + the upstream point's delay
 * and `travel` = the beat fraction the signal takes to cross it (both 0 on
 * regular edges).
 */
function buildConnections(brain: BrainData, maxHubs: number, spot: VitalSpot) {
  const hubs: number[] = [];
  const total = brain.glow.length;
  for (let i = 0; i < total && hubs.length < maxHubs; i++) {
    if (brain.glow[i] === 1) hubs.push(i);
  }

  const p = brain.positions;
  const degree = new Uint8Array(hubs.length);
  const verts: number[] = [];
  const ends: number[] = [];
  const phases: number[] = [];
  const vital: number[] = [];
  const travel: number[] = [];
  const maxD2 = LINK_MAX_DIST * LINK_MAX_DIST;

  for (let a = 0; a < hubs.length; a++) {
    if (degree[a]! >= LINK_MAX_DEGREE) continue;
    const ia = hubs[a]! * 3;
    const ax = p[ia]!;
    const ay = p[ia + 1]!;
    const az = p[ia + 2]!;
    for (let b = a + 1; b < hubs.length && degree[a]! < LINK_MAX_DEGREE; b++) {
      if (degree[b]! >= LINK_MAX_DEGREE) continue;
      const ib = hubs[b]! * 3;
      const bx = p[ib]!;
      if (Math.sign(ax) !== Math.sign(bx)) continue;
      const dx = ax - bx;
      const dy = ay - p[ib + 1]!;
      const dz = az - p[ib + 2]!;
      if (dx * dx + dy * dy + dz * dz > maxD2) continue;
      verts.push(ax, ay, az, bx, p[ib + 1]!, p[ib + 2]!);
      ends.push(0, 1);
      const ph = Math.random();
      phases.push(ph, ph);
      vital.push(0, 0);
      travel.push(0, 0);
      degree[a] = degree[a]! + 1;
      degree[b] = degree[b]! + 1;
    }
  }

  for (const [from, to] of spot.edges) {
    const ia = spot.nodes[from]! * 3;
    const ib = spot.nodes[to]! * 3;
    verts.push(p[ia]!, p[ia + 1]!, p[ia + 2]!, p[ib]!, p[ib + 1]!, p[ib + 2]!);
    ends.push(0, 1);
    phases.push(0, 0);
    const start = spot.delays[from]!;
    const duration = Math.max(spot.delays[to]! - start, 0.02);
    vital.push(1 + start, 1 + start);
    travel.push(duration, duration);
  }

  return {
    positions: new Float32Array(verts),
    ends: new Float32Array(ends),
    phases: new Float32Array(phases),
    vital: new Float32Array(vital),
    travel: new Float32Array(travel),
  };
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
  uniform float uBeatPhase;
  uniform float uField;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aGlow;
  attribute float aPhase;
  attribute float aVital;
  varying vec3 vColor;
  varying float vGlow;
  varying float vPhase;
  varying float vCursorBoost;
  varying float vSpark;
  varying float vVital;
  varying float vBlink;
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

    // Synaptic activity: (1) an EEG-like wave front sweeping front→back
    // along the brain's long axis (z), with a slower secondary wave along y;
    // (2) sparse, sharp per-neuron "firing" spikes on the glow hubs.
    float wave = pow(0.5 + 0.5 * sin(position.z * 3.2 - uTime * 2.1), 14.0);
    float wave2 = pow(0.5 + 0.5 * sin(position.y * 4.0 + uTime * 1.3), 20.0) * 0.5;
    float fire = pow(0.5 + 0.5 * sin(uTime * 1.9 + aPhase * 7.0), 48.0) * aGlow;
    vSpark = clamp(max(max(wave, wave2) * 0.75, fire), 0.0, 1.0);

    // Vital-sign points (aVital = 1 + delay, see pickVitalSpot): blink on the
    // shared heartbeat clock, offset by the signal's travel time from the
    // anchor; the cyan EEG sparks skip them so they stay clean red.
    float isVital = step(0.5, aVital);
    float beatLocal = fract(uBeatPhase - max(aVital - 1.0, 0.0));
    vBlink = exp(-beatLocal / ${HEARTBEAT_BLINK_DECAY.toFixed(3)}) * isVital;
    vVital = isVital;
    vSpark *= 1.0 - isVital;

    float size = aSize * (1.0 + aGlow * pulse * 0.35 + vSpark * 0.6) * (1.0 + uField * 0.7);
    size = mix(size, aSize * (1.2 + vBlink * 1.4), isVital);
    // Vital points get a higher cap (in CSS px) so they stay bold on retina too.
    // In the star field even far points stay visible as stars.
    gl_PointSize = clamp(size * uPixelRatio * (4.6 / -mv.z), mix(1.1, 1.9, uField), mix(18.0, 40.0 * uPixelRatio, isVital));
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
  varying float vSpark;
  varying float vVital;
  varying float vBlink;
  void main() {
    // The red vital points stay through the dissolve.
    if (vPhase < uDissolve && vVital < 0.5) discard;
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    // Bright core + soft halo — reads as emissive light under additive
    // blending rather than a flat disc.
    float core = 1.0 - smoothstep(0.18, 0.34, d);
    float halo = pow(1.0 - d * 2.0, 2.0);
    float shape = max(core, halo * 0.55);
    // vec3(0.0, 0.941, 1.0) = #00F0FF electric cyan.
    vec3 col = mix(vColor, vec3(0.0, 0.941, 1.0), vGlow * 0.6);
    col = mix(col, vec3(0.75, 0.98, 1.0), vSpark * 0.7);
    // Ato II bloom whitens the cloud; vital points keep most of their red.
    col = mix(col, vec3(1.0), uBloom * 0.35 * (1.0 - d * 1.6) * (1.0 - vVital * 0.8));
    col += vCursorBoost;
    // Vital points flash hot pink-white at the centre on each beat.
    col = mix(col, vec3(1.0, 0.85, 0.88), vBlink * 0.5 * core);
    float alpha = shape * (0.5 + vGlow * 0.3 + vSpark * 0.5);
    alpha = mix(alpha, shape * (0.8 + vBlink * 0.2), vVital);
    gl_FragColor = vec4(col * 1.15 * (1.0 + vBlink * 0.5), alpha);
  }
`;

// ── Neural connections: thin edges between nearby hubs. Same position
// pipeline as the points (split → disperse → displace) so edges stay
// attached to their nodes through every act. Opacity breathes per edge, and
// on a random ~40% of cycles a bright pulse travels along the edge (aEnd
// 0 → 1), reading as a signal firing across a synapse. The vital spot's
// edges (aVital > 0) are red instead, and their pulse is timed to the
// heartbeat: it leaves the upstream point as that point blinks and arrives
// (after aVitalTravel) as the downstream point blinks.
const LINE_VERT = `
  uniform float uTime;
  uniform float uFly;
  uniform float uDisplace;
  uniform float uHemisphereSplit;
  uniform float uBeatPhase;
  attribute float aEnd;
  attribute float aEdgePhase;
  attribute float aVital;
  attribute float aVitalTravel;
  varying float vEnd;
  varying float vEdgePhase;
  varying float vVital;
  varying float vVitalHead;
  varying float vVitalGlow;
  ${DISPERSE_GLSL}
  ${HEMISPHERE_SPLIT_GLSL}
  ${SIMPLEX_NOISE_GLSL}
  ${DISPLACEMENT_GLSL}
  void main() {
    vec3 p = splitHemispheres(position, uHemisphereSplit);
    p = disperse(p, uFly);
    p = displace(p, uDisplace, uTime);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    vEnd = aEnd;
    vEdgePhase = aEdgePhase;
    // Same value on both vertices of an edge, so these stay constant along it.
    vVital = step(0.5, aVital);
    float beatLocal = fract(uBeatPhase - max(aVital - 1.0, 0.0));
    vVitalHead = beatLocal / max(aVitalTravel, 0.001);
    vVitalGlow = exp(-beatLocal / 0.2);
  }
`;

const LINE_FRAG = `
  uniform float uTime;
  uniform float uLineFade;
  uniform float uActivity;
  varying float vEnd;
  varying float vEdgePhase;
  varying float vVital;
  varying float vVitalHead;
  varying float vVitalGlow;
  void main() {
    if (vVital > 0.5) {
      float signal = exp(-pow((vEnd - vVitalHead) * 7.0, 2.0)) * (1.0 - step(1.15, vVitalHead));
      vec3 red = vec3(${HEART_RED_RGB.map((c) => c.toFixed(3)).join(", ")});
      vec3 vitalCol = mix(red, vec3(1.0, 0.8, 0.85), signal * 0.5);
      gl_FragColor = vec4(vitalCol, (0.34 + vVitalGlow * 0.3 + signal * 0.75) * uLineFade);
      return;
    }
    float breathe = (0.07 + 0.06 * (0.5 + 0.5 * sin(uTime * 1.4 + vEdgePhase * 6.2831853))) * (1.0 - uActivity * 0.55);
    float cycle = uTime * 0.45 + vEdgePhase;
    float head = fract(cycle);
    // uActivity (the star field) fires more edges; a few pulses are "strong"
    // (wider and brighter) and a few golden — electricity crossing the field.
    float seed = floor(cycle) * 12.9898 + vEdgePhase * 78.233;
    float gate = step(0.6 - uActivity * 0.22, fract(sin(seed) * 43758.5453));
    float strong = step(0.9, fract(sin(seed * 1.7 + 3.1) * 24634.6345));
    float gold = step(0.8, fract(sin(seed * 2.3 + 7.7) * 15731.743)) * uActivity;
    float width = mix(8.0, 3.5, strong);
    float pulse = exp(-pow((vEnd - head) * width, 2.0)) * gate;
    // #3B82F6 royal blue → #00F0FF electric cyan as a pulse passes; golden ones
    // in the brand gold #D99921.
    vec3 col = mix(vec3(0.231, 0.51, 0.965), vec3(0.0, 0.941, 1.0), 0.4 + pulse * 0.6);
    col = mix(col, vec3(1.0, 0.72, 0.2), gold * pulse);
    float lift = 1.0 + strong * 0.8 + uActivity * 0.6;
    gl_FragColor = vec4(col, (breathe + pulse * 0.75 * lift) * uLineFade);
  }
`;

// ── Vital overlay: the vital points drawn a second time, on top of the cloud
// with normal (not additive) blending, as a solid anti-aliased red disc.
// Additive blending alone lets the dense cyan cloud behind wash the red out
// toward pink-white; the opaque disc keeps it reading as clean heart-red
// wherever it sits, while the additive pass underneath still supplies the
// soft red glow around it. Shares POINT_VERT, so size and position match
// the additive pass exactly.
const VITAL_FRAG = `
  varying float vBlink;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = 1.0 - smoothstep(0.3, 0.4, d);
    if (disc <= 0.0) discard;
    vec3 red = vec3(${HEART_RED_RGB.map((c) => c.toFixed(3)).join(", ")});
    vec3 col = mix(red, vec3(1.0, 0.85, 0.88), vBlink * 0.55 * (1.0 - smoothstep(0.0, 0.22, d)));
    gl_FragColor = vec4(col, disc);
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

export default function BrainHero({
  progressRef,
  heroRef,
  continuous = false,
}: {
  progressRef?: RefObject<number>;
  /** The Hero section: where its scroll ends, the star-field "navigation" starts. */
  heroRef?: RefObject<HTMLElement | null>;
  /** Keep the exploded points as a living star field (the Home's fixed backdrop). */
  continuous?: boolean;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;
  const parallax = useMouseParallax(mountRef);
  // Bumped when a lost WebGL context is restored, to rebuild the scene.
  const [glEpoch, setGlEpoch] = useState(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    let orbitStart = startRadius(isMobile, mount.clientWidth, mount.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, mount.clientWidth / mount.clientHeight, 0.1, 100);
    // Lateral/profile view, not frontal: the brain's front-back axis (z) is
    // its longest (rz=1.42 vs rx=1.15, ry=0.92 in buildBrain), so viewing
    // along world +X reads that length as the horizontal silhouette —
    // frontal lobe curve on one side, cerebellum/brainstem on the other —
    // instead of the symmetric, mirrored left/right hemisphere view (the
    // brain is then turned by BRAIN_YAW to bring the frontal lobe forward). Starts
    // at full viewing distance (orbitStart) — clarity and impact first;
    // the render loop dives in from here as the user scrolls.
    camera.position.set(orbitStart, 0, 0);

    // WebGL can be missing or refused (disabled in the browser, blocklisted
    // GPU, a lost context that never came back): three.js throws here. The
    // Hero reads fine without the brain, so skip it instead of breaking the page.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (error) {
      console.warn("[BrainHero] WebGL unavailable — rendering the Hero without the brain.", error);
      return;
    }
    // None of the ShaderMaterials below convert colour spaces (no
    // <colorspace_fragment>) and the canvas clears to transparent, so this
    // changes no pixel. It makes the canvas pass and the Ato III render-target
    // pass share one shader program per material: with the default sRGB output
    // the first aberration frame compiled a second set on the main thread
    // (~0.7 s of blocked input, the INP the Vercel toolbar flagged).
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    // Reading the link status/log after every compile forces it to finish
    // synchronously (150–220 ms per program); keep that check for development.
    renderer.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    mount.appendChild(renderer.domElement);

    // ── WebGL context loss (GPU reset, driver hiccup, the browser's context
    // cap): three.js can't recover on its own, so the canvas would stay blank
    // and the Hero would read as "all black". preventDefault lets the browser
    // restore the context; on restore the whole scene is rebuilt (glEpoch).
    const canvas = renderer.domElement;
    let stopLoop = () => {};
    const onContextLost = (event: Event) => {
      event.preventDefault();
      stopLoop();
    };
    const onContextRestored = () => setGlEpoch((n) => n + 1);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    // dispose() alone leaves the GPU context alive until garbage collection;
    // across remounts (route changes, dev reloads) those pile up toward the
    // browser's cap, so the context is released explicitly.
    const releaseRenderer = () => {
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      renderer.dispose();
      renderer.forceContextLoss();
    };

    // ── Density bumped ~2.8x on desktop (~2.4x on mobile, kept a bit more
    // conservative to protect frame rate on lower-power devices) so the
    // hollow surface shell still reads as a dense, detailed silhouette
    // rather than a sparse wireframe. Mobile still runs a reduced count,
    // and (below) disables the displacement shader and the
    // chromatic-aberration post pass entirely.
    const COUNT = isMobile ? 12000 : 25000;
    const brain = buildBrain(COUNT);

    // ── Vital-sign spot: recolour the chosen surface points heart-red, take
    // them out of the cyan hub graph (glow = 0) and flag them for the blink
    // via aVital = 1 + their delay (0 = regular point).
    const vital = pickVitalSpot(brain);
    const vitalAttr = new Float32Array(COUNT);
    vital.nodes.forEach((index, n) => {
      vitalAttr[index] = 1 + vital.delays[n]!;
      brain.colors.set(HEART_RED_RGB, index * 3);
      brain.glow[index] = 0;
      brain.sizes[index] = n === 0 ? VITAL_ANCHOR_SIZE : VITAL_NEIGHBOUR_SIZE;
    });

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(brain.positions, 3));
    geom.setAttribute("aColor", new THREE.BufferAttribute(brain.colors, 3));
    geom.setAttribute("aSize", new THREE.BufferAttribute(brain.sizes, 1));
    geom.setAttribute("aGlow", new THREE.BufferAttribute(brain.glow, 1));
    geom.setAttribute("aPhase", new THREE.BufferAttribute(brain.phase, 1));
    geom.setAttribute("aVital", new THREE.BufferAttribute(vitalAttr, 1));

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
        uBeatPhase: { value: 0 },
        uField: { value: 0 },
      },
      vertexShader: POINT_VERT,
      fragmentShader: POINT_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geom, pointMat);
    points.rotation.y = BRAIN_YAW; // the reduced-motion static frame uses this pose too
    scene.add(points);

    // ── Neural connections — child of `points`, so it inherits the same
    // rotation/tremor; uniforms shared by reference with pointMat.
    const links = buildConnections(brain, isMobile ? 700 : 1600, vital);
    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute("position", new THREE.BufferAttribute(links.positions, 3));
    lineGeom.setAttribute("aEnd", new THREE.BufferAttribute(links.ends, 1));
    lineGeom.setAttribute("aEdgePhase", new THREE.BufferAttribute(links.phases, 1));
    lineGeom.setAttribute("aVital", new THREE.BufferAttribute(links.vital, 1));
    lineGeom.setAttribute("aVitalTravel", new THREE.BufferAttribute(links.travel, 1));
    const lineMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: pointMat.uniforms.uTime!,
        uFly: pointMat.uniforms.uFly!,
        uDisplace: pointMat.uniforms.uDisplace!,
        uHemisphereSplit: pointMat.uniforms.uHemisphereSplit!,
        uBeatPhase: pointMat.uniforms.uBeatPhase!,
        uLineFade: { value: 1 },
        uActivity: { value: 0 },
      },
      vertexShader: LINE_VERT,
      fragmentShader: LINE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    points.add(new THREE.LineSegments(lineGeom, lineMat));

    // ── Vital overlay (see VITAL_FRAG) — a tiny geometry holding just the
    // vital points, with the same attributes the additive pass reads, drawn
    // last with the same uniforms so it tracks every act exactly.
    const pickVital = (src: Float32Array, stride: number) => {
      const out = new Float32Array(vital.nodes.length * stride);
      vital.nodes.forEach((index, n) => out.set(src.subarray(index * stride, (index + 1) * stride), n * stride));
      return out;
    };
    const vitalGeom = new THREE.BufferGeometry();
    vitalGeom.setAttribute("position", new THREE.BufferAttribute(pickVital(brain.positions, 3), 3));
    vitalGeom.setAttribute("aColor", new THREE.BufferAttribute(pickVital(brain.colors, 3), 3));
    vitalGeom.setAttribute("aSize", new THREE.BufferAttribute(pickVital(brain.sizes, 1), 1));
    vitalGeom.setAttribute("aGlow", new THREE.BufferAttribute(pickVital(brain.glow, 1), 1));
    vitalGeom.setAttribute("aPhase", new THREE.BufferAttribute(pickVital(brain.phase, 1), 1));
    vitalGeom.setAttribute("aVital", new THREE.BufferAttribute(pickVital(vitalAttr, 1), 1));
    const vitalMat = new THREE.ShaderMaterial({
      uniforms: pointMat.uniforms,
      vertexShader: POINT_VERT,
      fragmentShader: VITAL_FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
    });
    const vitalPoints = new THREE.Points(vitalGeom, vitalMat);
    vitalPoints.renderOrder = 1; // after the additive cloud and its edges
    vitalPoints.frustumCulled = false; // shader-displaced; 5 points cost nothing
    points.add(vitalPoints);


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
      orbitStart = startRadius(isMobile, w, h);
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
      camera.position.set(orbitStart, 0, 0);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      window.addEventListener("resize", resize);
      return () => {
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", resize);
        geom.dispose();
        pointMat.dispose();
        lineGeom.dispose();
        lineMat.dispose();
        vitalGeom.dispose();
        vitalMat.dispose();
        renderTarget?.dispose();
        postMat.dispose();
        releaseRenderer();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      };
    }

    // THREE.Clock is deprecated in r185; Timer gives the same wall-clock
    // elapsed time (a paused loop catches up on its first update).
    const timer = new THREE.Timer();
    let raf = 0;
    let running = true;
    stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Where the Hero's own scroll ends, in page pixels — cached, re-measured
    // when the Hero resizes, so a frame only reads window.scrollY (no layout).
    let heroEnd = Number.POSITIVE_INFINITY;
    const measureHero = () => {
      const hero = heroRef?.current;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      heroEnd = rect.top + window.scrollY + rect.height - window.innerHeight;
    };
    measureHero();
    const heroResize = heroRef?.current ? new ResizeObserver(measureHero) : null;
    if (heroRef?.current) heroResize?.observe(heroRef.current);
    // Viewport heights scrolled past the Hero, smoothed like the narrative.
    let travel = 0;

    const drawFrame = () => {
      timer.update();
      const t = timer.getElapsed();
      const progress = progressRef?.current ?? 0;

      // ── ATO I (0–0.22): revelação — quase parado, cérebro a assentar ──
      // ── ATO II (0.22–0.55): dissecação — bloom sobe no núcleo ──
      const act2 = smoothstep(ACT2_START, ACT3_START, progress);
      // ── ATO III (0.55–0.85): fly-through — explosão + aberração + displacement ──
      const act3 = smoothstep(ACT3_START, ACT4_START, progress);
      // ── ATO IV (0.85–1.0): emergência de dados — dissolve em pontos ──
      const act4 = smoothstep(ACT4_START, 1.0, progress);

      // Past the Hero the camera keeps "navigating" through the field.
      const travelTarget = continuous ? Math.max(0, (window.scrollY - heroEnd) / window.innerHeight) : 0;
      travel = lerp(travel, Number.isFinite(travelTarget) ? travelTarget : 0, 0.08);
      const field = continuous ? act4 : 0; // 0 → 1 as the brain becomes the star field

      // The field slowly expands as you go, so the points stream past the camera.
      const fly = act3 + Math.min(travel * 0.045, 0.6);
      const hemisphereOpen = smoothstep(0, HEMISPHERE_OPEN_END, progress);
      pointMat.uniforms.uTime!.value = t;
      pointMat.uniforms.uFly!.value = fly;
      pointMat.uniforms.uBloom!.value = act2 * (1 - act4);
      pointMat.uniforms.uDissolve!.value = continuous ? act4 * STAR_DISSOLVE : act4;
      lineMat.uniforms.uActivity!.value = field;
      pointMat.uniforms.uField!.value = field;
      pointMat.uniforms.uDisplace!.value = isMobile ? 0 : act3 * 0.04;
      pointMat.uniforms.uHemisphereSplit!.value = hemisphereOpen * HEMISPHERE_SPLIT_MAX;
      pointMat.uniforms.uCursorNDC!.value.set(parallax.xRef.current, -parallax.yRef.current);
      pointMat.uniforms.uCursorActive!.value = 1;
      // Page clock, not the three.js clock: the Hero's ECG card reads the
      // same phase, so the red points flash as its R spike crosses centre.
      pointMat.uniforms.uBeatPhase!.value = heartbeatPhase(performance.now());
      // Edges fade out as the cloud explodes (Ato III) and dissolves (Ato IV).
      const lineFade = (1 - act3 * 0.85) * (1 - act4);
      lineMat.uniforms.uLineFade!.value = continuous ? Math.max(lineFade, STAR_LINE_FLOOR * act3) : lineFade;

      // Micro-tremor idle (±0.4px equivalent, ~0.6Hz) on the core when the
      // narrative is resting (Ato I) and the pointer parallax is near zero —
      // reads as "alive" rather than a static render.
      const idleTremor = (1 - smoothstep(0.02, ACT2_START, progress)) * 0.0025;
      const tremorX = Math.sin(t * 0.6 * Math.PI * 2) * idleTremor;
      const tremorY = Math.cos(t * 0.51 * Math.PI * 2) * idleTremor;

      // No idle spin (dropped at Duarte's request): the brain holds its
      // BRAIN_YAW pose so the red vital spot on the frontal lobe always
      // faces the viewer — a spinning brain would carry it round to the back.
      // Only the pointer parallax tilts it, ±0.25 rad at most, which keeps
      // the spot on the visible face.
      // In the star field the cloud also turns with the scroll and drifts on
      // its own, so the points are always moving around you.
      points.rotation.y = BRAIN_YAW + parallax.xRef.current * 0.25 + field * (travel * 0.32 + t * 0.012);
      points.rotation.x = parallax.yRef.current * 0.15 + field * Math.sin(travel * 0.45 + t * 0.05) * 0.12;
      points.position.set(tremorX, tremorY, 0);
      points.updateMatrixWorld();

      // ── Camera: holds the fixed lateral/profile angle (ORBIT_PHASE) for the
      // entire scroll journey — no rotation, no orbit (and the brain itself
      // no longer spins, see above); scroll drives only
      // a straight dolly-in from orbitStart toward CAMERA_MIN_RADIUS, read
      // as a clean, direct expansion/zoom with no swirl or pirouette.
      const zoomIn = smoothstep(0.0, 0.9, progress);
      const orbitRadius = lerp(orbitStart, CAMERA_MIN_RADIUS, zoomIn);
      camera.position.x = Math.sin(ORBIT_PHASE) * orbitRadius;
      camera.position.z = Math.cos(ORBIT_PHASE) * orbitRadius;
      camera.position.y = 0;
      camera.lookAt(0, 0, 0);

      // Only during the dive itself: left on in the star field, the extra
      // render-target pass would double the GPU work on the whole page.
      const aberration = isMobile ? 0 : act3 * (1 - act4) * 0.0015;

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
    };

    // A frame that throws would throw again on every tick; stop the loop,
    // keep the last good frame on screen and never restart it.
    let broken = false;
    const render = () => {
      try {
        drawFrame();
      } catch (error) {
        broken = true;
        stopLoop();
        console.warn("[BrainHero] render loop stopped.", error);
        return;
      }
      if (running) raf = requestAnimationFrame(render);
    };

    // Compile every shader before the first frame, without blocking: with
    // KHR_parallel_shader_compile the driver links them off the main thread
    // (linking inside the first frame blocked input for ~0.6 s at load). The
    // gradient backdrop shows meanwhile. Polled here rather than with
    // renderer.compileAsync: its timer throws once the materials are disposed
    // (an unmount before the shaders finish — React StrictMode's double mount
    // in development, or leaving the page in the first half second).
    let ready = false;
    let disposed = false;
    let compileTimer = 0;
    const compiling = new Set<THREE.Material>(renderer.compile(scene, camera));
    if (renderTarget) renderer.compile(postScene, postCamera).forEach((material) => compiling.add(material));
    const waitForShaders = () => {
      if (disposed) return;
      for (const material of compiling) {
        const { currentProgram: program } = renderer.properties.get(material) as { currentProgram?: { isReady(): boolean } };
        if (!program || program.isReady()) compiling.delete(material);
      }
      if (compiling.size > 0) {
        compileTimer = window.setTimeout(waitForShaders, 10);
        return;
      }
      ready = true;
      if (running && !broken) raf = requestAnimationFrame(render);
    };
    waitForShaders();

    // Pause the RAF loop entirely once the visual scrolls out of view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = !!entry?.isIntersecting;
        // The observer also fires once on observe() — while the loop is
        // already running — which used to start a second, parallel loop.
        if (broken || visible === running) return;
        running = visible;
        if (running) {
          // Before the shaders are ready the compile promise starts the loop.
          if (ready) raf = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    // A fixed backdrop always "intersects": watch the page area it belongs to.
    observer.observe((mount.closest("[data-starfield-scope]") as HTMLElement | null) ?? mount);

    window.addEventListener("resize", resize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(compileTimer);
      window.clearTimeout(resizeTimer);
      observer.disconnect();
      heroResize?.disconnect();
      window.removeEventListener("resize", resize);
      geom.dispose();
      pointMat.dispose();
      lineGeom.dispose();
      lineMat.dispose();
      vitalGeom.dispose();
      vitalMat.dispose();
      renderTarget?.dispose();
      postMat.dispose();
      timer.dispose();
      releaseRenderer();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [reduced, progressRef, heroRef, continuous, parallax.xRef, parallax.yRef, glEpoch]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
