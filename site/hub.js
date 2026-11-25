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
