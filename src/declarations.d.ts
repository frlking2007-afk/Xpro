// Declare modules for JS/JSX files without type definitions
declare module '*.jsx' {
  const content: any;
  export default content;
}

declare module '*.js' {
  const content: any;
  export default content;
}
