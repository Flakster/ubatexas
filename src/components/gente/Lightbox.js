import { useEffect } from 'react';
import { formatUsername } from '@/lib/utils';
import styles from './Lightbox.module.css';

export default function Lightbox({ photo, onClose }) {
    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!photo) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                <div className={styles.imageContainer}>
                    <img src={photo.imageUrl} alt={photo.caption} className={styles.image} />
                </div>
                <div className={styles.info}>
                    <span className={styles.tag}>{photo.eventTag}</span>
                    <p className={styles.caption}>{photo.caption}</p>
                    <div className={styles.meta}>
                        <span className={styles.author}>Publicado por {formatUsername(photo.author)}</span>
                        <span className={styles.date}>{photo.date}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
