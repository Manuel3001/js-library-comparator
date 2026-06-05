  import PageLayout from '../components/PageLayout';
  import styles from './moduleStyles/HomePage.module.css';

export default function HomePage() {
  return (
    <PageLayout>
      <h1 className={styles.h1}>Home Page</h1>
      <p>Welcome to the home page. Use the navigation links to explore the discovery and compare pages.</p>
    </PageLayout>
  );
}