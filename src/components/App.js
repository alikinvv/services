import { useState, useEffect } from 'react'

import AddRequest from './AddRequest'
import Form from './Form'

const App = () => {
    const [route, setRoute] = useState('/v1/civil-defence/dictionary/org-units')

    return (
        <>
            {!route && <AddRequest route={(route) => setRoute(route)} />}
            {route && <Form route={route} />}
        </>
    )
}

export default App
