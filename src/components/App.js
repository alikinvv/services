import { useState, useEffect } from 'react'

import AddRoute from './AddRoute'
import Form from './Form'

const App = () => {
    const [route, setRoute] = useState() // '/v1/civil-defence/dictionary/org-units'

    return (
        <>
            {<AddRoute className={route && 'animate'} route={route} setRoute={(route) => setRoute(route)} />}
            {<Form className={route && 'show'} route={route} />}
        </>
    )
}

export default App
