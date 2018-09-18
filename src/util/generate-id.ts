const idSource: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateId(idLength: number): string {
  const length = idSource.length;
  return idSource.charAt(Math.floor(Math.random() * (length - 10))) + // Ensure first character is alphabetic.
    Array(idLength - 1).fill(0).map(_ => idSource.charAt(Math.floor(Math.random() * length))).join('');
}
