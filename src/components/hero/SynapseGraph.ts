import * as THREE from "three";

// ── CAMADA 4 · GRAFO SINÁPTICO INTELIGENTE ────────────────────────────
// Extracted from BrainHero so the graph-building/update logic can be
// reasoned about (and reused) independently of the point-cloud renderer.

const C_BLUE = new THREE.Color("#1E5BFF");
const C_TEAL = new THREE.Color("#12C7C0");

const LINE_VERT = `
  uniform float uFly;
  attribute vec3 aColor;
  varying vec3 vColor;
  vec3 disperse(vec3 p, float f) {
    float len = length(p.xy);
    vec2 dir = len > 0.0001 ? p.xy / len : vec2(0.0);
    p.xy += dir * f * (1.7 + 0.6 * (p.z + 1.5));
    p.z += f * 3.4;
    return p;
  }
  void main() {
    vec3 p = disperse(position, uFly);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    vColor = aColor;
  }
`;

const LINE_FRAG = `
  precision mediump float;
  uniform float uOpacity;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, uOpacity);
  }
`;

const PULSE_VERT = `
  uniform float uPixelRatio;
  attribute float aBoost;
  varying float vBoost;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(4.0 * uPixelRatio * (4.6 / -mv.z), 1.0, 10.0);
    gl_Position = projectionMatrix * mv;
    vBoost = aBoost;
  }
`;

const PULSE_FRAG = `
  precision mediump float;
  varying float vBoost;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = (1.0 - smoothstep(0.2, 0.5, d)) * (0.85 + vBoost * 0.15);
    gl_FragColor = vec4(0.85, 0.92, 1.0, alpha);
  }
`;

export interface SynapseGraphOptions {
  /** Full particle position buffer (x,y,z per particle) from the point cloud. */
  positions: Float32Array;
  /** Indices, into `positions`, of the "hub" particles eligible to become graph nodes. */
  glowIndices: number[];
  /** Hard cap on how many hub candidates become graph nodes. */
  maxNodes?: number;
  /** Nearest-neighbor connections per node. */
  kNeighbors?: number;
  /** Minimum world-space distance enforced between selected nodes (blue-noise/Poisson-disk-style spread, so nodes don't clump). */
  minNodeSeparation?: number;
  /** Concurrent traveling-pulse count. */
  pulseCount?: number;
  pixelRatio: number;
}

export interface SynapseGraph {
  lines: THREE.LineSegments;
  lineMat: THREE.ShaderMaterial;
  pulses: THREE.Points | null;
  pulseMat: THREE.ShaderMaterial | null;
  /** World positions of the selected graph nodes (3 floats each) — for cursor hit-testing. */
  nodePositions: Float32Array;
  /** Forces up to 3 pulses to restart immediately from the given node index (into `nodePositions`). */
  triggerSpikeFrom(nodeIndex: number): void;
  /** Advances traveling pulses; call once per animation frame. */
  update(dtSeconds: number): void;
  dispose(): void;
}

/** Blue-noise-ish rejection sampling: greedily keeps candidates that are at least `minSeparation` from every already-accepted node, backfilling from the remainder if the constraint leaves the set under-full. */
function selectSpreadNodes(
  candidates: readonly number[],
  positions: Float32Array,
  maxNodes: number,
  minSeparation: number,
): number[] {
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  const selected: number[] = [];
  const minSq = minSeparation * minSeparation;

  for (const idx of shuffled) {
    if (selected.length >= maxNodes) break;
    const x = positions[idx * 3]!;
    const y = positions[idx * 3 + 1]!;
    const z = positions[idx * 3 + 2]!;
    let ok = true;
    for (const sIdx of selected) {
      const dx = positions[sIdx * 3]! - x;
      const dy = positions[sIdx * 3 + 1]! - y;
      const dz = positions[sIdx * 3 + 2]! - z;
      if (dx * dx + dy * dy + dz * dz < minSq) {
        ok = false;
        break;
      }
    }
    if (ok) selected.push(idx);
  }

  if (selected.length < maxNodes) {
    const selectedSet = new Set(selected);
    for (const idx of shuffled) {
      if (selected.length >= maxNodes) break;
      if (!selectedSet.has(idx)) selected.push(idx);
    }
  }

  return selected;
}

