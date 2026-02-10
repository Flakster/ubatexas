'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatUsername } from '@/lib/utils';
import { isAdmin } from '@/lib/auth-utils';
import { getPendingPhotosCount } from '@/lib/galleries';
import styles from './Header.module.css';
import { useEffect } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const { user, signOut } = useAuth();

    useEffect(() => {
        const fetchPendingCount = async () => {
            if (isAdmin(user)) {
                const count = await getPendingPhotosCount();
                setPendingCount(count);
            } else {
                setPendingCount(0);
            }
        };
        fetchPendingCount();
    }, [user]);

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <div className={styles.logo}>
                    <Link href="/">
                        UBATEXAS <span style={{ color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>★</span>
                    </Link>
                </div>

                <div className={styles.navActions}>
                    {user && (
                        <span className={styles.mobileUsername}>
                            {formatUsername(user.user_metadata?.display_name)}
                        </span>
                    )}
                    <button
                        className={styles.menuToggle}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                    <ul className={styles.navList}>
                        <li onClick={() => setIsMenuOpen(false)}><Link href="/agenda">Agenda</Link></li>
                        <li onClick={() => setIsMenuOpen(false)}><Link href="/gente">Gente</Link></li>
                        <li><Link href="/territorio" onClick={() => setIsMenuOpen(false)}>Territorio</Link></li>
                        <li><Link href="/negocios" onClick={() => setIsMenuOpen(false)}>Negocios</Link></li>
                        {isAdmin(user) && (
                            <li className={styles.adminLink} onClick={() => setIsMenuOpen(false)}>
                                <Link href="/admin/moderacion">
                                    Moderación
                                    {pendingCount > 0 && (
                                        <span className={styles.badge}>{pendingCount}</span>
                                    )}
                                </Link>
                            </li>
                        )}
                        <li>
                            {user ? (
                                <div className={styles.userInfo}>
                                    <span className={styles.desktopUsername}>
                                        {formatUsername(user.user_metadata?.display_name)}
                                    </span>
                                    <button onClick={() => { signOut(); setIsMenuOpen(false); }} className={styles.authBtn}>
                                        Salir
                                    </button>
                                </div>
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
