import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css' // first: page CSS imported by components must come after it
import App from './App'

// The stage is drawn at 1440×900 and scaled to fit the viewport (see .stage in styles.css).
// --gutter is the spare width on each side of the centred 1440 frame, in design pixels.
const fit = () => {
  const scale = Math.min(innerWidth / 1440, innerHeight / 900)
  document.documentElement.style.setProperty('--fit', String(scale))
  document.documentElement.style.setProperty('--gutter', `${(innerWidth / scale - 1440) / 2}px`)
  // Mobile only: shrink the three fixed-size Home capsules so they share one row.
  document.documentElement.style.setProperty('--capsule-zoom', String(Math.min(1, (innerWidth - 60) / (3 * 188.229))))
}
fit()
addEventListener('resize', fit)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
