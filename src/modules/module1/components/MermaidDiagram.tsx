
import React, { useEffect, useRef, useState } from 'react';

// Declare mermaid as a global variable
declare const mermaid: any;

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    // Resetting render state if chart changes allows for re-rendering
    if (hasRendered) setHasRendered(false);
  }, [chart]);

  useEffect(() => {
    if (containerRef.current && !hasRendered) {
      try {
        const id = `mermaid-` + Math.random().toString(36).substring(2, 9);
        mermaid.render(id, chart.trim(), (svgCode: string) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svgCode;
            setHasRendered(true);
          }
        });
      } catch (error) {
        if (containerRef.current) {
            containerRef.current.innerHTML = 'Error rendering diagram.';
        }
        console.error("Could not render Mermaid diagram:", error);
      }
    }
  }, [chart, hasRendered]);

  return (
    <div 
        ref={containerRef} 
        className="mermaid-container flex justify-center my-8 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in"
    >
        {/* Placeholder for diagram */}
    </div>
  );
};

export default MermaidDiagram;