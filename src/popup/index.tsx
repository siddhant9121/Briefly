import { useState, useEffect } from 'react'
import logo from '../assets/logo.jpg'

export default function Popup() {
  const [selectedText, setSelectedText] = useState('')
  const [summary, setSummary] = useState('')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)

 useEffect(() => {
  chrome.storage.local.get('selectedText', (result) => {
    if (result.selectedText) {
      setSelectedText(result.selectedText as string)
    }
  })

  const listener: Parameters<
    typeof chrome.storage.onChanged.addListener
  >[0] = (changes, areaName) => {
    if (
      areaName === 'local' &&
      changes.selectedText
    ) {
      setSelectedText(
        changes.selectedText.newValue as string
      )
      setSummary('')
    }
  }

  chrome.storage.onChanged.addListener(listener)

  return () => {
    chrome.storage.onChanged.removeListener(listener)
  }
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
      <div className="logo-badge">
        <img src={logo} alt="Briefly" className="logo-image" />
      </div>
      <button
        className="summarize-btn"
        onClick={summarize}
        disabled={loading}
      >
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>
      {summary && <p className="summary-text">{summary}</p>}
    <div className="chat-input-container">
  <input
    type="text"
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    placeholder="Ask Briefly..."
    className="question-input"
  />

  <button className="send-btn">
    🐼
  </button>
</div>
