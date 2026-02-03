import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>
                <div className={styles.branding}>
                    <h3>UBATEXAS</h3>
                    <p>El Escenario de la Provincia</p>
                </div>
                <div className={styles.links}>
                    <div>
                        <h4>Explorar</h4>
                        <ul>
                            <li>Agenda</li>
                            <li>Gente</li>
                            <li>Territorio</li>
                        </ul>
                    </div>
                    <div>
                        <h4>Comunidad</h4>
                        <ul>
                            <li>Anunciar aquí</li>
                            <li>Contacto</li>
                            <li>Aviso Legal</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.copyright}>
                    &copy; {new Date().getFullYear()} Ubatexas. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
