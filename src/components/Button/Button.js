import './Button.scss'

const Button = ({ children, ...props }) => {
    const className = `animeit ai-btn ${props.className ? props.className : ''}`
    return (
        <button {...props} className={className}>
            {children}
        </button>
    )
}

export default Button
