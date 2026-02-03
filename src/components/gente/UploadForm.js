'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './UploadForm.module.css';

export default function UploadForm({ onSubmit }) {
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

        setLoading(true);
        try {
            const data = new FormData();
            data.append('file', file);
            data.append('caption', formData.caption);
            data.append('eventTag', formData.eventTag);

            await onSubmit(data); // Pass FormData to server action
            setLoading(false);
            router.push('/gente');
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Hubo un error al subir la foto. Intenta de nuevo.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const currentAuthor = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Usuario';

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
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
                        background: '#f9f9f9',
                        borderRadius: '4px',
                        fontWeight: '600',
                        color: 'var(--color-primary)',
                        border: '1px solid var(--color-border)'
                    }}>
                        @{currentAuthor}
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
