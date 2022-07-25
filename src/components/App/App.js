import { useState, useEffect } from 'react'

import './App.scss'
import 'animate.css'

import Button from '../Button'
import SelectItem from '../SelectItem'
import AnimationsList from '../AnimationsList'

const App = () => {
    const [selectedItem, setSelectedItem] = useState(false)
    const [showWrapper, setShowWrapper] = useState(false)

    const addClassHandle = () => {
        let className = 'animate__bounce'
        document.getElementById('aiTarget').classList.remove('animate__animated', className)
        setTimeout(() => {
            document.getElementById('aiTarget').classList.add('animate__animated', className)
        }, 0)
    }

    useEffect(() => {
        selectedItem && setShowWrapper(true)
    }, [selectedItem])

    return (
        <>
            {!selectedItem && <SelectItem select={(value) => setSelectedItem(value)} />}
            {showWrapper && (
                <div className="animeit ai-wrapper">
                    <div className="animeit ai-buttonGroup">
                        <Button onClick={addClassHandle}>Add class</Button>
                        <Button onClick={() => setSelectedItem(false)}>Change Item</Button>
                    </div>
                    <AnimationsList />
                </div>
            )}
        </>
    )
}

export default App
