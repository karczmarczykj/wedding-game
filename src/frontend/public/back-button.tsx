import React from 'react';
import type { SVGProps } from 'react';
import styles from './back-button.module.scss';
import { useNavigate } from 'react-router-dom';

export default function BackButton(props: SVGProps<SVGSVGElement>) {
  const navigate = useNavigate();

  return (<svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate('/')} className={styles.backButton} viewBox="0 0 24 24" {...props}><path fill="#277ce8" d="M4.4 7.4L6.8 4h2.5L7.2 7h6.3a6.5 6.5 0 0 1 0 13H9l1-2h3.5a4.5 4.5 0 1 0 0-9H7.2l2.1 3H6.8L4.4 8.6L4 8z"></path></svg>);
}
