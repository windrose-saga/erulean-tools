export const assertUnreachable = (x: never): never => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`Unexpected object: ${x}`);
};
