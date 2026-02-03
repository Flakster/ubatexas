'use client';

import { useState } from 'react';
import PhotoCard from './PhotoCard';
import Lightbox from './Lightbox';
import styles from './GalleryGrid.module.css';

export default function GalleryGrid({ photos }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    if (!photos || photos.length === 0) {
        return <p className={styles.empty}>No hay fotos publicadas aún.</p>;
    }

    return (
        <>
            <div className={styles.grid}>
                {photos.map((photo) => (
                    <div
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        style={{ cursor: 'pointer' }}
                    >
                        <PhotoCard photo={photo} />
                    </div>
                ))}
            </div>

            {selectedPhoto && (
                <Lightbox
                    photo={selectedPhoto}
                    onClose={() => setSelectedPhoto(null)}
                />
            )}
        </>
    );
}
