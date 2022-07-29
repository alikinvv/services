import { useState, useEffect, useRef } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import vs2015 from 'react-syntax-highlighter/dist/esm/styles/hljs/vs2015'

import { makeServiceName, firstLetterSmall, createRouteArr, makeProps } from './../helpers'
import code from './../code'
import RequestForm from './RequestForm'

function usePrevious(value) {
    const ref = useRef()
    useEffect(() => {
        ref.current = value
    }, [value])
    return ref.current
}

const Form = ({ route, className }) => {
    const [serviceIndexFile, setServiceIndexFile] = useState(code.service)
    const [serviceName, setServiceName] = useState()
    const [filesName, setFilesName] = useState()
    const [propsList, setPropsList] = useState([])
    const [props, setProps] = useState('')
    const [request, setRequest] = useState('')

    const prevCount = usePrevious(serviceName)

    const [routeArr, setRouteArr] = useState(createRouteArr(route))

    useEffect(() => {
        setRouteArr(createRouteArr(route))
    }, [route])

    useEffect(() => {
        if (routeArr) {
            setServiceName(makeServiceName(routeArr))
            setFilesName(firstLetterSmall(routeArr[routeArr.length - 1]))
        }
    }, [routeArr])

    const [requests, setRequests] = useState()

    useEffect(() => {
        if (requests && serviceName) {
            setProps('')
            setPropsList([])

            let requestString = ''
            requests.forEach((request) => {
                requestString += code[request.name]
                    .replaceAll('$method', request.method)
                    .replaceAll('$route', route)
                    .replaceAll('$responseProps', makeProps(routeArr, request))

                let props = propsList
                props.push(makeProps(routeArr, request))
                setPropsList(props)

                let propsString = ''
                propsList.forEach((prop) => {
                    propsString += !!propsString.length ? ', ' : ''
                    propsString += prop
                })
                setProps(propsString)
            })

            setRequest(requestString)
        }
    }, [requests, serviceName])

    useEffect(() => {
        if ((request, props)) {
            let str = serviceIndexFile
            str = str.replaceAll('$request', request)
            str = str.replaceAll('$responseProps', props)

            console.log(str)
            setServiceIndexFile(str)
        }
    }, [request, props])

    useEffect(() => {
        if (serviceName) {
            let str = serviceIndexFile
            str = str.replaceAll(prevCount ? prevCount : '$serviceName', serviceName)
            str = str.replaceAll('$fileName', filesName)
            setServiceIndexFile(str)
        }
    }, [serviceName])

    return (
        <div className={`content ${className}`}>
            {props}
            <RequestForm requests={(arr) => setRequests(arr)} />
            <SyntaxHighlighter language="typesciprt" style={vs2015}>
                {serviceIndexFile}
            </SyntaxHighlighter>
        </div>
    )
}

export default Form
