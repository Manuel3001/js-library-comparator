import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; // NEU: Für das KI-Markdown
import PageLayout from '../components/PageLayout';
import styles from './moduleStyles/DiscoveryPage.module.css';
import librariesData from '../data/libraries.json';
import type { Library } from '../types';

const libraries = librariesData as Library[];

export default function DiscoveryPage() {
  const navigate = useNavigate();

  // Bestehende States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLibs, setSelectedLibs] = useState<string[]>([]);

  // NEUE States für die KI
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const categories = Array.from(new Set(libraries.map(lib => lib.category)));

  const filteredLibraries = useMemo(() => {
    return libraries.filter((lib) => {
      const matchesSearch = 
        lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lib.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? lib.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const toggleLibrarySelection = (slug: string) => {
    setSelectedLibs((prevSelected) => {
      if (prevSelected.includes(slug)) return prevSelected.filter((item) => item !== slug);
      return [...prevSelected, slug];
    });
  };

  const handleCompareClick = () => {
    const queryString = selectedLibs.join(',');
    navigate(`/compare?libs=${queryString}`);
  };

  // NEU: Logik für die Parameter-Tags
  const appendTagToPrompt = (tag: string) => {
    setAiPrompt(prev => prev ? `${prev} ${tag}` : tag);
  };

  // NEU: Die Funktion, die mit unserem Vercel-Backend spricht
  const askArchitectAI = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    setAiResponse(null); // Alte Antwort löschen

    try {
      // POST-Request an unsere eigene API (wird von Vercel lokal und live korrekt geroutet)
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: aiPrompt })
      });

      if (!res.ok) throw new Error('API Request failed');

      const data = await res.json();
      setAiResponse(data.recommendation);
    } catch (error) {
      console.error(error);
      setAiResponse('**Fehler:** Konnte keine Verbindung zum Architekten-Modell herstellen. Bitte überprüfe das Backend-Log.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PageLayout>
      <header className={styles.header}>
        <h1 className={styles.title}>Discovery</h1>
        <p className={styles.subtitle}>Finde und vergleiche die besten Werkzeuge für dein Projekt.</p>
        
        {/* --- NEU: AI Architect Section --- */}
        <section className={styles.aiSection}>
          <div className={styles.aiHeader}>
            <span style={{ fontSize: '1.5rem' }}>⚡️</span>
            <h2 className={styles.aiTitle}>Ask the Architect AI</h2>
          </div>
          
          <div className={styles.aiInputWrapper}>
            <textarea 
              className={styles.aiTextarea}
              placeholder="Beschreibe dein Projekt (z.B. 'Ich baue ein extrem schnelles Dashboard mit vielen Echtzeit-Daten...')"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            
            <div className={styles.aiControls}>
              {/* Die Struktur-Tags zum Anklicken */}
              <div className={styles.aiTagGroup}>
                <button className={styles.aiTagBtn} onClick={() => appendTagToPrompt('[Fokus: Bundle-Size]')}>+ Bundle-Size</button>
                <button className={styles.aiTagBtn} onClick={() => appendTagToPrompt('[Fokus: Security/0 CVEs]')}>+ Security</button>
                <button className={styles.aiTagBtn} onClick={() => appendTagToPrompt('[Typ: Backend]')}>+ Backend</button>
                <button className={styles.aiTagBtn} onClick={() => appendTagToPrompt('[Typ: Frontend]')}>+ Frontend</button>
              </div>

              <button 
                className={styles.aiSubmitBtn} 
                onClick={askArchitectAI}
                disabled={isGenerating || !aiPrompt.trim()}
              >
                {isGenerating ? 'Analysiere Architektur...' : 'Lösung generieren'}
              </button>
            </div>
          </div>

          {/* Die dynamische Antwortbox */}
          {aiResponse && (
            <div className={styles.aiResponseBox}>
              {/* ReactMarkdown parst den Text von Gemini in echtes HTML */}
              <ReactMarkdown>{aiResponse}</ReactMarkdown>
            </div>
          )}
        </section>
        {/* ------------------------------- */}

        <div className={styles.controls}>
          <input 
            type="text" 
            placeholder="Suche nach Namen oder Funktion..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />

          <div className={styles.filterGroup}>
            <button 
              className={selectedCategory === null ? `${styles.filterButton} ${styles.filterButtonActive}` : styles.filterButton}
              onClick={() => setSelectedCategory(null)}
            >Alle</button>
            {categories.map(category => (
              <button 
                key={category}
                className={selectedCategory === category ? `${styles.filterButton} ${styles.filterButtonActive}` : styles.filterButton}
                onClick={() => setSelectedCategory(category)}
              >{category}</button>
            ))}
          </div>
        </div>
      </header>

      <div className={styles.grid}>
        {filteredLibraries.map((lib) => {
          const isSelected = selectedLibs.includes(lib.slug);
          return (
            <article key={lib.id} className={`${styles.card} ${isSelected ? styles.cardActive : ''}`}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{lib.name}</h2>
                <span className={styles.categoryBadge}>{lib.category}</span>
              </div>
              <p className={styles.description}>{lib.description}</p>
              <div className={styles.metrics}>
                <div className={styles.metricItem}>
                  <span className={styles.metricValue}>{lib.bundle_size_kb} KB</span>
                  <span className={styles.metricLabel}>Größe</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricValue}>{lib.unresolved_cves}</span>
                  <span className={styles.metricLabel} style={{ color: lib.unresolved_cves > 0 ? 'var(--accent-danger)' : 'var(--text-muted)' }}>
                    CVEs
                  </span>
                </div>
              </div>
              
              <button 
                className={`${styles.cardActionBtn} ${isSelected ? styles.cardActionBtnActive : ''}`}
                onClick={() => toggleLibrarySelection(lib.slug)}
              >
                {isSelected ? '✓ Ausgewählt' : '+ Zum Vergleich'}
              </button>
            </article>
          );
        })}
      </div>

      {selectedLibs.length > 0 && (
        <div className={styles.stickyBar}>
          <span className={styles.stickyBarText}>
            {selectedLibs.length} {selectedLibs.length === 1 ? 'Library' : 'Libraries'} ausgewählt
          </span>
          <button className={styles.compareButton} onClick={handleCompareClick}>
            Jetzt vergleichen →
          </button>
        </div>
      )}
    </PageLayout>
  );
}