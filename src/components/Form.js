import { useState, useEffect } from 'react'

import { camalize, makeServiceName, firstLetterSmall } from './../helpers'
import code from './../code'

const Form = ({ route }) => {
    const [serviceIndexFile, setServiceIndexFile] = useState(code.service)
    const [serviceName, setServiceName] = useState()
    const [filesName, setFilesName] = useState()

    const [routeArr, setRouteArr] = useState(
        route
            .split('/')
            .filter((el) => el !== 'v1' && el)
            .map((el) => camalize(el)),
    )

    useEffect(() => {
        setServiceName(makeServiceName(routeArr))
        setFilesName(firstLetterSmall(routeArr[routeArr.length - 1]))
    }, [routeArr])

    useEffect(() => {
        serviceName && setServiceIndexFile(serviceIndexFile.replaceAll('$serviceName', serviceName).replaceAll('$fileName', filesName))
    }, [serviceName])

    return (
        <code>
            {route}
            <pre>{serviceIndexFile}</pre>
        </code>
    )
}

export default Form
