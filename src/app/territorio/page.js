import { getPlaces } from '@/lib/places';
import PlaceCard from '@/components/territorio/PlaceCard';

export const dynamic = 'force-dynamic';

export default async function TerritorioPage() {
    const places = await getPlaces();

    return (
        <div className="container">
            <div style={{ padding: '4rem 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>El Territorio</h1>
                    <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                        Descubre las experiencias que definen nuestra identidad: desde hatos tradicionales hasta aventuras en la montaña.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {places.map((place) => (
                        <PlaceCard key={place.id} place={place} />
                    ))}
                </div>
            </div>
        </div>
    );
}
