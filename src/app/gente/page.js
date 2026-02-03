import Link from 'next/link';
import { getPhotos } from '@/lib/galleries';
import GalleryGrid from '@/components/gente/GalleryGrid';

export const dynamic = 'force-dynamic';

export default async function GentePage() {
    const photos = await getPhotos();

    return (
        <div className="container">
            <div style={{ padding: '4rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ color: 'var(--color-primary)', margin: 0 }}>Gente & Estilo</h1>
                        <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>La pasarela digital de la provincia.</p>
                    </div>
                    <Link href="/gente/nuevo" className="btn btn-accent">
                        📷 Subir Foto
                    </Link>
                </div>

                <GalleryGrid photos={photos} />
            </div>
        </div>
    );
}
