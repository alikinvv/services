import { useEffect, useState } from 'react'

const RequestForm = (props) => {
    const [requests, setRequests] = useState([
        {
            name: 'getList',
            method: 'get',
        },
    ])

    useEffect(() => {
        props.requests(requests)
        props.update(true)
    }, [requests])

    const addHandler = () => {
        setRequests([
            ...requests,
            {
                name: 'getList',
                method: 'get',
            },
        ])
    }

    const nameHandler = (e, index) => {
        let newArr = [...requests]
        newArr[index].name = e.target.value
        setRequests(newArr)
    }

    const methodHandler = (e, index) => {
        let newArr = [...requests]
        newArr[index].method = e.target.value
        setRequests(newArr)
    }

    return (
        <div className="request">
            <div className="request__title">
                Requests:
                <button className="btn request__add" onClick={addHandler}>
                    +
                </button>
            </div>
            {requests.map((request, index) => (
                <div key={index} className="form-inline">
                    <div className="form-group">
                        <label>Name:</label>
                        <select value={request.name} onChange={(e) => nameHandler(e, index)}>
                            <option value="getList">getList</option>
                            <option value="getListByParam">getListByParam</option>
                            <option value="getListById">getListById</option>
                            <option value="get">get</option>
                            <option value="getByParam">getByParam</option>
                            <option value="getById">getById</option>
                            <option value="create">create</option>
                            <option value="delete">delete</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Method:</label>
                        <select value={request.get} onChange={(e) => methodHandler(e, index)}>
                            <option value="get">get</option>
                            <option value="post">post</option>
                            <option value="delete">delete</option>
                            <option value="put">put</option>
                        </select>
                    </div>
                    <button className="btn request__remove" onClick={() => setRequests(requests.filter((_, i) => i !== index))}>
                        Remove
                    </button>
                </div>
            ))}
        </div>
    )
}

export default RequestForm
