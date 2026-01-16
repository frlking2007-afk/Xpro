// Declare modules for JS/JSX files without type definitions
declare module '*.jsx' {
  const content: unknown;
  export default content;
}

declare module '*.js' {
  const content: unknown;
  export default content;
}

// Specifically declare the Hyperspeed component if it's still being resolved as .jsx
declare module '../components/Hyperspeed' {
  const Hyperspeed: unknown;
  export default Hyperspeed;
}

declare module '@/components/Hyperspeed' {
  const Hyperspeed: unknown;
  export default Hyperspeed;
}

declare module '../components/HyperSpeedPresets' {
  export const hyperspeedPresets: unknown;
}

declare module '@/components/HyperSpeedPresets' {
  export const hyperspeedPresets: unknown;
}