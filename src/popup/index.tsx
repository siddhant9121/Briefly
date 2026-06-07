import { useState, useEffect } from 'react'
export default function Popup() {
    const [selectedText, setSelectedText] = useState ('')
    const [ mode, setMode]= useState ('Student')
 useEffect(() => {
    chrome.storage.local.get('selectedText', (result) => {
        if (result.selectedText) {
            setSelectedText(result.selectedText as string)
        }
    })
}, [])

return(
    <div> 
        <h1>Briefly</h1>
        <div>
            <button onClick={() => setMode('Student')} >Student</button>
            <button onClick={() => setMode('Research')} >Research</button>
            <button onClick={() => setMode('Executive')} >Executive</button>
        </div>
        <p> {selectedText}</p>
    </div>
)
}