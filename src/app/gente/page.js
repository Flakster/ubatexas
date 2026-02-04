import Link from 'next/link';
import { getPhotos } from '@/lib/galleries';
import GalleryGrid from '@/components/gente/GalleryGrid';

export const dynamic = 'force-dynamic';

export default async function GentePage() {
    const photos = await getPhotos();

    return (
        <div className="container">
            <div style={{ padding: '4rem 0' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1.5rem'
                }}>
                    <div style={{ minWidth: '200px', flex: '1' }}>
                        <h1 style={{ color: 'var(--color-primary)', margin: 0, fontSize: 'clamp(1.8rem, 5vw, 2.5rem)' }}>
                            Gente & Estilo
                        </h1>
                        <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>La pasarela digital de la provincia.</p>
                    </div>
                    <Link href="/gente/nuevo" className="btn btn-accent" style={{ whiteSpace: 'nowrap' }}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                        Compartir Foto
                    </Link>
                </div>

                <GalleryGrid photos={photos} />
            </div>
        </div>
    );
}
