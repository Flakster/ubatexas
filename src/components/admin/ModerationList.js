'use client';

import { useState } from 'react';
import { approvePhotoAction, rejectPhotoAction } from '@/app/actions';
import { formatUsername } from '@/lib/utils';
import styles from './ModerationList.module.css';

export default function ModerationList({ initialPhotos }) {
    const [photos, setPhotos] = useState(initialPhotos);
    const [processingId, setProcessingId] = useState(null);

    const handleApprove = async (id) => {
        setProcessingId(id);
        try {
            await approvePhotoAction(id);
            setPhotos(photos.filter(p => p.id !== id));
        } catch (error) {
            alert('Error al aprobar: ' + error.message);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        if (!confirm('¿Seguro que quieres rechazar esta foto?')) return;
        setProcessingId(id);
        try {
            await rejectPhotoAction(id);
            setPhotos(photos.filter(p => p.id !== id));
        } catch (error) {
            alert('Error al rechazar: ' + error.message);
        } finally {
            setProcessingId(null);
        }
    };

    if (photos.length === 0) {
        return (
            <div className={styles.empty}>
                <p>No hay fotos pendientes de moderación. ✨</p>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {photos.map(photo => (
                <div key={photo.id} className={styles.card}>
                    <div className={styles.imageWrapper}>
                        <img src={photo.imageUrl} alt={photo.caption} />
                    </div>
                    <div className={styles.content}>
                        <p className={styles.author}>Enviada por: <strong>{photo.author ? formatUsername(photo.author) : 'Anónimo'}</strong></p>
                        <p className={styles.caption}>{photo.caption}</p>
                        <p className={styles.tag}>#{photo.eventTag}</p>
                        <div className={styles.actions}>
                            <button
                                onClick={() => handleApprove(photo.id)}
                                className={styles.approveBtn}
                                disabled={processingId === photo.id}
                            >
                                {processingId === photo.id ? '...' : 'Aprobar'}
                            </button>
                            <button
                                onClick={() => handleReject(photo.id)}
                                className={styles.rejectBtn}
                                disabled={processingId === photo.id}
                            >
                                {processingId === photo.id ? '...' : 'Rechazar'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
