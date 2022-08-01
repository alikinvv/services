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
    const [serviceMainFile, setServiceMainFile] = useState(code.service)
    const [serviceIndexFile, setServiceIndexFile] = useState(code.serviceIndex)
    const [serviceName, setServiceName] = useState()
    const [filesName, setFilesName] = useState()
    const [propsList, setPropsList] = useState([])
    const [props, setProps] = useState('')
    const [request, setRequest] = useState('')
    const [update, setUpdate] = useState(false)
    const [routeArr, setRouteArr] = useState(createRouteArr(route))
    const [folder, setFolder] = useState('service')
    const [file, setFile] = useState('main')

    const prevCount = usePrevious(serviceName)

    useEffect(() => {
        setRouteArr(createRouteArr(route))
        setUpdate(true)
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
            let requestString = ''
            requests.forEach((request) => {
                requestString += code[request.name]
                    .replaceAll('$method', request.method)
                    .replaceAll('$route', route)
                    .replaceAll('$responseProps', makeProps(routeArr, request))

                if (request.name === 'getListByParam' || request.name === 'getByParam' || request.name === 'create') {
                    requestString = requestString.replaceAll('$params', makeProps(routeArr, request, true))
                }

                let propsListStr = propsList
                propsListStr.push(makeProps(routeArr, request))
                request.name === 'getListByParam' ||
                    request.name === 'getByParam' ||
                    (request.name === 'create' && propsListStr.push(makeProps(routeArr, request, true)))
                setPropsList(propsListStr)

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
            let str = serviceMainFile
            str = str.replaceAll('$request', request)
            str = str.replaceAll('$responseProps', props)

            setServiceMainFile(str)
            setUpdate(false)
        }
    }, [request, props])

    useEffect(() => {
        if (serviceName && update) {
            let str = code.service
            str = str.replaceAll('$serviceName', serviceName)
            str = str.replaceAll('$fileName', filesName)
            setServiceMainFile(str)
        }
    }, [serviceName, update])

    useEffect(() => {
        !!update && reset()
    }, [update])

    const reset = () => {
        setPropsList([])
    }

    return (
        <div className={`content ${className}`}>
            <div>
                <RequestForm requests={(arr) => setRequests(arr)} update={(param) => setUpdate(param)} />
            </div>
            <div>
                <div className="tabs">
                    <div className={`tab ${folder === 'service' && 'active'}`} onClick={() => setFolder('service')}>
                        Service
                    </div>
                    <div className={`tab ${folder === 'store' && 'active'}`} onClick={() => setFolder('store')}>
                        Store
                    </div>
                </div>
                {folder === 'service' && (
                    <div className="tabs">
                        <div className={`tab file ${file === 'main' && 'active'}`} onClick={() => setFile('main')}>
                            {filesName}.ts
                        </div>
                        <div className={`tab file ${file === 'types' && 'active'}`} onClick={() => setFile('types')}>
                            {filesName}.types.ts
                        </div>
                        <div className={`tab file ${file === 'index' && 'active'}`} onClick={() => setFile('index')}>
                            index.ts
                        </div>
                    </div>
                )}

                {file === 'main' && (
                    <SyntaxHighlighter language="typesciprt" style={vs2015}>
                        {file === 'main' && serviceMainFile}
                    </SyntaxHighlighter>
                )}
                {file === 'index' && (
                    <SyntaxHighlighter language="typesciprt" style={vs2015}>
                        {file === 'index' && serviceIndexFile}
                    </SyntaxHighlighter>
                )}
                <button onClick={() => reset()}>Reset</button>
            </div>
        </div>
    )
}

export default Form
