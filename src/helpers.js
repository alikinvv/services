export const camalize = (str) => {
    const string = str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export const firstLetterSmall = (str) => {
    return str.charAt(0).toLowerCase() + str.slice(1)
}

export const makeServiceName = (arr) => {
    let string = ''
    arr.forEach((el) => {
        string += el
    })

    return (string += 'Service')
}
