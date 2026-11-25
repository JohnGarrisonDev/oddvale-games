// Home page extras: filter chips for the game grid. The page works without this script.
document.documentElement.classList.add('js')
const buttons = [...document.querySelectorAll('.filters button')]
const cards = [...document.querySelectorAll('.g-card')]
for (const b of buttons) {
  b.addEventListener('click', () => {
    const f = b.dataset.filter
    for (const x of buttons) x.setAttribute('aria-pressed', String(x === b))
    for (const c of cards) c.hidden = f !== 'All' && !c.dataset.kinds.split(' ').includes(f)
  })
}

// ---- Today's puzzles (ticks come from this browser only) + community difficulty + owner polls.
import { polls, todayDifficulty, voteLabel, localKey } from './kit/talk.js'
const today = localKey()
let done = {}
try { const t = JSON.parse(localStorage.getItem('oddvale:today') || '{}'); if (t.key === today) done = t.done || {} } catch { /* ignore */ }
const rows = [...document.querySelectorAll('.today-list li')]
for (const li of rows) {
  if (!done[li.dataset.slug]) continue
  li.classList.add('done'); li.querySelector('.tick').hidden = false
  li.querySelector('a').setAttribute('aria-label', `${li.querySelector('.t').textContent}, done today`)
}
todayDifficulty(today).then((games) => {
  for (const li of rows) {
    const g = games[li.dataset.slug]
    if (!g) continue
    const c = li.querySelector('.comm')
    c.textContent = `Most say ${voteLabel(g.top)}`; c.title = `Most of today's ${g.total} votes said ${voteLabel(g.top)}`; c.hidden = false
  }
})
polls(document.getElementById('polls'))
