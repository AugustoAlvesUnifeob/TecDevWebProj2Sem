import { getUser } from './services/api.js'
import { initAuth, showMessage } from './pages/auth.js'
import { initPlaces, loadPlaces } from './pages/places.js'
import { loadPending } from './pages/admin.js'

function updateAccount() {
  const user = getUser()
  const account = document.querySelector('#account')
  account.replaceChildren()

  if (user) {
    const name = document.createElement('span')
    name.textContent = `Olá, ${user.name}`
    const logout = document.createElement('button')
    logout.id = 'logout'
    logout.className = 'plain'
    logout.textContent = 'Sair'
    account.append(name, logout)
  } else {
    account.innerHTML = '<button id="login" class="plain" type="button">Entrar</button><button id="register" class="button" type="button">Criar conta</button>'
  }

  document.querySelector('#business').hidden = user?.tipo !== 3
  document.querySelector('#moderation').hidden = user?.tipo !== 1
  if (user?.tipo === 1) loadPending()
}

initAuth(() => {
  updateAccount()
  loadPlaces()
  showMessage('Sessão atualizada.')
})
initPlaces()
updateAccount()
loadPlaces()
