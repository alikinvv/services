import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components'

import './dev.styles.scss'

document.body.innerHTML += '<div id="animeitRoot" class="animeit ai-app"></div>'

const root = ReactDOM.createRoot(document.getElementById('animeitRoot'))
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