export function createSynapseGraph(opts: SynapseGraphOptions): SynapseGraph {
  const {
    positions,
    glowIndices,
    maxNodes = 90,
    kNeighbors = 3,
    minNodeSeparation = 0.14,
    pulseCount = 240,
    pixelRatio,
  } = opts;

  const nodeSource = selectSpreadNodes(glowIndices, positions, maxNodes, minNodeSeparation);
  const nodeCount = nodeSource.length;
  const nodePositions = new Float32Array(nodeCount * 3);
  for (let i = 0; i < nodeCount; i++) {
    const src = nodeSource[i]!;
    nodePositions[i * 3] = positions[src * 3]!;
    nodePositions[i * 3 + 1] = positions[src * 3 + 1]!;
    nodePositions[i * 3 + 2] = positions[src * 3 + 2]!;
  }

  // ── kNN edges ─────────────────────────────────────────────────────────
  const linePos: number[] = [];
  const lineCol: number[] = [];
  const edgeStarts: number[] = [];
  const edgeEnds: number[] = [];
  /** For each node, the indices (into edgeStarts/edgeEnds) of edges leaving it — used by triggerSpikeFrom. */
  const nodeEdgeIndex: number[][] = Array.from({ length: nodeCount }, () => []);

  for (let a = 0; a < nodeCount; a++) {
    const ax = nodePositions[a * 3]!;
    const ay = nodePositions[a * 3 + 1]!;
    const az = nodePositions[a * 3 + 2]!;
    const ranked: { idx: number; d: number }[] = [];
    for (let b = 0; b < nodeCount; b++) {
      if (b === a) continue;
      const dx = nodePositions[b * 3]! - ax;
      const dy = nodePositions[b * 3 + 1]! - ay;
      const dz = nodePositions[b * 3 + 2]! - az;
      ranked.push({ idx: b, d: dx * dx + dy * dy + dz * dz });
    }
    ranked.sort((n1, n2) => n1.d - n2.d);
    for (let k = 0; k < kNeighbors && k < ranked.length; k++) {
      const b = ranked[k]!.idx;
      if (a % 2 === 0 && k === kNeighbors - 1) continue; // thin the densest tier a little
      const bx = nodePositions[b * 3]!;
      const by = nodePositions[b * 3 + 1]!;
      const bz = nodePositions[b * 3 + 2]!;
      const edgeIdx = edgeStarts.length / 3;
      linePos.push(ax, ay, az, bx, by, bz);
      lineCol.push(C_BLUE.r, C_BLUE.g, C_BLUE.b, C_TEAL.r, C_TEAL.g, C_TEAL.b);
      edgeStarts.push(ax, ay, az);
      edgeEnds.push(bx, by, bz);
      nodeEdgeIndex[a]!.push(edgeIdx);
    }
  }

  const lineGeom = new THREE.BufferGeometry();
  lineGeom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePos), 3));
  lineGeom.setAttribute("aColor", new THREE.BufferAttribute(new Float32Array(lineCol), 3));
  const lineMat = new THREE.ShaderMaterial({
    uniforms: { uFly: { value: 0 }, uOpacity: { value: 0.16 } },
    vertexShader: LINE_VERT,
    fragmentShader: LINE_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
  const lines = new THREE.LineSegments(lineGeom, lineMat);

  // ── Traveling pulses ───────────────────────────────────────────────────
  const edgeCount = edgeStarts.length / 3;
  const count = Math.min(pulseCount, Math.max(edgeCount, 1));
  const pulsePositions = new Float32Array(count * 3);
  const pulseBoost = new Float32Array(count);
  const pulseEdge = new Int32Array(count);
  const pulseT = new Float32Array(count);
  const pulseSpeed = new Float32Array(count);

  const resetPulse = (i: number, edge: number, startAt = Math.random()) => {
    pulseEdge[i] = edge;
    pulseT[i] = startAt;
    pulseSpeed[i] = 0.4 + Math.random() * 0.5;
  };
  for (let i = 0; i < count; i++) resetPulse(i, Math.floor(Math.random() * edgeCount));

  const pulseGeom = new THREE.BufferGeometry();
  pulseGeom.setAttribute("position", new THREE.BufferAttribute(pulsePositions, 3));
  pulseGeom.setAttribute("aBoost", new THREE.BufferAttribute(pulseBoost, 1));
  const pulseMat = new THREE.ShaderMaterial({
    uniforms: { uPixelRatio: { value: pixelRatio } },
    vertexShader: PULSE_VERT,
    fragmentShader: PULSE_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const pulses = edgeCount > 0 ? new THREE.Points(pulseGeom, pulseMat) : null;

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  let nextSpikeTimer = 0.5;

  return {
    lines,
    lineMat,
    pulses,
    pulseMat: pulses ? pulseMat : null,
    nodePositions,
    triggerSpikeFrom(nodeIndex: number) {
      const edges = nodeEdgeIndex[nodeIndex];
      if (!edges || edges.length === 0 || count === 0) return;
      for (let k = 0; k < Math.min(3, edges.length); k++) {
        const slot = (nodeIndex * 3 + k) % count; // deterministic-ish slot picking, cheap
        resetPulse(slot, edges[k]!, 0);
        pulseBoost[slot] = 1;
      }
    },
    update(dtSeconds: number) {
      if (!pulses) return;

      // Ambient spikes: roughly every ~500ms, kick a random edge to life —
      // matches the "a cada 500ms um spike" spec even when the cursor is idle.
      nextSpikeTimer -= dtSeconds;
      if (nextSpikeTimer <= 0 && edgeCount > 0) {
        nextSpikeTimer = 0.5;
        const slot = Math.floor(Math.random() * count);
        resetPulse(slot, Math.floor(Math.random() * edgeCount), 0);
      }

      for (let i = 0; i < count; i++) {
        pulseT[i] = (pulseT[i]! + pulseSpeed[i]! * dtSeconds) % 1;
        const e = pulseEdge[i]!;
        const st = pulseT[i]!;
        pulsePositions[i * 3] = lerp(edgeStarts[e * 3]!, edgeEnds[e * 3]!, st);
        pulsePositions[i * 3 + 1] = lerp(edgeStarts[e * 3 + 1]!, edgeEnds[e * 3 + 1]!, st);
        pulsePositions[i * 3 + 2] = lerp(edgeStarts[e * 3 + 2]!, edgeEnds[e * 3 + 2]!, st);
        pulseBoost[i] = pulseBoost[i]! * 0.9;
      }
      pulseGeom.attributes.position!.needsUpdate = true;
      pulseGeom.attributes.aBoost!.needsUpdate = true;
    },
    dispose() {
      lineGeom.dispose();
      lineMat.dispose();
      pulseGeom.dispose();
      pulseMat.dispose();
    },
  };
}
