import { useState, useRef } from 'react';
import './App.css';

interface StructuredResult {
  intent: string;
  category: string;
  urgency_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  key_entities: string[];
  recommended_actions: string[];
  confidence_score: string;
  sources: string[];
}

function App() {
  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StructuredResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!textInput.trim() && !file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    if (textInput.trim()) {
      formData.append('textContext', textInput);
    }
    if (file) {
      formData.append('image', file);
    }

    try {
      const response = await fetch('http://localhost:5000/api/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to process request');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseScore = (scoreStr: string) => {
    const num = parseInt(scoreStr.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 0 : num;
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Context Bridge</h1>
        <p>Turning chaotic real-world inputs into verified, actionable insights.</p>
      </header>

      <main className="main-content">
        {/* Input Panel */}
        <section className="panel input-panel">
          <h2 className="panel-title">1. Describe the Situation</h2>
          
          <div className="input-area">
            <textarea
              placeholder="e.g., There's a severe accident on Highway 101, looks like multiple cars involved, send help right away."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="file-input-wrapper">
            <label>Attach Evidence (Image / Document):</label>
            <input 
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={loading}
            />
          </div>

          <button 
            className="btn-primary" 
            onClick={handleSubmit} 
            disabled={loading || (!textInput.trim() && !file)}
          >
            {loading ? <div className="spinner" /> : 'Process Request'}
          </button>

          {error && (
            <div style={{ color: 'var(--danger)', marginTop: '1rem', fontSize: '0.9rem' }}>
              ⚠️ Error: {error}
            </div>
          )}
        </section>

        {/* Output Panel / Dashboard */}
        <section className="panel output-panel">
          <h2 className="panel-title">2. Actionable Insights</h2>
          
          {!loading && !result && (
            <div className="empty-state">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌐</div>
              <p>Submit text or an image to see structured insights.</p>
            </div>
          )}

          {loading && (
            <div className="empty-state">
              <div className="spinner" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent', margin: '0 auto', width: '40px', height: '40px' }} />
              <p style={{ marginTop: '1rem' }}>Extracting entities and generating plan...</p>
            </div>
          )}

          {result && !loading && (
            <div className="result-card">
              <div className="chip-row">
                <span className="chip category">{result.category}</span>
                <span className={`chip urgency-${result.urgency_level?.toLowerCase() || 'low'}`}>
                  {result.urgency_level} URGENCY
                </span>
              </div>

              <div className="result-section">
                <h3>Intent</h3>
                <p>{result.intent}</p>
              </div>

              <div className="result-section">
                <h3>Confidence: {result.confidence_score}</h3>
                <div className="confidence-bar-wrapper">
                  <div 
                    className="confidence-bar" 
                    style={{ width: `${parseScore(result.confidence_score)}%` }} 
                  />
                </div>
              </div>

              <div className="result-section">
                <h3>Key Entities</h3>
                <ul className="entity-list">
                  {result.key_entities?.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>

              <div className="result-section">
                <h3>Recommended Actions</h3>
                <ul className="action-list">
                  {result.recommended_actions?.map((act, i) => <li key={i}>{act}</li>)}
                </ul>
              </div>

              <div className="result-section">
                <h3>Sources Verified</h3>
                <ul className="source-list">
                  {result.sources?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
