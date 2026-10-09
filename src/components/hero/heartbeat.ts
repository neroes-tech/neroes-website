/**
 * Shared heartbeat clock for the Hero: the red ECG trace in the HUD card and
 * the red "vital sign" points on the 3D brain's frontal lobe both read their
 * beat phase from the page clock (performance.now()), so they stay in exact
 * lockstep no matter when each one mounted.
 */
export const HEARTBEAT_PERIOD_S = 1; // 60 BPM
// The logo gold (Pedro, 9 Oct 2026: "o vermelho do cérebro igual ao amarelo da logo").
export const HEART_RED = "#DB9B1D";
/** HEART_RED as raw sRGB 0..1 floats — for WebGL, where three.js' hex→linear conversion would darken it. */
export const HEART_RED_RGB = [0xdb / 255, 0x9b / 255, 0x1d / 255] as const;

/** Blink decay, as a fraction of the beat: instant flash at phase 0, ~120ms exponential fade (vital-sign LED feel). */
export const HEARTBEAT_BLINK_DECAY = 0.12;

/** Beat phase 0..1 on the shared page clock. */
export function heartbeatPhase(nowMs: number): number {
  const periodMs = HEARTBEAT_PERIOD_S * 1000;
  return (nowMs % periodMs) / periodMs;
}

/** Blink envelope 0..1 for a given beat phase (1 at the beat, decaying). */
export function heartbeatBlink(phase: number): number {
  return Math.exp(-phase / HEARTBEAT_BLINK_DECAY);
}

/** Width in px of one heartbeat on the ECG trace (the loop shifts exactly this far per period). */
export const ECG_PERIOD_PX = 224;
export const ECG_HEIGHT_PX = 32;
/** x of the R spike inside each beat of ECG_PATH. */
export const ECG_R_PEAK_X = 106;
/** Visible width of the trace inside the HUD card (w-56 = 224px minus p-3 padding on both sides). */
export const ECG_WINDOW_PX = 200;
/** SVG x offset that puts the R spike on the window's centre line at beat phase 0 — the instant the brain's red points flash. */
export const ECG_SYNC_OFFSET_PX = ECG_WINDOW_PX / 2 - ECG_R_PEAK_X;

/** One PQRST complex starting at x0, baseline y=16 — P bump, Q dip, tall R spike, S dip, T bump. */
function beat(x0: number) {
  const b = 16;
  const at = (x: number, y: number) => `${x0 + x} ${y}`;
  return [
    `L${at(64, b)}`,
    `Q${at(74, b - 6)} ${at(84, b)}`, // P wave
    `L${at(96, b)}`,
    `L${at(ECG_R_PEAK_X - 6, b + 4)}`, // Q
    `L${at(ECG_R_PEAK_X, 2)}`, // R
    `L${at(ECG_R_PEAK_X + 6, b + 12)}`, // S
    `L${at(118, b)}`,
    `L${at(136, b)}`,
    `Q${at(152, b - 8)} ${at(168, b)}`, // T wave
    `L${at(ECG_PERIOD_PX, b)}`,
  ].join(" ");
}

/** Two identical beats back to back, so translating by ECG_PERIOD_PX loops seamlessly. */
export const ECG_PATH = `M0 16 ${beat(0)} ${beat(ECG_PERIOD_PX)}`;
