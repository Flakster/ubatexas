import { formatUsername } from '@/lib/utils';
import styles from './PhotoCard.module.css';

export default function PhotoCard({ photo, isLiked, onLikeToggle, onShowLikes, currentUser }) {

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
                </div>
            </div>
        </div>
    );
}

