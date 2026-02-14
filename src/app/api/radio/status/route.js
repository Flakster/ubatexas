import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Consultamos directamente el servidor Icecast de Caster.fm
        // Esta URL fue identificada como el origen real del stream de Ubatexas
        const response = await fetch('http://shaincast.caster.fm:41582/status-json.xsl', {
            cache: 'no-store'
        });

        if (!response.ok) {
            return NextResponse.json({ online: false, error: 'Source unreachable' }, { status: 200 });
        }

        const data = await response.json();

        // En Icecast, si hay una fuente (source), significa que hay transmisión activa
        const isOnline = !!data.icestats.source;

        return NextResponse.json({
            online: isOnline,
            listeners: data.icestats.source?.listeners || 0,
            now_playing: data.icestats.source?.title || 'Ubatexas Radio'
        });
    } catch (error) {
        console.error('Radio Status API Error:', error);
        return NextResponse.json({ online: false, error: error.message }, { status: 200 });
    }
}
