import { useState, useEffect } from 'react'

const AddRequest = ({ route }) => {
    const [input, setInput] = useState()

    const formHandle = (e) => {
        e.preventDefault()
        route(input)
    }

    return (
        <>
            <form className="route" onSubmit={formHandle}>
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="API Route" />
            </form>
        </>
    )
}

export default AddRequest
