import { useEffect } from 'react'

const RequestForm = (props) => {
    const requests = [
        {
            name: 'getList',
            method: 'get',
        },
    ]

    useEffect(() => {
        props.requests(requests)
    }, [])

    return (
        <div className="request">
            <div className="request__title">Requests:</div>
            {requests.map((request, index) => (
                <div key={index} className="form-inline">
                    <div className="form-group">
                        <label>Name:</label>
                        <select value={request.name}>
                            <option value="getList">getList</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Method:</label>
                        <select value={request.get}>
                            <option value="get">get</option>
                        </select>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RequestForm
