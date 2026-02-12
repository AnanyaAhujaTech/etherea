// src/config/timeConfig.js

// --- 1. CONFIGURATION (Absolute Dates) ---
export const PREFEST_START = new Date("2026-02-12T15:00:00");
export const FEST_START = new Date("2026-02-25T10:00:00");

// --- 2. ANIMATION SETTINGS (Modify these to alter speed) ---
export const TICK_SETTINGS = {
  DURATION: 0.1,       // Speed of the tick (Lower = Faster/Snappier)
  ELASTICITY: 1.0,     // Bounciness (Higher = More overshoot/wobble)
  DEGREES_PER_TICK: 6, // 6 degrees per second is standard for a clock
};

// --- 3. ANGLE MAPPING ---
const RING_SEGMENTS = {
  "The Moment You've Waited For...": 0,
  "A Distant Moment": 45,
  "Beyond The Horizon": 90,
  "Taking Shape": 135,
  "Prefest: The Journey Begins...": 180,
  "On The Way": 225,
  "Almost There": 270,
  "At The Threshold": 315,
};

// --- 4. HELPER FUNCTIONS ---

export function getClockRotation(startSegmentText, endSegmentText) {
  const now = new Date();
  const startAngle = RING_SEGMENTS[startSegmentText] ?? 180; 
  let endAngle = RING_SEGMENTS[endSegmentText] ?? 0;

  if (endAngle < startAngle) endAngle += 360;

  const tStart = PREFEST_START.getTime();
  const tEnd = FEST_START.getTime();
  const tNow = now.getTime();
  
  const totalDuration = tEnd - tStart;
  const elapsed = tNow - tStart;

  let progress = elapsed / totalDuration;
  progress = Math.min(Math.max(progress, 0), 1);

  const totalRotationSpan = endAngle - startAngle;
  return startAngle + (progress * totalRotationSpan);
}

/**
 * Returns the current 'Second' (0-59).
 * We use this to detect *when* to tick, but not *where* to rotate.
 * The component will handle the continuous rotation.
 */
export function getCurrentSecond() {
  return new Date().getSeconds();
}

/**
 * Calculates the initial rotation based on current time (0-360)
 * so the clock renders in the correct position immediately.
 */
export function getInitialRotation() {
  return new Date().getSeconds() * TICK_SETTINGS.DEGREES_PER_TICK;
}