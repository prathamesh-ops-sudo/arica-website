import React, { useEffect, useRef } from 'react';

interface EnergyBeamProps {
    projectId?: string;
    className?: string;
}

declare global {
    interface Window {
        UnicornStudio?: any;
        __unicornScriptLoaded?: boolean;
    }
}

const EnergyBeam: React.FC<EnergyBeamProps> = ({
    projectId = "hRFfUymDGOHwtFe7evR2",
    className = ""
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        // Guard against multiple inits for this container
        if (initializedRef.current) return;
        
        const initProject = () => {
            if (window.UnicornStudio && containerRef.current && !initializedRef.current) {
                initializedRef.current = true;
                window.UnicornStudio.init();
            }
        };
        
        // If script already loaded globally, just init
        if (window.__unicornScriptLoaded || window.UnicornStudio) {
            initProject();
            return;
        }

        // Check if script already exists in DOM
        const existingScript = document.querySelector('script[src*="unicornStudio"]');
        if (existingScript) {
            existingScript.addEventListener('load', initProject);
            return;
        }

        // Load script globally (singleton)
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.2/dist/unicornStudio.umd.js';
        script.async = true;

        script.onload = () => {
            window.__unicornScriptLoaded = true;
            initProject();
        };

        document.head.appendChild(script);
        
        // No cleanup - script is singleton and stays loaded
    }, [projectId]);

    return (
        <div 
            className={`relative w-full h-full bg-black overflow-hidden ${className}`}
            data-testid="container-energy-beam"
        >
            <div
                ref={containerRef}
                data-us-project={projectId}
                className="w-full h-full"
            />
        </div>
    );
};

export default EnergyBeam;
