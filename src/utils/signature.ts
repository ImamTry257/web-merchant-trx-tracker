export async function generateSignature(
  method: string,
  path: string,
  timestamp: string,
  secretKey: string,
  bodyHash?: string
): Promise<string> {
  const hashBody = bodyHash ?? ''
  const stringToSign = `${method}:${path}:${timestamp}:${hashBody}`

  const encoder = new TextEncoder()
  const keyData = encoder.encode(secretKey)
  const messageData = encoder.encode(stringToSign)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)

  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

export async function sha256Hex(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data))
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
