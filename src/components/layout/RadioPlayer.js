'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './RadioPlayer.module.css';

export default function RadioPlayer() {
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(false); // Default to false
    const widgetContainerRef = useRef(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        setIsMounted(true);

        // Función para verificar el estado de la radio
        const checkStatus = async () => {
            try {
                // Consultamos nuestra propia API (Proxy) para evitar CORS y problemas de 404
                const res = await fetch('/api/radio/status', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setIsOnline(data.online);
                }
            } catch (error) {
                console.error('Error checking radio status:', error);
            }
        };

        checkStatus();

        // Verificar cada 1 minuto por si la transmisión inicia/termina
        const interval = setInterval(checkStatus, 1 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isMounted && isOnline && widgetContainerRef.current && !hasInitialized.current) {
            // Código exacto proporcionado por el usuario
            const widgetContent = `
                <div data-type="newStreamPlayer" 
                     data-publicToken="dd80389f-b0b5-4095-96e1-ee5921017e50" 
                     data-theme="light" 
                     data-color="e81e4d" 
                     data-channelId="" 
                     data-rendered="false" 
                     class="cstrEmbed">
                    <a href="https://www.caster.fm">Shoutcast Hosting</a> 
                    <a href="https://www.caster.fm">Stream Hosting</a> 
                    <a href="https://www.caster.fm">Radio Server Hosting</a>
                </div>
            `;

            widgetContainerRef.current.innerHTML = widgetContent;

            const script = document.createElement('script');
            script.src = "https://cdn.cloud.caster.fm/widgets/embed.js";
            script.async = true;
            document.body.appendChild(script);

            hasInitialized.current = true;
        }
    }, [isMounted, isOnline]);

    if (!isMounted || !isOnline) return null;

    return (
        <div className={styles.container}>
            {/* 
                El Popover siempre está en el DOM ("display: flex" o similar)
                pero se mueve fuera de la pantalla cuando está cerrado.
                Esto permite que el script de Caster.fm lo inicialice correctamente.
            */}
            <div className={`${styles.popover} ${isOpen ? styles.popoverOpen : styles.popoverClosed}`}>
                <div className={styles.header}>
                    <h3>RADIO UBATEXAS ★</h3>
                    <button className={styles.close} onClick={() => setIsOpen(false)} title="Minimizar">✕</button>
                </div>

                <div className={styles.playerArea}>
                    <div
                        ref={widgetContainerRef}
                        className={styles.widgetContainer}
                    />
                </div>
            </div>

            {/* Botón Flotante */}
            <button
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Minimizar Radio" : "Abrir Radio"}
            >
                <span className={styles.liveBadge}>LIVE</span>
                <span className={styles.triggerIcon}>{isOpen ? '▼' : '📻'}</span>
            </button>
        </div>
    );
}
