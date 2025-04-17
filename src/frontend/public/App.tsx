import React from 'react';
import styles from './App.module.scss';

const App: React.FC = () => {
  return (
    <div>
      <h1>Hello, world! </h1>
      <p className={styles.some}>Root public content</p>
    </div>
  );
};

export default App;

