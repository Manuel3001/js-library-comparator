import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import styles from './moduleStyles/ComparePage.module.css';
import librariesData from '../data/libraries.json';
import type { Library } from '../types';

const allLibraries = librariesData as Library[];

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const libsParam = searchParams.get('libs');

  const selectedLibraries = useMemo(() => {
    if (!libsParam) return [];
    const slugs = libsParam.split(',');
    return allLibraries.filter(lib => slugs.includes(lib.slug));
  }, [libsParam]);

  if (selectedLibraries.length === 0) {
    return (
      <PageLayout>
        <header className={styles.header}>
          <Link to="/discover" className={styles.backLink}>← Zurück zur Übersicht</Link>
          <h1 className={styles.title}>Keine Libraries ausgewählt</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Bitte wähle auf der Discovery-Seite mindestens eine Library aus, um den Vergleich zu starten.
          </p>
        </header>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <header className={styles.header}>
        <Link to="/discover" className={styles.backLink}>← Zurück zur Übersicht</Link>
        <h1 className={styles.title}>Side-by-Side Vergleich</h1>
        <p>Gegenüberstellung der technischen Spezifikationen und Security-Metriken.</p>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.compareTable}>
          <thead>
            <tr>
              <th className={styles.rowLabel}></th>
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
              <td className={styles.rowLabel}>Bundle Size</td>
              {selectedLibraries.map(lib => (
                <td key={`size-${lib.id}`} className={styles.metricValue}>
                  {lib.bundle_size_kb} KB
                </td>
              ))}
            </tr>

            <tr>
              <td className={styles.rowLabel}>Wöchentliche Downloads</td>
              {selectedLibraries.map(lib => (
                <td key={`downloads-${lib.id}`} className={styles.metricValue}>
                  {new Intl.NumberFormat('de-DE').format(lib.weekly_downloads)}
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
              <td className={styles.rowLabel}>Lizenz</td>
              {selectedLibraries.map(lib => (
                <td key={`license-${lib.id}`} className={styles.metricValue}>
                  {lib.license}
                </td>
              ))}
            </tr>

            <tr>
              <td className={styles.rowLabel}>Security Policy</td>
              {selectedLibraries.map(lib => (
                <td key={`sec-${lib.id}`}>
                  {lib.has_security_policy ? (
                    <span className={`${styles.badge} ${styles.badgeTrue}`}>Vorhanden</span>
                  ) : (
                    <span className={`${styles.badge} ${styles.badgeFalse}`}>Keine</span>
                  )}
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
              <td className={styles.rowLabel}>Vorteile (Pros)</td>
              {selectedLibraries.map(lib => (
                <td key={`pros-${lib.id}`}>
                  <ul className={`${styles.featureList} ${styles.proList}`}>
                    {lib.pros.map((pro, index) => (
                      <li key={index}>{pro}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            <tr>
              <td className={styles.rowLabel}>Nachteile (Cons)</td>
              {selectedLibraries.map(lib => (
                <td key={`cons-${lib.id}`}>
                  <ul className={`${styles.featureList} ${styles.conList}`}>
                    {lib.cons.map((con, index) => (
                      <li key={index}>{con}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            <tr>
              <td className={styles.rowLabel}>Code-Beispiel</td>
              {selectedLibraries.map(lib => (
                <td key={`code-${lib.id}`}>
                  <div className={styles.codeContainer}>
                    <pre className={styles.codeBlock}>
                      <code>{lib.code_example}</code>
                    </pre>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}