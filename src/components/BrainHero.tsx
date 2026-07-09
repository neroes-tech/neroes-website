"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

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

const DISPERSE_GLSL = `
  vec3 disperse(vec3 p, float f) {
    float len = length(p.xy);
    vec2 dir = len > 0.0001 ? p.xy / len : vec2(0.0);
    p.xy += dir * f * (1.7 + 0.6 * (p.z + 1.5));
    p.z += f * 3.4;
    return p;
  }
`;

const POINT_VERT = `
  uniform float uTime;
  uniform float uFly;
  uniform float uPixelRatio;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aGlow;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vGlow;
  ${DISPERSE_GLSL}
  void main() {
    vec3 p = disperse(position, uFly);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float pulse = 0.5 + 0.5 * sin(uTime * 2.2 + aPhase);
    float size = aSize * (1.0 + aGlow * pulse * 1.4);
    gl_PointSize = clamp(size * uPixelRatio * (4.6 / -mv.z), 0.6, 15.0);
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
    vGlow = aGlow * pulse;
  }
`;

const POINT_FRAG = `
  precision mediump float;
  varying vec3 vColor;
  varying float vGlow;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.40, 0.5, d);
    vec3 col = mix(vColor, vec3(0.55, 0.25, 0.95), vGlow * 0.6);
    gl_FragColor = vec4(col, alpha * (0.9 + vGlow * 0.1));
  }
`;

const LINE_VERT = `
  uniform float uFly;
  attribute vec3 aColor;
  varying vec3 vColor;
  ${DISPERSE_GLSL}
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

export default function BrainHero() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 4.3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    mount.appendChild(renderer.domElement);

    const COUNT = 9000;
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
      },
      vertexShader: POINT_VERT,
      fragmentShader: POINT_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const points = new THREE.Points(geom, pointMat);
    scene.add(points);

    const gi = brain.glowIndices;
    const maxNodes = Math.min(gi.length, 520);
    const linePos: number[] = [];
    const lineCol: number[] = [];
    const pos = brain.positions;
    for (let a = 0; a < maxNodes; a++) {
      const ia = gi[a]!;
      const ax = pos[ia * 3]!;
      const ay = pos[ia * 3 + 1]!;
      const az = pos[ia * 3 + 2]!;
      let b1 = -1;
      let b2 = -1;
      let d1 = Infinity;
      let d2 = Infinity;
      for (let b = 0; b < maxNodes; b++) {
        if (b === a) continue;
        const ib = gi[b]!;
        const dx = pos[ib * 3]! - ax;
        const dy = pos[ib * 3 + 1]! - ay;
        const dz = pos[ib * 3 + 2]! - az;
        const dd = dx * dx + dy * dy + dz * dz;
        if (dd < d1) {
          d2 = d1;
          b2 = b1;
          d1 = dd;
          b1 = ib;
        } else if (dd < d2) {
          d2 = dd;
          b2 = ib;
        }
      }
      const neigh = [b1, b2];
      for (const ib of neigh) {
        if (ib < 0) continue;
        if (a % 2 === 0 && ib === b2) continue;
        linePos.push(ax, ay, az, pos[ib * 3]!, pos[ib * 3 + 1]!, pos[ib * 3 + 2]!);
        lineCol.push(C_BLUE.r, C_BLUE.g, C_BLUE.b, C_TEAL.r, C_TEAL.g, C_TEAL.b);
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
    scene.add(lines);

    let targetFly = 0;
    let fly = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;
    let scrollFly = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      targetFly = Math.min(1, Math.max(0, ny * 1.05 - 0.02) + scrollFly);
      targetFly = Math.min(1, targetFly);
      targetRotY = (nx - 0.5) * 0.6;
      targetRotX = (ny - 0.5) * 0.3;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollFly = Math.min(0.6, Math.max(0, scrollFly + e.deltaY * 0.0006));
    };

    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("wheel", onWheel, { passive: false });

    const clock = new THREE.Clock();
    let raf = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const render = () => {
      const t = clock.getElapsedTime();

      fly = lerp(fly, targetFly, 0.06);
      rotX = lerp(rotX, targetRotX, 0.05);
      rotY = lerp(rotY, targetRotY, 0.05);

      pointMat.uniforms.uTime!.value = t;
      pointMat.uniforms.uFly!.value = fly;
      lineMat.uniforms.uFly!.value = fly;
      lineMat.uniforms.uOpacity!.value = 0.16 * (1 - fly * 0.7);

      points.rotation.y = rotY + t * 0.05;
      points.rotation.x = rotX;
      lines.rotation.copy(points.rotation);

      camera.position.z = lerp(4.3, -1.4, fly);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("wheel", onWheel);
      geom.dispose();
      pointMat.dispose();
      lineGeom.dispose();
      lineMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 h-full w-full" />;
}
