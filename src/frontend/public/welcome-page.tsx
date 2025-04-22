import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import type { SVGProps } from 'react';

import styles from './welcome-page.module.scss';

export function WeddingIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" {...props}><path fill="#bcbec0" d="M20 2h-1V1a1 1 0 1 0-2 0v1h-1a1 1 0 1 0 0 2h1v6a1 1 0 1 0 2 0V4h1a1 1 0 1 0 0-2"></path><path fill="#f4abba" d="m18 9l-5.143 4H13v9h10v-9h.143z"></path><path fill="#662113" d="M19.999 15A2 2 0 0 0 16 15v7h4z"></path><path fill="#f4abba" d="M17.999 18L4 26v9a1 1 0 0 0 1 1h26a1 1 0 0 0 1-1v-9z"></path><path fill="#dd2e44" d="M31.998 27a1 1 0 0 1-.495-.132l-13.504-7.717l-13.504 7.717a.999.999 0 1 1-.992-1.736l14-8a1 1 0 0 1 .992 0l14 8A.998.998 0 0 1 31.998 27m-8.999-13a1 1 0 0 1-.624-.219l-4.376-3.5l-4.374 3.5a1 1 0 0 1-1.25-1.562l4.999-4a1 1 0 0 1 1.25 0l5.001 4A1 1 0 0 1 22.999 14"></path><path fill="#662113" d="M12.999 31A2 2 0 1 0 9 31v5h4zm7-2A2 2 0 0 0 16 29v7h4zm7 2A2 2 0 0 0 23 31v5h4z"></path><path fill="#dd2e44" d="M1 6c0-2.761 3.963-4 5 0c1.121-4 5-2.761 5 0c0 3-5 6-5 6S1 9 1 6m24 0c0-2.761 3.963-4 5 0c1.121-4 5-2.761 5 0c0 3-5 6-5 6s-5-3-5-6"></path></svg>);
}

const NavPanel : React.FC = () => {

  return (
    <div className={styles.navPanelContainer}>
      <h1>Magda & Jarek <br/> @e-oczepiny</h1>
      <WeddingIcon className={styles.icon} />
      <nav className={styles.navPanel}>
      <ul>
        <li><Link to="/groom" className={styles.btn}>Groom game</Link></li>
        <li><Link to="/bride" className={styles.btn}>Bride game</Link></li>
      </ul>
      </nav>
    </div>
  )
}

export default NavPanel;
