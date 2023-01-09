export const onListen = (port: number, httpOnly: boolean = true) => {
  console.log(`[Server listening]: ${ httpOnly ? 'http' : 'https' }://localhost:${port}`);
}
