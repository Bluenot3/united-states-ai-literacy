import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        background: '#F0F2F5',
        primaryColor: '#e0e5ec',
        primaryTextColor: '#1F2937',
        lineColor: '#7C3AED',
        textColor: '#4B5563',
        fontSize: '14px',
      }
    });
  }, []);

  useEffect(() => {
    // Resetting render state if chart changes allows for re-rendering
    if (hasRendered) setHasRendered(false);
  }, [chart]);

  useEffect(() => {
    if (containerRef.current && !hasRendered) {
      try {
        const id = `mermaid-` + Math.random().toString(36).substring(2, 9);
        mermaid.render(id, chart.trim()).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
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