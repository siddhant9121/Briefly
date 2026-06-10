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
useEffect (() =>{
    const messageListener =(message:{ type:string; text: string }) => {
        if(message.type === "TEXT_SELECTED") {
            setSelectedText(message.text)
        }
   }
   chrome.runtime .onMessage.addListener(messageListener)
   return () =>{
    chrome.runtime.onMessage.removeListener(messageListener)
   }

},[])
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
