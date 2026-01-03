import { useState, useEffect } from 'react';
import { getUrlsFromExcel, getRootDomain, generateOutputExcel } from './utils/excelProcessor';
import { Moon, Sun, Filter, Github, Linkedin, Twitter, UploadCloud } from 'lucide-react';
import './App.css';

function App() {
  const [existingFile, setExistingFile] = useState(null);
  const [prospectFile, setProspectFile] = useState(null);
  const [status, setStatus] = useState({ msg: '', type: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Handle Theme Change
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleProcess = async () => {
    if (!existingFile || !prospectFile) return;

    setIsProcessing(true);
    setStatus({ msg: 'Step 1/4: Reading existing links file...', type: 'info' });

    try {
      // 1. Process Existing
      const existingUrls = await getUrlsFromExcel(existingFile);
      const existingDomains = new Set(existingUrls.map(getRootDomain).filter(d => d));
      
      setStatus({ msg: 'Step 2/4: Reading prospect links file...', type: 'info' });
      
      // 2. Process Prospects
      const prospectUrls = await getUrlsFromExcel(prospectFile);

      setStatus({ msg: 'Step 3/4: Comparing domains...', type: 'info' });

      // 3. Compare
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

      setStatus({ msg: 'Step 4/4: Generating report...', type: 'info' });
      
      // 4. Download
      generateOutputExcel(uniqueProspects, duplicateProspects);
      
      setStatus({ 
        msg: `Success! Found ${uniqueProspects.length} unique domains. File downloaded.`, 
        type: 'success' 
      });

    } catch (error) {
      console.error(error);
      setStatus({ msg: `Error: ${error.message}`, type: 'error' });
    } finally {
      setIsProcessing(false);
      // Optional: Reset inputs
      // setExistingFile(null);
      // setProspectFile(null);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="header">
        <nav className="navbar">
          <div className="logo">
            <Filter className="logo-icon" />
            <span className="logo-text">DomainChecker</span>
          </div>
          <button onClick={toggleTheme} className="theme-switcher" aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </nav>
      </header>

      <main>
        <div className="container">
          <h1>Domain Uniqueness Checker</h1>
          <p>Find new link-building opportunities by filtering out domains you already have.</p>

          <div className={`upload-section ${existingFile ? 'filled' : ''}`}>
            <label htmlFor="existing-file">
              <UploadCloud size={20} style={{marginRight: '8px'}}/>
              1. Upload Existing Links (.xlsx)
            </label>
            <input 
              type="file" 
              id="existing-file" 
              accept=".xlsx"
              onChange={(e) => setExistingFile(e.target.files[0])} 
            />
            {existingFile && <span className="file-name">{existingFile.name}</span>}
          </div>

          <div className={`upload-section ${prospectFile ? 'filled' : ''}`}>
            <label htmlFor="prospect-file">
               <UploadCloud size={20} style={{marginRight: '8px'}}/>
               2. Upload Prospect Links (.xlsx)
            </label>
            <input 
              type="file" 
              id="prospect-file" 
              accept=".xlsx"
              onChange={(e) => setProspectFile(e.target.files[0])} 
            />
            {prospectFile && <span className="file-name">{prospectFile.name}</span>}
          </div>

          <button 
            className="process-btn" 
            onClick={handleProcess} 
            disabled={!existingFile || !prospectFile || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Process and Find Unique URLs'}
          </button>

          {status.msg && (
            <div className={`status ${status.type}`}>
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
        <p>&copy; {new Date().getFullYear()} DomainChecker. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;