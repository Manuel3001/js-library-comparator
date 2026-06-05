import PageLayout from '../components/PageLayout';
import styles from './ComparePage.module.css';

export default function ComparePage() {
  return (
    <PageLayout>
      <h1 className={styles.h1}>Compare Page</h1>
      <p>This is the compare page. Here you can compare different JavaScript libraries.</p>
    </PageLayout>
  );
}