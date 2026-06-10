import { useState, useEffect } from 'react'
export default function Popup() {
    const [selectedText, setSelectedText] = useState ('')
    const [ mode, setMode]= useState ('Student')
    const[summary,setSummary]= useState('')
 useEffect(() => {
    chrome.storage.local.get('selectedText', (result) => {
        if (result.selectedText) {
            setSelectedText(result.selectedText as string)
        }
    })
}, [])
const summarize = async () =>{
    const response = await fetch ('http://localhost:8000/summarize', {
        method:'POST',
        headers: {'Content-Type' : 'application/json'},
        body : JSON.stringify({ text: selectedText, mode :mode})
    })
    const data = await response.json()
    setSummary(data.summary)
}

return(
    <div> 
        <h1>Briefly</h1>
        <div>
            <button onClick={() => setMode('Student')} >Student</button>
            <button onClick={() => setMode('Research')} >Research</button>
            <button onClick={() => setMode('Executive')} >Executive</button>
        </div>
        <p> {selectedText}</p>
        <button onClick={summarize}>Summarize</button>
        <p>{summary}</p>
    </div>
)
}
