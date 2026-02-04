'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { formatUsername } from '@/lib/utils';
import { containsProfanity } from '@/lib/moderation';
import styles from './UploadForm.module.css';

// Utility to compress image on client side
export const compressImage = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Max dimensions (e.g., 1600px)
                const MAX_WIDTH = 1600;
                const MAX_HEIGHT = 1600;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob with 0.7 quality
                canvas.toBlob((blob) => {
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    resolve(compressedFile);
                }, 'image/jpeg', 0.7);
            };
        };
    });
};

export default function UploadForm({ onSubmit, compressImage: compressFn = compressImage }) {
    const router = useRouter();
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        caption: '',
        eventTag: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Por favor selecciona una foto.');
            return;
        }

        if (containsProfanity(formData.eventTag) || containsProfanity(formData.caption)) {
            alert('Lo sentimos, tu descripción o etiqueta contiene lenguaje no permitido. Por favor usa un lenguaje respetuoso.');
            return;
        }

        setLoading(true);
        try {
            // Compress image before upload using the injected function
            const compressedFile = await compressFn(file);
            console.log(`Original: ${(file.size / 1024 / 1024).toFixed(2)}MB, Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

            const data = new FormData();
            data.append('file', compressedFile);
            data.append('caption', formData.caption);
            data.append('eventTag', formData.eventTag);

            const result = await onSubmit(data); // Pass FormData to server action

            if (result?.error) {
                alert(`Hubo un error al subir la foto: ${result.error}`);
                setLoading(false);
                return;
            }

            setLoading(false);
            router.push('/gente');
        } catch (error) {
            console.error('Error uploading:', error);
            // Show the actual error message if possible
            const errorMsg = error.message || 'Error desconocido';
            alert(`Hubo un error al subir la foto: ${errorMsg}`);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const currentAuthor = formatUsername(user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Usuario');

    return (
        <form className={styles.form} onSubmit={handleSubmit} role="form">
            <div className={styles.group}>
                <label htmlFor="file">Foto</label>
                <input
                    type="file"
                    id="file"
                    name="file"
                    accept="image/*"
                    required
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <p className={styles.hint}>* Sube una foto en formato JPG o PNG.</p>
            </div>

            <div className={styles.group}>
                <label htmlFor="caption">Descripción / Pie de foto</label>
                <textarea
                    id="caption"
                    name="caption"
                    required
                    rows="3"
                    value={formData.caption}
                    onChange={handleChange}
                    placeholder="¿Qué está pasando en la foto?"
                />
            </div>

            <div className={styles.row}>
                <div className={styles.group}>
                    <label htmlFor="eventTag">Evento / Lugar</label>
                    <input
                        type="text"
                        id="eventTag"
                        name="eventTag"
                        required
                        value={formData.eventTag}
                        onChange={handleChange}
                        placeholder="Ej: Fiestas del Pueblo"
                    />
                </div>

                <div className={styles.group}>
                    <label>Publicando como</label>
                    <div style={{
                        padding: '0.75rem',
                        background: 'var(--color-bg-alt)',
                        borderRadius: '4px',
                        fontWeight: '600',
                        color: 'var(--color-primary)',
                        border: '1px solid var(--color-border)'
                    }}>
                        {currentAuthor}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Vinculado a tu cuenta verificada.
                    </p>
                </div>
            </div>

            <button type="submit" className="btn btn-accent" disabled={loading}>
                {loading ? 'Subiendo...' : 'Publicar Foto'}
            </button>
        </form>
    );
}
