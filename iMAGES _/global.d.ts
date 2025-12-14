declare module '*.css' {
  // This tells TypeScript that importing a .css file results in an undefined or
  // void side effect, which is what we expect for a global style import.
  // It effectively silences the "module not found" error for CSS files.
  // The value doesn't matter since we don't use it, but 'any' is common.
  const content: any;
  export default content;
}