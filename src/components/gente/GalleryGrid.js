'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import PhotoCard from './PhotoCard';
import Lightbox from './Lightbox';
import TagFilter from './TagFilter';
import styles from './GalleryGrid.module.css';

export default function GalleryGrid({ photos }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [activeTag, setActiveTag] = useState(null);

    // Sync URL with selection
    useEffect(() => {
        const photoId = searchParams.get('photo');
        if (photoId && photos) {
            const photo = photos.find(p => p.id.toString() === photoId);
            if (photo) {
                setSelectedPhoto(photo);
            }
        } else {
            setSelectedPhoto(null);
        }
    }, [searchParams, photos]);

    const handlePhotoSelect = (photo) => {
        const params = new URLSearchParams(searchParams);
        if (photo) {
            params.set('photo', photo.id);
        } else {
            params.delete('photo');
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    if (!photos || photos.length === 0) {
        return <p className={styles.empty}>No hay fotos publicadas aún.</p>;
    }

    // Extract unique tags and clean them
    const tags = Array.from(new Set(
        photos
            .map(p => p.eventTag?.trim())
            .filter(tag => tag && tag.length > 0)
    )).sort();

    // Filter photos based on active tag
    const filteredPhotos = activeTag
        ? photos.filter(p => p.eventTag?.trim() === activeTag)
        : photos;

    return (
        <>
            {tags.length > 0 && (
                <TagFilter
                    tags={tags}
                    activeTag={activeTag}
                    onTagChange={setActiveTag}
                />
            )}

            <div className={styles.grid}>
                {filteredPhotos.map((photo) => (
                    <div
                        key={photo.id}
                        onClick={() => handlePhotoSelect(photo)}
                        style={{ cursor: 'pointer' }}
                    >
                        <PhotoCard photo={photo} />
                    </div>
                ))}
            </div>

            {filteredPhotos.length === 0 && activeTag && (
                <p className={styles.empty}>No hay fotos para el tag #{activeTag}.</p>
            )}

            {selectedPhoto && (
                <Lightbox
                    photo={selectedPhoto}
                    onClose={() => handlePhotoSelect(null)}
                />
            )}
        </>
    );
}
