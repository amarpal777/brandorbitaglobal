'use client';

// Full motion is the site default; legacy browser preferences are not consulted.
export const motionPreference = { matches: false };
export function useMotionPreference() { return false; }
