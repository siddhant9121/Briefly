import { useState, useEffect } from 'react'

export default function Popup() {
    const [selectedText, setSelectedText] = useState('')
    const [summary, setSummary] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        chrome.storage.local.get('selectedText', (result) => {
            if (result.selectedText) {
                setSelectedText(result.selectedText as string)
            }
        })
    }, [])

    const summarize = async () => {
        setLoading(true)
        const response = await fetch('http://localhost:8000/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: selectedText })
        })
        const data = await response.json()
        setSummary(data.summary)
        setLoading(false)
    }

return (
    <div className="popup-container">
        <h1>Briefly</h1>
        <p className="selected-text">{selectedText}</p>
        <button 
            className="summarize-btn" 
            onClick={summarize}
            disabled={loading}
        >
            {loading ? 'Summarizing...' : 'Summarize'}
        </button>
        {summary && <p className="summary-text">{summary}</p>}
    </div>
)}