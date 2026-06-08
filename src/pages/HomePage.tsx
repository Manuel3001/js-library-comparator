  import PageLayout from '../components/PageLayout';
  import styles from './moduleStyles/HomePage.module.css';
  import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <PageLayout>
      <header className={styles.header}>
      <h1 className={styles.title}>Javascript Fatigue is ending here.</h1>
      <p className={styles.subtitle}>Compare the bundle-sizes, security track records, and performance metrics of the most popular JavaScript libraries.</p>
      <div className={styles.buttonGroup}>
      <Link to="/discovery" className={styles.primaryButton}>Discover your Library</Link>
      <Link to="/compare" className={styles.secondaryButton}>Compare Libraries</Link>
      </div>
      </header>
    </PageLayout>
  );
}