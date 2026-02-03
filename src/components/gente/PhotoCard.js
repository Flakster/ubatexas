import styles from './PhotoCard.module.css';

export default function PhotoCard({ photo }) {
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
                    <span className={styles.author}>@{photo.author}</span>
                    <span className={styles.date}>{photo.date}</span>
                </div>
            </div>
        </div>
    );
}
