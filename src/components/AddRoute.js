import { useState, useEffect, useRef } from 'react'

const AddRoute = ({ setRoute, route, className }) => {
    const [input, setInput] = useState(route)
    const [example, setExample] = useState('/v1/civil-defence/dictionary/org-units')

    const searchInput = useRef(null)

    const formHandle = (e) => {
        e.preventDefault()
        setRoute(input)
    }

    useEffect(() => {
        className && setRoute(input)
    }, [input])

    return (
        <>
            <form className={`route ${className}`} onSubmit={formHandle}>
                <div className="form-group">
                    <label>Route:</label>
                    <input ref={searchInput} value={input} onChange={(e) => setInput(e.target.value)} placeholder="API Route" />
                    <span>
                        Example:{' '}
                        <span
                            onClick={() => {
                                setInput(example)
                                searchInput.current.focus()
                            }}
                        >
                            {example}
                        </span>
                    </span>
                </div>
            </form>
        </>
    )
}

export default AddRoute
