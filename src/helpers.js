export const camalize = (str) => {
    const string = str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export const firstLetterSmall = (str) => {
    return str.charAt(0).toLowerCase() + str.slice(1)
}

export const firstLetterBig = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const makeServiceName = (arr) => {
    let string = ''
    arr &&
        arr.forEach((el) => {
            string += el
        })

    return (string += 'Service')
}

export const makeProps = (arr, request, params = false) => {
    if (arr) {
        let newArr = arr.map((el) => {
            switch (el) {
                case 'CivilDefence':
                    return 'CivDef'
                    break
                case 'Dictionary':
                    return 'Dict'
                    break
                case 'Admission':
                    return 'Adm'
                    break
                default:
                    return el
                    break
            }
        })

        let string = ''
        newArr.forEach((el) => {
            string += el
        })

        string += firstLetterBig(request.name)
        return (string += params ? 'ParamsProps' : 'Props')
    } else {
        return ''
    }
}

export const createRouteArr = (route) =>
    route &&
    route
        .split('/')
        .filter((el) => el !== 'v1' && el)
        .map((el) => camalize(el))
