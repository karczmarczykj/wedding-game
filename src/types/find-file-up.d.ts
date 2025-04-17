declare module 'find-file-up' {
  function findFileUp(filename: string, cwd?: string): Promise<string | null>;

  export default findFileUp;
}
