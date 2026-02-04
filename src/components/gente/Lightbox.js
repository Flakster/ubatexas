import { useEffect, useState } from 'react';
import { formatUsername } from '@/lib/utils';
import styles from './Lightbox.module.css';

export default function Lightbox({ photo, onClose }) {
    const [shareStatus, setShareStatus] = useState(null);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}?photo=${photo.id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Foto de ${photo.author} en Ubatexas`,
                    text: photo.caption,
                    url: shareUrl,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback for desktop: copy to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl);
                setShareStatus('¡Enlace copiado!');
                setTimeout(() => setShareStatus(null), 3000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

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
                        <div className={styles.metaLeft}>
                            <span className={styles.author}>Publicado por {formatUsername(photo.author)}</span>
                            <span className={styles.date}>{photo.date}</span>
                        </div>
                        <div className={styles.sharing}>
                            <button
                                className={styles.shareBtn}
                                onClick={handleShare}
                                title="Compartir enlace"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                    <polyline points="16 6 12 2 8 6" />
                                    <line x1="12" y1="2" x2="12" y2="15" />
                                </svg>
                                {shareStatus || 'Compartir'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
