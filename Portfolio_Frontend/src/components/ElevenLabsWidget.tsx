import React, { useEffect, useRef } from 'react';

interface ElevenLabsWidgetProps {
    agentId?: string;
}

export const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ agentId }) => {
    const finalAgentId = agentId || import.meta.env.VITE_ELEVENLABS_AGENT_ID || 'agent_6301m723s4xaf2pajqxd8cmdp0g6';
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Prevent duplicate script injection
        const SCRIPT_ID = 'elevenlabs-convai-script';
        if (!document.getElementById(SCRIPT_ID)) {
            const script = document.createElement('script');
            script.id = SCRIPT_ID;
            script.src = 'https://elevenlabs.io/convai-widget/index.js';
            script.async = true;
            script.type = 'text/javascript';
            document.body.appendChild(script);
        }

        // Mount the custom web component dynamically
        if (containerRef.current && finalAgentId) {
            containerRef.current.innerHTML = '';
            const widgetEl = document.createElement('elevenlabs-convai');
            widgetEl.setAttribute('agent-id', finalAgentId);
            containerRef.current.appendChild(widgetEl);
        }
    }, [finalAgentId]);

    if (!finalAgentId) return null;

    return <div ref={containerRef} className="elevenlabs-widget-container" />;
};

export default ElevenLabsWidget;
