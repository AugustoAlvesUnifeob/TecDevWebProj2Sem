import { api, getUser } from '../services/api.js'
import { showLogin, showMessage } from './auth.js'

let places = []

function make(tag, text, className = '') {
  const element = document.createElement(tag)
  element.textContent = text
  element.className = className
  return element
}

async function showReviews(place, container) {
  container.replaceChildren(make('p', 'Carregando...'))
  try {
    const data = await api(`/avaliacoes/local/${place.id}`)
    const reviews = data.avaliacoes || []
    container.replaceChildren(...reviews.map(review =>
      make('p', `${'★'.repeat(review.idnota)} ${review.comentario}`)))
    if (!reviews.length) container.append(make('p', 'Ainda não há avaliações.'))

    const user = getUser()
    if (user?.tipo === 2) addReviewForm(place, container)
    else if (!user) {
      const button = make('button', 'Entre para avaliar', 'plain')
      button.type = 'button'
      button.addEventListener('click', showLogin)
      container.append(button)
    }
  } catch (error) {
    container.replaceChildren(make('p', error.message))
  }
}

function addReviewForm(place, container) {
  const form = make('form', '', 'form review-form')
  form.innerHTML = `
    <label>Nota
      <select name="idnota" required>
        <option value="5">5 estrelas</option>
        <option value="4">4 estrelas</option>
        <option value="3">3 estrelas</option>
        <option value="2">2 estrelas</option>
        <option value="1">1 estrela</option>
      </select>
    </label>
    <label>Comentário<textarea name="comentario" minlength="3" maxlength="2000" required></textarea></label>
    <button class="button" type="submit">Enviar avaliação</button>`
  form.addEventListener('submit', async event => {
    event.preventDefault()
    try {
      const values = Object.fromEntries(new FormData(form))
      values.idestabelecimento = place.id
      values.idnota = Number(values.idnota)
      await api('/avaliacoes/register', { method: 'POST', body: JSON.stringify(values) })
      form.reset()
      showMessage('Avaliação enviada para análise.')
    } catch (error) {
      showMessage(error.message, true)
    }
  })
  container.append(form)
}

function render() {
  const query = document.querySelector('#search').value.toLowerCase()
  const matches = places.filter(place =>
    `${place.name} ${place.descricao}`.toLowerCase().includes(query))
  const list = document.querySelector('#places')
  if (!matches.length) {
    list.textContent = places.length ? 'Nenhum resultado.' : 'Nenhum estabelecimento cadastrado.'
    return
  }

  list.replaceChildren(...matches.map(place => {
    const card = make('article', '', 'place')
    const title = make('h3', place.name)
    const rating = Number(place.media)
    card.append(title, make('div',
      rating ? `★ ${rating.toFixed(1)}` : 'Sem avaliações', 'place-meta'))
    card.append(make('p', place.descricao))
    card.append(make('div', `Telefone: ${place.phone} · Horário: ${place.horario}`, 'place-meta'))

    const button = make('button', 'Avaliações', 'plain')
    button.type = 'button'
    const reviews = make('div', '', 'reviews')
    reviews.hidden = true
    button.addEventListener('click', () => {
      reviews.hidden = !reviews.hidden
      if (!reviews.hidden) showReviews(place, reviews)
    })
    card.append(button, reviews)
    return card
  }))
}

export async function loadPlaces() {
  try {
    const data = await api('/locais')
    places = data.estabelecimentos || []
    render()
  } catch (error) {
    document.querySelector('#places').textContent = error.message
  }
}

export function initPlaces() {
  document.querySelector('#search').addEventListener('input', render)
  document.querySelector('#business-form').addEventListener('submit', async event => {
    event.preventDefault()
    const form = event.currentTarget
    try {
      await api('/locais/register', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      form.reset()
      showMessage('Estabelecimento cadastrado.')
      await loadPlaces()
    } catch (error) {
      showMessage(error.message, true)
    }
  })
}
