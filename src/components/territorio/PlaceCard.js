import styles from './PlaceCard.module.css';

export default function PlaceCard({ place }) {
    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img
                    src={place.imageUrl}
                    alt={place.title}
                    className={styles.image}
                />
                <div className={styles.vibe}>{place.vibe}</div>
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{place.title}</h3>
                    <span className={styles.price}>{place.priceLevel}</span>
                </div>
                <p className={styles.location}>📍 {place.location}</p>
                <p className={styles.description}>{place.description}</p>
                <button className={styles.cta}>Ver Experiencia</button>
            </div>
        </div>
    );
}
