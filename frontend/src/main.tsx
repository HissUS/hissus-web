import { createRoot, hydrateRoot } from 'react-dom/client'
import './assets/index.css'
import i18n from './i18n'
import { router } from './router'
import { Application } from './Application'

// Keep prerendered content visible until its route and language are ready.
await i18n.changeLanguage(window.location.pathname.startsWith('/tw/') ? 'zh-TW' : 'en')
await router.load()
const root = document.getElementById('root')!
const application = <Application router={router} />
if (root.dataset.prerender === 'true') hydrateRoot(root, application)
else createRoot(root).render(application)
