export default function NegociosPage() {
    return (
        <div className="container">
            <div style={{ padding: '4rem 0' }}>
                <h1 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Negocios & Oportunidades</h1>
                <p>El directorio comercial de la provincia.</p>
                <div style={{ marginTop: '2rem', padding: '2rem', border: '1px dashed var(--color-accent)' }}>
                    <h3>Destacados del Mes</h3>
                    <p>Espacio para patrocinadores y negocios locales.</p>
                    <button className="btn btn-accent" style={{ marginTop: '1rem' }}>Anuncia tu negocio</button>
                </div>
            </div>
        </div>
    );
}
