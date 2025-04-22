import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { Link } from "react-router-dom";

import styles from './error.module.scss';

const NavPanel : React.FC = () => {

  return (
    <div className={styles.errorPanel}>
      <h1>Error</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <p><Link to="/" className={styles.btn}>Back</Link></p>
    </div>
  )
}

export default NavPanel;
