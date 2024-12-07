'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export function ElevenLabsWidget() {
    useEffect(() => {
        // Create and append the widget element if it doesn't exist
        if (!document.querySelector('elevenlabs-convai')) {
            const widget = document.createElement('elevenlabs-convai');
            widget.setAttribute('agent-id', 'UYJvsVnkn7JN4SfGvuBR');
            widget.style.position = 'fixed';
            widget.style.bottom = '20px';
            widget.style.right = '20px';
            widget.style.zIndex = '1000';
            document.body.appendChild(widget);
        }
    }, []);

    return (
        <Script
            src="https://elevenlabs.io/convai-widget/index.js"
            strategy="afterInteractive"
        />
    );
} 