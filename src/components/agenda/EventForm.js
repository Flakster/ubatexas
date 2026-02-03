'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './EventForm.module.css';

export default function EventForm({ onSubmit }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
        category: 'Fiesta'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
        router.push('/agenda');
        router.refresh(); // Refresh to show new data
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.group}>
                <label htmlFor="title">Nombre del Evento</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ej: Fiestas del Pueblo..."
                />
            </div>

            <div className={styles.row}>
                <div className={styles.group}>
                    <label htmlFor="date">Fecha</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.group}>
                    <label htmlFor="category">Categoría</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option>Fiesta</option>
                        <option>Exposición</option>
                        <option>Concierto</option>
                        <option>Deporte</option>
                        <option>Otro</option>
                    </select>
                </div>
            </div>

            <div className={styles.group}>
                <label htmlFor="location">Lugar</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ej: Plaza de Mercado"
                />
            </div>

            <div className={styles.group}>
                <label htmlFor="description">Descripción</label>
                <textarea
                    id="description"
                    name="description"
                    rows="4"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detalles del evento..."
                />
            </div>

            <button type="submit" className="btn btn-accent" disabled={loading}>
                {loading ? 'Guardando...' : 'Publicar Evento'}
            </button>
        </form>
    );
}
