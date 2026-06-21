import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import styles from './moduleStyles/ComparePage.module.css';
import librariesData from '../data/libraries.json';
import type { Library } from '../types';

const allLibraries = librariesData as Library[];

export default function ComparePage() {
  // 1. Den Hook initialisieren, um Zugriff auf die URL-Parameter zu bekommen
  const [searchParams] = useSearchParams();
  
  // 2. Den Wert hinter "?libs=" aus der URL extrahieren (z.B. "zustand,redux-toolkit")
  const libsParam = searchParams.get('libs');

  // 3. Die Datenmatrix dynamisch berechnen
  // useMemo sorgt dafür, dass diese Berechnung nur stattfindet, wenn sich die URL ändert.
  const selectedLibraries = useMemo(() => {
    // Wenn kein Parameter existiert, geben wir ein leeres Array zurück
    if (!libsParam) return [];
    
    // Den kommagetrennten String in ein echtes Array umwandeln: ['zustand', 'redux-toolkit']
    const slugs = libsParam.split(',');
    
    // Wir filtern unsere gigantische JSON-Datei und behalten nur die Libraries, 
    // deren Slug in der URL vorkommt.
    return allLibraries.filter(lib => slugs.includes(lib.slug));
  }, [libsParam]);

  // ==========================================
  // 4. EDGE CASE: Der "Empty State"
  // ==========================================
  if (selectedLibraries.length === 0) {
    return (
      <PageLayout>
        <header className={styles.header}>
          <Link to="/discover" className={styles.backLink}>
            ← Zurück zur Übersicht
          </Link>
          <h1 className={styles.title}>Keine Libraries ausgewählt</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Bitte wähle auf der Discovery-Seite mindestens eine Library aus, um den Vergleich zu starten.
          </p>
        </header>
      </PageLayout>
    );
  }

  // ==========================================
  // 5. DER REGULÄRE RENDER: Die Matrix
  // ==========================================
  return (
    <PageLayout>
      <header className={styles.header}>
        <Link to="/discover" className={styles.backLink}>
          ← Zurück zur Übersicht
        </Link>
        <h1 className={styles.title}>Side-by-Side Vergleich</h1>
        <p>Gegenüberstellung der technischen Spezifikationen und Security-Metriken.</p>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.compareTable}>
          <thead>
            <tr>
              <th className={styles.rowLabel}></th>
              {/* Spaltenköpfe dynamisch aus der URL generieren */}
              {selectedLibraries.map(lib => (
                <th key={lib.id}>{lib.name}</th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            <tr>
              <td className={styles.rowLabel}>Kategorie</td>
              {selectedLibraries.map(lib => (
                <td key={`cat-${lib.id}`}>{lib.category}</td>
              ))}
            </tr>

            <tr>
              <td className={styles.rowLabel}>Bundle Size (minified + gzipped)</td>
              {selectedLibraries.map(lib => (
                <td key={`size-${lib.id}`} className={styles.metricValue}>
                  {lib.bundle_size_kb} KB
                </td>
              ))}
            </tr>

            <tr>
              <td className={styles.rowLabel}>Unresolved CVEs</td>
              {selectedLibraries.map(lib => (
                <td key={`cve-${lib.id}`} className={styles.metricValue}>
                  {lib.unresolved_cves === 0 ? (
                    <span className={styles.cveSuccess}>0 (Sicher)</span>
                  ) : (
                    <span className={styles.cveDanger}>{lib.unresolved_cves} Gefunden</span>
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td className={styles.rowLabel}>GitHub Stars</td>
              {selectedLibraries.map(lib => (
                <td key={`stars-${lib.id}`} className={styles.metricValue}>
                  {new Intl.NumberFormat('de-DE').format(lib.github_stars)}
                </td>
              ))}
            </tr>

            <tr>
              <td className={styles.rowLabel}>Architektur & Fokus</td>
              {selectedLibraries.map(lib => (
                <td key={`desc-${lib.id}`}>{lib.description}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}