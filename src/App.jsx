import { useState, useEffect } from 'react';
import { getUrlsFromExcel, getRootDomain, generateOutputExcel } from './utils/excelProcessor';
import { Moon, Sun, Layers, Github, Linkedin, Twitter, Upload, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import './App.css';

function App() {
  const [existingFile, setExistingFile] = useState(null);
  const [prospectFile, setProspectFile] = useState(null);
  const [status, setStatus] = useState({ msg: '', type: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark'); // Default to dark

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleProcess = async () => {
    if (!existingFile || !prospectFile) return;

    setIsProcessing(true);
    setStatus({ msg: 'Reading files...', type: 'info' });

    try {
      const existingUrls = await getUrlsFromExcel(existingFile);
      const existingDomains = new Set(existingUrls.map(getRootDomain).filter(d => d));
      
      const prospectUrls = await getUrlsFromExcel(prospectFile);

      const uniqueProspects = [];
      const duplicateProspects = [];
      const processedProspectUrls = new Set();

      for (const url of prospectUrls) {
        if (processedProspectUrls.has(url)) continue;
        processedProspectUrls.add(url);

        const domain = getRootDomain(url);
        if (domain) {
          if (existingDomains.has(domain)) {
            duplicateProspects.push({ url, domain });
          } else {
            uniqueProspects.push({ url });
          }
        }
      }

      generateOutputExcel(uniqueProspects, duplicateProspects);
      
      setStatus({ 
        msg: `Done! ${uniqueProspects.length} unique domains found.`, 
        type: 'success' 
      });

    } catch (error) {
      console.error(error);
      setStatus({ msg: 'Error processing files. Check format.', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="header">
        <nav className="navbar">
          <div className="logo">
            <Layers color="var(--primary-color)" size={28} />
            <span>DomainFilter</span>
          </div>
          <button onClick={toggleTheme} className="theme-switcher" aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </nav>
      </header>

      <main>
        <div className="container">
          <h1>Clean up your prospect lists.</h1>
          <p className="subtitle">Remove domains you have already contacted. Simple, private, and free.</p>

          <div className="upload-grid">
            {/* Card 1 */}
            <div className={`upload-card ${existingFile ? 'active' : ''}`}>
              <div className="upload-label">
                <Upload size={24} color={existingFile ? 'var(--text-on-primary)' : 'var(--primary-color)'} />
                <span>Upload Existing List</span>
              </div>
              <input 
                className="upload-input"
                type="file" 
                accept=".xlsx"
                onChange={(e) => setExistingFile(e.target.files[0])} 
              />
              <span className="file-status">
                {existingFile ? existingFile.name : 'Select .xlsx'}
              </span>
            </div>

            {/* Card 2 */}
            <div className={`upload-card ${prospectFile ? 'active' : ''}`}>
              <div className="upload-label">
                <Upload size={24} color={prospectFile ? 'var(--text-on-primary)' : 'var(--primary-color)'} />
                <span>Upload New Prospects</span>
              </div>
              <input 
                className="upload-input"
                type="file" 
                accept=".xlsx"
                onChange={(e) => setProspectFile(e.target.files[0])} 
              />
              <span className="file-status">
                {prospectFile ? prospectFile.name : 'Select .xlsx'}
              </span>
            </div>
          </div>

          <button 
            className="process-btn" 
            onClick={handleProcess} 
            disabled={!existingFile || !prospectFile || isProcessing}
          >
            {isProcessing ? 'Processing...' : (
              <>
                Filter Domains <ArrowRight size={24} />
              </>
            )}
          </button>

          {status.msg && (
            <div className={`status-msg ${status.type}`}>
              {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {status.msg}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="social-links">
          <a href="#"><Twitter size={20} /></a>
          <a href="#"><Linkedin size={20} /></a>
          <a href="#"><Github size={20} /></a>
        </div>
        <p>No data is sent to servers. Everything processes in your browser.</p>
      </footer>
    </div>
  );
}

export default App;