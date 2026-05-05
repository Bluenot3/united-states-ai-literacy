import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';

const nodesData = [
    { id: 'start', label: 'Start', x: 50, y: 150 },
    { id: 'plan', label: 'Plan Generation', x: 250, y: 50 },
    { id: 'tool_call', label: 'Tool Call', x: 450, y: 50 },
    { id: 'evaluate', label: 'Evaluate', x: 250, y: 250 },
    { id: 'end', label: 'End', x: 450, y: 250 },
];

const edgesData = [
    { from: 'start', to: 'plan' },
    { from: 'plan', to: 'tool_call' },
    { from: 'tool_call', to: 'evaluate' },
    { from: 'evaluate', to: 'plan' },
    { from: 'evaluate', to: 'end' },
];

const LangGraphVisualizer: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const [activeNode, setActiveNode] = useState<string | null>(null);

    const handleNodeClick = (nodeId: string) => {
        setActiveNode(nodeId);
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Plan-Graph Simulator</h4>
            <div className="relative w-full h-80 bg-brand-bg rounded-lg shadow-neumorphic-in overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 500 300">
                    <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
                            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
                        </marker>
                    </defs>
                    {edgesData.map(edge => {
                        const fromNode = nodesData.find(n => n.id === edge.from)!;
                        const toNode = nodesData.find(n => n.id === edge.to)!;
                        return (
                            <line
                                key={`${edge.from}-${edge.to}`}
                                x1={fromNode.x} y1={fromNode.y}
                                x2={toNode.x} y2={toNode.y}
                                stroke="#a78bfa"
                                strokeWidth="2"
                                markerEnd="url(#arrow)"
                            />
                        );
                    })}
                    {nodesData.map(node => (
                        <g key={node.id} transform={`translate(${node.x},${node.y})`} onClick={() => handleNodeClick(node.id)} className="cursor-pointer">
                            <circle cx="0" cy="0" r="20" fill={activeNode === node.id ? '#8b5cf6' : '#c4b5fd'} stroke="#8b5cf6" strokeWidth="2" />
                            <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="10px" fontWeight="bold">{node.label.split(' ')[0]}</text>
                        </g>
                    ))}
                </svg>
            </div>
             <p className="text-center text-brand-text-light mt-4 text-sm">Click nodes to see their (hypothetical) details. This visualizes a reasoning loop.</p>
        </div>
    );
};

export default LangGraphVisualizer;
