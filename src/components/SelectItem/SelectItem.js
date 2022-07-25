import './SelectItem.scss'

const SelectItem = ({ select }) => {
    const outHandle = ({ target }) => target.classList.remove('ai-hover')
    const overHandle = ({ target }) => {
        if (!target.classList.contains('animeit')) {
            target.classList.add('ai-hover')
        }
    }

    document.addEventListener('mouseover', overHandle)
    document.addEventListener('mouseout', outHandle)
    document.addEventListener('click', ({ target }) => {
        if (!target.classList.contains('animeit')) {
            document.removeEventListener('mouseover', overHandle)
            document.removeEventListener('mouseout', outHandle)
            target.setAttribute('id', 'aiTarget')
            target.classList.remove('ai-hover')
            select(true)
        }
    })

    return null
}

export default SelectItem
