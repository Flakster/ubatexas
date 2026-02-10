import Link from 'next/link';

export const metadata = {
    title: 'Términos y Condiciones | Ubatexas',
    description: 'Términos de uso, política de privacidad y tratamiento de datos personales de Ubatexas.',
};

export default function TerminosPage() {
    return (
        <main className="container-narrow" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
            <h1 className="title-serif" style={{ marginBottom: '2rem' }}>Términos y Condiciones</h1>

            <section className="legal-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.7' }}>
                <p>
                    Bienvenido a **Ubatexas**. Al acceder y utilizar este sitio web, aceptas cumplir con los siguientes
                    términos y condiciones, diseñados para proteger tanto a la comunidad de Ubaté como a los creadores de contenido.
                </p>

                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>1. Propiedad del Contenido</h2>
                    <p>
                        Al subir fotografías a la sección de "Gente" o cualquier otra área de Ubatexas, declaras que:
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Eres el autor original de la imagen o posees los derechos legales para compartirla.</li>
                            <li>La imagen no infringe derechos de autor ni la privacidad de terceros.</li>
                            <li>No contiene contenido ofensivo, ilegal o inapropiado.</li>
                        </ul>
                    </p>
                </div>

                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>2. Licencia de Uso</h2>
                    <p>
                        Mantienes la autoría de tus fotos. Sin embargo, al publicarlas en Ubatexas, nos concedes una
                        licencia gratuita, no exclusiva y mundial para mostrar, distribuir y promocionar dicho contenido
                        dentro de nuestra plataforma y redes sociales oficiales asociadas a Ubatexas.
                    </p>
                </div>

                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>3. Política de Optimización y Permanencia</h2>
                    <p>
                        Ubatexas es un espacio comunitario dinámico. Para asegurar que los contenidos más relevantes tengan visibilidad
                        y optimizar el rendimiento del servidor, aplicamos la siguiente política:
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li><strong>Archivado automático:</strong> Las fotos con más de 7 días y 0 "likes" podrán ser ocultadas del sitio público.</li>
                            <li><strong>Eliminación definitiva:</strong> Las imágenes con antigüedad superior a 30 días que no alcancen un mínimo de interacción (5 likes) podrán ser removidas permanentemente de nuestros servidores sin previo aviso.</li>
                        </ul>
                    </p>
                </div>

                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>4. Tratamiento de Datos Personales (Habeas Data)</h2>
                    <p>
                        En cumplimiento de la **Ley 1581 de 2012 de Colombia**, informamos que:
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Tus datos (correo electrónico y nombre de usuario) se capturan exclusivamente para la gestión de tu cuenta y la prevención de spam.</li>
                            <li>No compartiremos tus datos con terceros con fines comerciales.</li>
                            <li>Como usuario, tienes derecho a conocer, actualizar y solicitar la eliminación de tus datos en cualquier momento a través de nuestras opciones de perfil.</li>
                        </ul>
                    </p>
                </div>

                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>5. Moderación</h2>
                    <p>
                        Nos reservamos el derecho de remover cualquier contenido que no se alinee con el propósito de Ubatexas
                        de resaltar lo mejor de la provincia, o que pueda resultar perjudicial para la convivencia ciudadana.
                    </p>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <Link href="/login" className="btn btn-primary">
                        Volver al inicio
                    </Link>
                </div>
            </section>
        </main>
    );
}
