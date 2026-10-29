const TOKEN_KEY = 'bons-lugares-token'
let token = localStorage.getItem(TOKEN_KEY)

export function getUser() {
  if (!token) return null
  try {
    const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0))
    const user = JSON.parse(new TextDecoder().decode(bytes))
    if (user.exp && user.exp * 1000 <= Date.now()) throw new Error('Sessão expirada')
    return user
  } catch {
    setToken(null)
    return null
  }
}

export function setToken(value) {
  token = value
  if (value) localStorage.setItem(TOKEN_KEY, value)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function api(url, options = {}) {
  const headers = { ...options.headers }
  if (options.body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(url, { ...options, headers })
  const data = await response.json()
  if (!response.ok) {
    const validationErrors = data.errors?.map(error => error.msg).join(', ')
    throw new Error(validationErrors || data.message || 'Erro na solicitação.')
  }
  return data
}
