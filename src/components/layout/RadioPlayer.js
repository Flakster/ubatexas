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
                const res = await fetch('https://www.caster.fm/api/get_status.php?p=dd80389f-b0b5-4095-96e1-ee5921017e50');
                if (res.ok) {
                    const data = await res.json();
                    setIsOnline(data.status === 'online');
                }
            } catch (error) {
                console.error('Error checking radio status:', error);
                // Si falla la API, por seguridad no mostramos nada o mantenemos el estado previo
            }
        };

        checkStatus();

        // Verificar cada 5 minutos por si la transmisión inicia/termina
        const interval = setInterval(checkStatus, 5 * 60 * 1000);
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
