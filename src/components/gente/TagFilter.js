'use client';

import styles from './TagFilter.module.css';

export default function TagFilter({ tags, activeTag, onTagChange }) {
    return (
        <div className={styles.container}>
            <button
                className={`${styles.tag} ${activeTag === null ? styles.active : ''}`}
                onClick={() => onTagChange(null)}
            >
                Todos
            </button>
            {tags.map((tag) => (
                <button
                    key={tag}
                    className={`${styles.tag} ${activeTag === tag ? styles.active : ''}`}
                    onClick={() => onTagChange(tag)}
                >
                    #{tag}
                </button>
            ))}
        </div>
    );
}
