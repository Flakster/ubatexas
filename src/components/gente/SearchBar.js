'use client';

import { useState, useEffect } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, placeholder = 'Buscar fotos...' }) {
    const [query, setQuery] = useState('');

    // Optional: Add debounce if filtering becomes heavy, 
    // but for local filtering it's usually instant.
    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(query);
        }, 300);

        return () => clearTimeout(handler);
    }, [query, onSearch]);

    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                    <button
                        className={styles.clearButton}
                        onClick={() => setQuery('')}
                        aria-label="Limpiar búsqueda"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
