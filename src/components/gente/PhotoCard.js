import { formatUsername } from '@/lib/utils';
import styles from './PhotoCard.module.css';

export default function PhotoCard({ photo, isLiked, onLikeToggle, onShowLikes, onDelete, currentUser }) {

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img
                    src={photo.imageUrl}
                    alt={photo.caption}
                    className={styles.image}
                />
                <div className={styles.tag}>{photo.eventTag}</div>
            </div>
            <div className={styles.content}>
                <p className={styles.caption}>{photo.caption}</p>
                <div className={styles.meta}>
                    <span className={styles.author}>{formatUsername(photo.author)}</span>
                    <span className={styles.date}>{photo.date}</span>
                </div>

                <div className={styles.footer}>
                    <div className={styles.likeContainer}>
                        <button
                            className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}
                            onClick={onLikeToggle}
                            aria-label={isLiked ? "Ya no me gusta" : "Me gusta"}
                            title={isLiked ? "Ya no me gusta" : "Me gusta"}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill={isLiked ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                        <span
                            className={`${styles.likeCount} ${currentUser?.id === photo.user_id ? styles.clickable : ''}`}
                            onClick={currentUser?.id === photo.user_id ? onShowLikes : undefined}
                            title={currentUser?.id === photo.user_id ? "Ver quién reaccionó" : undefined}
                        >
                            {photo.likes}
                        </span>
                    </div>

                    {currentUser?.id === photo.user_id && (
                        <button
                            className={styles.deleteBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('¿Estás seguro de que quieres eliminar esta foto? Esta acción no se puede deshacer.')) {
                                    onDelete(photo);
                                }
                            }}
                            title="Eliminar foto"
                            aria-label="Eliminar foto"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

