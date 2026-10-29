import { api } from '../services/api.js'
import { showMessage } from './auth.js'
import { loadPlaces } from './places.js'

export async function loadPending() {
  const list = document.querySelector('#pending')
  try {
    const data = await api('/avaliacoes/analise')
    const reviews = data.avaliacoes || []
    if (!reviews.length) {
      list.textContent = 'Nenhuma avaliação pendente.'
      return
    }

    list.replaceChildren(...reviews.map(review => {
      const item = document.createElement('div')
      item.className = 'pending'
      const text = document.createElement('span')
      text.textContent = `Local #${review.idestabelecimento} · ${review.idnota}/5 — ${review.comentario}`
      const actions = document.createElement('div')
      ;[['aprovado', 'Aprovar'], ['rejeitado', 'Recusar']].forEach(([status, label]) => {
        const button = document.createElement('button')
        button.className = 'button'
        button.textContent = label
        button.addEventListener('click', async () => {
          try {
            await api(`/avaliacoes/${review.id}/moderar`, {
              method: 'PATCH',
              body: JSON.stringify({ status }),
            })
            showMessage(`Avaliação ${status === 'aprovado' ? 'aprovada' : 'recusada'}.`)
            await loadPending()
            await loadPlaces()
          } catch (error) {
            showMessage(error.message, true)
          }
        })
        actions.append(button)
      })
      item.append(text, actions)
      return item
    }))
  } catch (error) {
    list.textContent = error.message
  }
}
