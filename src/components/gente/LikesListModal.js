'use client';

import { useEffect, useRef } from 'react';
import styles from './LikesListModal.module.css';

export default function LikesListModal({ users, onClose }) {
    const modalRef = useRef(null);

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Close on outside click
    const handleOverlayClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal} ref={modalRef}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
                    &times;
                </button>
                <h3 className={styles.title}>Le gusta a...</h3>

                {users && users.length > 0 ? (
                    <ul className={styles.list}>
                        {users.map((user, index) => (
                            <li key={index} className={styles.item}>
                                {user}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.empty}>Nadie ha reaccionado aún.</p>
                )}
            </div>
        </div>
    );
}
