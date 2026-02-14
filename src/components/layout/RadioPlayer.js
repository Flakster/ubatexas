'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './RadioPlayer.module.css';

export default function RadioPlayer() {
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const widgetContainerRef = useRef(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && widgetContainerRef.current && !hasInitialized.current) {
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
                    <a href="https://www.caster.fm)Radio Server Hosting</a>
                </div>
            `;

            widgetContainerRef.current.innerHTML = widgetContent;

            // Inyección manual del script para asegurar que detecte el div recién insertado
            const script = document.createElement('script');
            script.src = "https://cdn.cloud.caster.fm/widgets/embed.js";
            script.async = true;
            document.body.appendChild(script);

            hasInitialized.current = true;
        }
    }, [isMounted]);

    if (!isMounted) return null;

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
