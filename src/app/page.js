
import Link from 'next/link';
import { Suspense } from 'react';
import GalleryGrid from '@/components/gente/GalleryGrid';
import { getEvents } from '@/lib/events';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';
export const metadata = {
  alternates: {
    canonical: '/',
  },
};

export default async function Home() {
  const events = await getEvents();
  const upcomingEvents = events.slice(0, 3);

  return (
    <>
      <div className={styles.main}>

        <section className={styles.hero}>

          <div className="container">
            <h1 className={styles.title}>
              <span className={styles.supertext}>Bienvenido a</span>
              <br />
              UBATEXAS <span style={{ color: 'var(--color-gold)', verticalAlign: 'middle', fontSize: '0.8em', whiteSpace: 'nowrap' }}>★</span>
            </h1>
            <p className={styles.subtitle}>
              El Escenario de la Provincia.
              <br />
              Donde la tradición se encuentra con el progreso.
            </p>
            <div className={styles.actions}>
              <Link href="/agenda" className="btn btn-accent">Ver Agenda 2026</Link>
              <Link href="/gente" className="btn">Galería de Gente</Link>
            </div>
          </div>
        </section>

        <section className={`container ${styles.section} `}>
          <div className={styles.sectionHeader}>
            <h2>Próximos Eventos</h2>
            <Link href="/agenda" className={styles.viewAll}>Ver todo &rarr;</Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <p className={styles.empty}>No hay eventos programados próximamente.</p>
          ) : (
            <div className={styles.eventGrid}>
              {upcomingEvents.map(event => (
                <div key={event.id} className={styles.eventCard}>
                  <div className={styles.eventDate}>
                    {new Date(event.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                  </div>
                  <div className={styles.eventContent}>
                    <span className={styles.eventCategory}>{event.category}</span>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <p className={styles.eventLocation}>📍 {event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
