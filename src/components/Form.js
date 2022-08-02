import { useState, useEffect, useRef } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import nightOwl from 'react-syntax-highlighter/dist/esm/styles/hljs/night-owl'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { makeServiceName, firstLetterSmall, createRouteArr, makeProps, originalRouteArr } from './../helpers'
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
    const [serviceTypesFile, setServiceTypesFile] = useState(code.serviceTypes)
    const [storeFile, setStoreFile] = useState(code.store)
    const [serviceName, setServiceName] = useState()
    const [filesName, setFilesName] = useState()
    const [propsList, setPropsList] = useState([])
    const [props, setProps] = useState('')
    const [request, setRequest] = useState('')
    const [update, setUpdate] = useState(false)
    const [routeArr, setRouteArr] = useState(createRouteArr(route))
    const [folder, setFolder] = useState('service')
    const [file, setFile] = useState('main')
    const [fetch, setFetch] = useState('')
    const [stateProps, setStateProps] = useState('')

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
            let store = ''
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
                if (request.name === 'getListByParam' || request.name === 'getByParam' || request.name === 'create') {
                    propsListStr.push(makeProps(routeArr, request, true))
                }
                setPropsList(propsListStr)

                let mainProps = ''
                let typesProps = ''
                propsList.forEach((prop) => {
                    mainProps += !!mainProps.length ? ', ' : ''
                    mainProps += prop
                    typesProps += code.serviceTypes
                    typesProps = typesProps.replaceAll('$type', prop)
                })

                setProps(mainProps)
                setServiceTypesFile(typesProps)

                store += code.fetch
                store = store.replaceAll('$requestName', request.name)
                store = store.replaceAll('$serviceName', serviceName)
            })

            setFetch(store)
            setRequest(requestString)
        }
    }, [requests, serviceName])

    useEffect(() => {
        if ((request, props)) {
            let serviceMain = serviceMainFile
            serviceMain = serviceMain.replaceAll('$request', request)
            serviceMain = serviceMain.replaceAll('$responseProps', props)

            let store = storeFile
            store = store.replaceAll('$responseProps', props)
            store = store.replaceAll('$fetch', fetch)

            setServiceMainFile(serviceMain)
            setStoreFile(store)
            setUpdate(false)
        }
    }, [request, props])

    useEffect(() => {
        if (serviceName && update) {
            let serviceMain = code.service
            serviceMain = serviceMain.replaceAll('$serviceName', serviceName)
            serviceMain = serviceMain.replaceAll('$fileName', filesName)
            setServiceMainFile(serviceMain)

            let serviceIndex = code.serviceIndex
            serviceIndex = serviceIndex.replaceAll('$serviceName', serviceName)
            serviceIndex = serviceIndex.replaceAll('$fileName', filesName)
            setServiceIndexFile(serviceIndex)

            let store = code.store
            store = store.replaceAll('$serviceName', serviceName)
            store = store.replaceAll('$slice', firstLetterSmall(routeArr[routeArr.length - 1]))
            store = store.replaceAll('$slName', originalRouteArr(route)[originalRouteArr(route).length - 1])
            store = store.replaceAll('$stateProps', propsList[0])

            setStoreFile(store)
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
                    <div className={`tab folder ${folder === 'service' && 'active'}`} onClick={() => setFolder('service')}>
                        Service
                    </div>
                    <div className={`tab folder ${folder === 'store' && 'active'}`} onClick={() => setFolder('store')}>
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

                {file === 'main' && folder === 'service' && (
                    <div className="code-wrapper">
                        <SyntaxHighlighter language="typesciprt" style={nightOwl}>
                            {serviceMainFile}
                        </SyntaxHighlighter>
                        <CopyToClipboard text={serviceMainFile}>
                            <button className="btn copy">
                                <svg version="1.1" viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <path d="m499.32 251.51c0-20-16.211-36.215-36.215-36.215h-248.25c-19.707 0-35.68 15.977-35.68 35.68v316.89c0 19.707 15.977 35.68 35.68 35.68h248.79c19.707 0 35.68-15.977 35.68-35.68zm-26.844 33.543v271.09c0 11.352-9.207 20.555-20.555 20.555h-225.35c-11.352 0-20.555-9.207-20.555-20.555v-293.45c0-11.352 9.207-20.555 20.555-20.555h224.88c11.188 0 20.32 8.9453 20.551 20.133z" />
                                        <path d="m422.77 319.5h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.707 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324s-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 369.62h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.707 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324 0 5.707-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 419.74h-167.05c-5.707 0-10.324-4.625-10.324-10.324s4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324s-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 469.86h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.6992 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324 0 5.6992-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 519.98h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.6992 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324 0 5.6992-4.625 10.324-10.324 10.324z" />
                                        <path d="m536.62 148.46h-248.25c-19.707 0-35.68 15.977-35.68 35.68v14.445h26.848l-0.003906-2.7227c0-11.352 9.207-20.555 20.555-20.555h224.88c11.188 0 20.32 8.9453 20.551 20.133l0.46484 22.785v271.09c0 11.352-9.207 20.555-20.555 20.555h-9.4062v26.848h21.125c19.707 0 35.68-15.977 35.68-35.68l0.003906-296.24v-20.129c0-20-16.211-36.211-36.211-36.211z" />
                                    </g>
                                </svg>
                            </button>
                        </CopyToClipboard>
                    </div>
                )}
                {file === 'types' && folder === 'service' && (
                    <div className="code-wrapper">
                        <SyntaxHighlighter language="typesciprt" style={nightOwl}>
                            {serviceTypesFile}
                        </SyntaxHighlighter>
                        <CopyToClipboard text={serviceTypesFile}>
                            <button className="btn copy">
                                <svg version="1.1" viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <path d="m499.32 251.51c0-20-16.211-36.215-36.215-36.215h-248.25c-19.707 0-35.68 15.977-35.68 35.68v316.89c0 19.707 15.977 35.68 35.68 35.68h248.79c19.707 0 35.68-15.977 35.68-35.68zm-26.844 33.543v271.09c0 11.352-9.207 20.555-20.555 20.555h-225.35c-11.352 0-20.555-9.207-20.555-20.555v-293.45c0-11.352 9.207-20.555 20.555-20.555h224.88c11.188 0 20.32 8.9453 20.551 20.133z" />
                                        <path d="m422.77 319.5h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.707 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324s-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 369.62h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.707 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324 0 5.707-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 419.74h-167.05c-5.707 0-10.324-4.625-10.324-10.324s4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324s-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 469.86h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.6992 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324 0 5.6992-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 519.98h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.6992 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324 0 5.6992-4.625 10.324-10.324 10.324z" />
                                        <path d="m536.62 148.46h-248.25c-19.707 0-35.68 15.977-35.68 35.68v14.445h26.848l-0.003906-2.7227c0-11.352 9.207-20.555 20.555-20.555h224.88c11.188 0 20.32 8.9453 20.551 20.133l0.46484 22.785v271.09c0 11.352-9.207 20.555-20.555 20.555h-9.4062v26.848h21.125c19.707 0 35.68-15.977 35.68-35.68l0.003906-296.24v-20.129c0-20-16.211-36.211-36.211-36.211z" />
                                    </g>
                                </svg>
                            </button>
                        </CopyToClipboard>
                    </div>
                )}
                {file === 'index' && folder === 'service' && (
                    <div className="code-wrapper">
                        <SyntaxHighlighter language="typesciprt" style={nightOwl}>
                            {serviceIndexFile}
                        </SyntaxHighlighter>
                        <CopyToClipboard text={serviceIndexFile}>
                            <button className="btn copy">
                                <svg version="1.1" viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <path d="m499.32 251.51c0-20-16.211-36.215-36.215-36.215h-248.25c-19.707 0-35.68 15.977-35.68 35.68v316.89c0 19.707 15.977 35.68 35.68 35.68h248.79c19.707 0 35.68-15.977 35.68-35.68zm-26.844 33.543v271.09c0 11.352-9.207 20.555-20.555 20.555h-225.35c-11.352 0-20.555-9.207-20.555-20.555v-293.45c0-11.352 9.207-20.555 20.555-20.555h224.88c11.188 0 20.32 8.9453 20.551 20.133z" />
                                        <path d="m422.77 319.5h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.707 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324s-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 369.62h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.707 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324 0 5.707-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 419.74h-167.05c-5.707 0-10.324-4.625-10.324-10.324s4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324s-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 469.86h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.6992 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324 0 5.6992-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 519.98h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.6992 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324 0 5.6992-4.625 10.324-10.324 10.324z" />
                                        <path d="m536.62 148.46h-248.25c-19.707 0-35.68 15.977-35.68 35.68v14.445h26.848l-0.003906-2.7227c0-11.352 9.207-20.555 20.555-20.555h224.88c11.188 0 20.32 8.9453 20.551 20.133l0.46484 22.785v271.09c0 11.352-9.207 20.555-20.555 20.555h-9.4062v26.848h21.125c19.707 0 35.68-15.977 35.68-35.68l0.003906-296.24v-20.129c0-20-16.211-36.211-36.211-36.211z" />
                                    </g>
                                </svg>
                            </button>
                        </CopyToClipboard>
                    </div>
                )}
                {folder === 'store' && (
                    <div className="code-wrapper">
                        <SyntaxHighlighter language="typesciprt" style={nightOwl}>
                            {storeFile}
                        </SyntaxHighlighter>
                        <CopyToClipboard text={storeFile}>
                            <button className="btn copy">
                                <svg version="1.1" viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <path d="m499.32 251.51c0-20-16.211-36.215-36.215-36.215h-248.25c-19.707 0-35.68 15.977-35.68 35.68v316.89c0 19.707 15.977 35.68 35.68 35.68h248.79c19.707 0 35.68-15.977 35.68-35.68zm-26.844 33.543v271.09c0 11.352-9.207 20.555-20.555 20.555h-225.35c-11.352 0-20.555-9.207-20.555-20.555v-293.45c0-11.352 9.207-20.555 20.555-20.555h224.88c11.188 0 20.32 8.9453 20.551 20.133z" />
                                        <path d="m422.77 319.5h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.707 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324s-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 369.62h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.707 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324 0 5.707-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 419.74h-167.05c-5.707 0-10.324-4.625-10.324-10.324s4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324s-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 469.86h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.6992 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324 0 5.6992-4.625 10.324-10.324 10.324z" />
                                        <path d="m422.77 519.98h-167.05c-5.707 0-10.324-4.625-10.324-10.324 0-5.6992 4.625-10.324 10.324-10.324h167.05c5.707 0 10.324 4.625 10.324 10.324 0 5.6992-4.625 10.324-10.324 10.324z" />
                                        <path d="m536.62 148.46h-248.25c-19.707 0-35.68 15.977-35.68 35.68v14.445h26.848l-0.003906-2.7227c0-11.352 9.207-20.555 20.555-20.555h224.88c11.188 0 20.32 8.9453 20.551 20.133l0.46484 22.785v271.09c0 11.352-9.207 20.555-20.555 20.555h-9.4062v26.848h21.125c19.707 0 35.68-15.977 35.68-35.68l0.003906-296.24v-20.129c0-20-16.211-36.211-36.211-36.211z" />
                                    </g>
                                </svg>
                            </button>
                        </CopyToClipboard>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Form
