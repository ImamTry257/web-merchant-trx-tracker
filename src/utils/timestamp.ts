export function generateTimestamp(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
}
