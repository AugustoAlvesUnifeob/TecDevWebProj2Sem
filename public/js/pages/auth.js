import { api, setToken } from '../services/api.js'

const auth = document.querySelector('#auth')
const loginForm = document.querySelector('#login-form')
const registerForm = document.querySelector('#register-form')

function showMode(mode) {
  const registering = mode === 'register'
  document.querySelector('#auth-title').textContent = registering ? 'Criar conta' : 'Entrar'
  loginForm.hidden = registering
  registerForm.hidden = !registering
  auth.hidden = false
}

export function initAuth(onChange) {
  document.querySelector('#close-auth').addEventListener('click', () => { auth.hidden = true })
  document.querySelectorAll('[data-mode]').forEach(button => {
    button.addEventListener('click', () => showMode(button.dataset.mode))
  })

  loginForm.addEventListener('submit', async event => {
    event.preventDefault()
    try {
      const form = Object.fromEntries(new FormData(loginForm))
      const data = await api('/users/login', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      if (!data.token) throw new Error('A API não retornou o token.')
      setToken(data.token)
      loginForm.reset()
      auth.hidden = true
      onChange()
    } catch (error) {
      showMessage(error.message, true)
    }
  })

  registerForm.addEventListener('submit', async event => {
    event.preventDefault()
    try {
      const form = Object.fromEntries(new FormData(registerForm))
      form.tipo = Number(form.tipo)
      await api('/users/register', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      registerForm.reset()
      showMode('login')
      showMessage('Conta criada. Agora entre com seu e-mail e senha.')
    } catch (error) {
      showMessage(error.message, true)
    }
  })

  document.querySelector('#account').addEventListener('click', event => {
    if (event.target.id === 'login') showMode('login')
    if (event.target.id === 'register') showMode('register')
    if (event.target.id === 'logout') {
      setToken(null)
      auth.hidden = true
      onChange()
    }
  })
}

export function showMessage(message, isError = false) {
  const element = document.querySelector('#message')
  element.textContent = message
  element.classList.toggle('error', isError)
  element.hidden = false
}

export function showLogin() {
  showMode('login')
}
