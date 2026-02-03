'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, signOut } = useAuth();

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <div className={styles.logo}>
                    <Link href="/">
                        UBATEXAS <span style={{ color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>★</span>
                    </Link>
                </div>

                <button
                    className={styles.menuToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                    <ul className={styles.navList}>
                        <li onClick={() => setIsMenuOpen(false)}><Link href="/agenda">Agenda</Link></li>
                        <li><Link href="/territorio" onClick={() => setIsMenuOpen(false)}>Territorio</Link></li>
                        <li><Link href="/negocios" onClick={() => setIsMenuOpen(false)}>Negocios</Link></li>
                        <li>
                            {user ? (
                                <button onClick={() => { signOut(); setIsMenuOpen(false); }} className={styles.authBtn}>
                                    Salir
                                </button>
                            ) : (
                                <Link href="/login" onClick={() => setIsMenuOpen(false)} className={styles.authBtn}>
                                    Entrar
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
