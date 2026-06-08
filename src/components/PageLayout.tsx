import React from 'react';
import styles from './PageLayout.module.css';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.pageWrapper}>{children}</div>;
}