/**
 * vite-env — ambient module declarations so TypeScript accepts CSS imports.
 */
declare module "*.css" {
  const content: string;
  export default content;
}
