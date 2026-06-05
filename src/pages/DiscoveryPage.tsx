import PageLayout from '../components/PageLayout';
import styles from './DiscoveryPage.module.css';

export default function DiscoveryPage() {
  return (
    <PageLayout>
      <h1 className={styles.h1}>Discovery Page</h1>
      <p>This is the discovery page. Here you can discover new JavaScript libraries.</p>
    </PageLayout>
  );
}