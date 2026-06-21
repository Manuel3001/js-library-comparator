import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // NEU: Für den URL-Wechsel
import PageLayout from '../components/PageLayout';
import styles from './moduleStyles/DiscoveryPage.module.css';
import librariesData from '../data/libraries.json';
import type { Library } from '../types';

const libraries = librariesData as Library[];

export default function DiscoveryPage() {
  const navigate = useNavigate(); // Initialisiert das Routing-Werkzeug

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // NEU: Der State für die ausgewählten Libraries (speichert die Slugs als Strings)
  const [selectedLibs, setSelectedLibs] = useState<string[]>([]);

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

  // NEU: Logik zum Hinzufügen/Entfernen einer Library
  const toggleLibrarySelection = (slug: string) => {
    setSelectedLibs((prevSelected) => {
      // Wenn der Slug schon im Array ist -> entferne ihn
      if (prevSelected.includes(slug)) {
        return prevSelected.filter((item) => item !== slug);
      }
      // Ansonsten -> füge ihn hinzu
      return [...prevSelected, slug];
    });
  };

  // NEU: Der Klick auf den finalen "Vergleichen"-Button
  const handleCompareClick = () => {
    // Wir verbinden das Array zu einem Text: ['zustand', 'redux'] -> "zustand,redux"
    const queryString = selectedLibs.join(',');
    // Schickt den Nutzer zur Compare-Seite und hängt die Auswahl als URL-Parameter an
    navigate(`/compare?libs=${queryString}`);
  };

  return (
    <PageLayout>
      <header className={styles.header}>
        <h1 className={styles.title}>Discovery</h1>
        <p className={styles.subtitle}>Finde und vergleiche die besten Werkzeuge für dein Projekt.</p>
        
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
            >
              Alle
            </button>
            {categories.map(category => (
              <button 
                key={category}
                className={selectedCategory === category ? `${styles.filterButton} ${styles.filterButtonActive}` : styles.filterButton}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className={styles.grid}>
        {filteredLibraries.map((lib) => {
          // Prüfen, ob DIESE Library aktuell ausgewählt ist
          const isSelected = selectedLibs.includes(lib.slug);

          return (
            // Dynamische Klasse für den blauen Rand der Karte
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
              
              {/* NEU: Der Action-Button */}
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

      {/* NEU: Die Sticky Bottom Bar (wird nur gerendert, wenn Array > 0 ist) */}
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