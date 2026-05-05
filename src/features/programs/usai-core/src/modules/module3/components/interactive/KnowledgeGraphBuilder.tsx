import React, { useState, useCallback, useRef, useEffect } from 'react';

interface Node {
    id: string;
    type: 'person' | 'project' | 'idea' | 'meeting' | 'outcome';
    label: string;
    x: number;
    y: number;
}

interface Edge {
    id: string;
    from: string;
    to: string;
    relationship: string;
}

const NODE_CONFIGS: Record<string, { color: string; gradient: string; icon: string }> = {
    person: { color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', icon: '👤' },
    project: { color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', icon: '📁' },
    idea: { color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', icon: '💡' },
    meeting: { color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', icon: '📅' },
    outcome: { color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', icon: '🎯' }
};

const SAMPLE_NODES: Node[] = [
    { id: 'alice', type: 'person', label: 'Alice Chen', x: 180, y: 120 },
    { id: 'bob', type: 'person', label: 'Bob Martinez', x: 420, y: 100 },
    { id: 'zeus', type: 'project', label: 'Project Zeus', x: 300, y: 220 },
    { id: 'q3review', type: 'meeting', label: 'Q3 Review', x: 500, y: 200 },
    { id: 'failed', type: 'outcome', label: 'Failed', x: 420, y: 320 }
];

const SAMPLE_EDGES: Edge[] = [
    { id: 'e1', from: 'alice', to: 'zeus', relationship: 'leads' },
    { id: 'e2', from: 'bob', to: 'q3review', relationship: 'presented' },
    { id: 'e3', from: 'zeus', to: 'q3review', relationship: 'discussed in' },
    { id: 'e4', from: 'q3review', to: 'failed', relationship: 'resulted in' }
];

export const KnowledgeGraphBuilder: React.FC = () => {
    const [nodes, setNodes] = useState<Node[]>(SAMPLE_NODES);
    const [edges, setEdges] = useState<Edge[]>(SAMPLE_EDGES);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
    const [newNodeLabel, setNewNodeLabel] = useState('');
    const [newNodeType, setNewNodeType] = useState<Node['type']>('idea');
    const [newRelationship, setNewRelationship] = useState('relates to');
    const [draggedNode, setDraggedNode] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (connectingFrom && connectingFrom !== nodeId) {
            const newEdge: Edge = {
                id: `e${Date.now()}`,
                from: connectingFrom,
                to: nodeId,
                relationship: newRelationship
            };
            setEdges(prev => [...prev, newEdge]);
            setConnectingFrom(null);
        } else {
            setSelectedNode(nodeId === selectedNode ? null : nodeId);
        }
    };

    const handleAddNode = () => {
        if (!newNodeLabel.trim()) return;
        const newNode: Node = {
            id: `node${Date.now()}`,
            type: newNodeType,
            label: newNodeLabel,
            x: 150 + Math.random() * 300,
            y: 100 + Math.random() * 200
        };
        setNodes(prev => [...prev, newNode]);
        setNewNodeLabel('');
    };

    const handleDeleteNode = (nodeId: string) => {
        setNodes(prev => prev.filter(n => n.id !== nodeId));
        setEdges(prev => prev.filter(e => e.from !== nodeId && e.to !== nodeId));
        setSelectedNode(null);
    };

    const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const node = nodes.find(n => n.id === nodeId);
        if (node && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            setDraggedNode(nodeId);
            setDragOffset({
                x: e.clientX - rect.left - node.x,
                y: e.clientY - rect.top - node.y
            });
        }
    };

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
        if (draggedNode && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            setNodes(prev => prev.map(n =>
                n.id === draggedNode
                    ? { ...n, x: e.clientX - rect.left - dragOffset.x, y: e.clientY - rect.top - dragOffset.y }
                    : n
            ));
        }
    }, [draggedNode, dragOffset]);

    const handleMouseUp = () => {
        setDraggedNode(null);
    };

    const getNodePosition = (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
    };

    const glassStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
    };

    const connectingFromNode = connectingFrom ? nodes.find(n => n.id === connectingFrom) : null;

    return (
        <div style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0d1b2a 100%)',
            borderRadius: '24px',
            padding: '32px',
            color: '#fff',
            fontFamily: "'Inter', system-ui, sans-serif",
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
            {/* Gradient Orbs */}
            <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Header */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #f59e0b 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)'
                }}>
                    🕸️
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Knowledge Graph Builder
                    </h2>
                    <p style={{ margin: '4px 0 0 0', opacity: 0.7, fontSize: '14px', fontWeight: 500 }}>
                        Connect your ideas, people, and projects visually
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div style={{
                ...glassStyle,
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '16px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                <select
                    value={newNodeType}
                    onChange={e => setNewNodeType(e.target.value as Node['type'])}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(0,0,0,0.4)',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 500
                    }}
                >
                    {Object.entries(NODE_CONFIGS).map(([type, config]) => (
                        <option key={type} value={type}>{config.icon} {type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Node label..."
                    value={newNodeLabel}
                    onChange={e => setNewNodeLabel(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddNode()}
                    style={{
                        flex: 1,
                        minWidth: '150px',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(0,0,0,0.4)',
                        color: '#fff',
                        fontSize: '14px'
                    }}
                />
                <button
                    onClick={handleAddNode}
                    style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#fff',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                    }}
                >
                    + Add Node
                </button>
            </div>

            {/* Connection Controls */}
            {selectedNode && (
                <div style={{
                    ...glassStyle,
                    borderRadius: '12px',
                    padding: '14px 18px',
                    marginBottom: '16px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    borderLeft: `4px solid ${NODE_CONFIGS[nodes.find(n => n.id === selectedNode)?.type || 'idea'].color}`
                }}>
                    <span style={{ fontSize: '14px' }}>
                        Selected: <strong style={{ color: NODE_CONFIGS[nodes.find(n => n.id === selectedNode)?.type || 'idea'].color }}>
                            {nodes.find(n => n.id === selectedNode)?.label}
                        </strong>
                    </span>
                    <input
                        type="text"
                        placeholder="Relationship..."
                        value={newRelationship}
                        onChange={e => setNewRelationship(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.15)',
                            background: 'rgba(0,0,0,0.4)',
                            color: '#fff',
                            fontSize: '13px',
                            width: '120px'
                        }}
                    />
                    <button
                        onClick={() => setConnectingFrom(connectingFrom ? null : selectedNode)}
                        style={{
                            padding: '8px 14px',
                            background: connectingFrom ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        {connectingFrom ? '✗ Cancel' : '🔗 Connect'}
                    </button>
                    <button
                        onClick={() => handleDeleteNode(selectedNode)}
                        style={{
                            padding: '8px 14px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: '8px',
                            color: '#fca5a5',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        🗑️ Delete
                    </button>
                </div>
            )}

            {/* Graph Canvas */}
            <div
                ref={canvasRef}
                style={{
                    position: 'relative',
                    height: '420px',
                    ...glassStyle,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: draggedNode ? 'grabbing' : 'default'
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={() => {
                    setSelectedNode(null);
                    setConnectingFrom(null);
                }}
            >
                {/* Grid Background */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1 }}>
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Edges SVG */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.4)" />
                        </marker>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Existing Edges */}
                    {edges.map(edge => {
                        const from = getNodePosition(edge.from);
                        const to = getNodePosition(edge.to);
                        const midX = (from.x + to.x) / 2;
                        const midY = (from.y + to.y) / 2;
                        return (
                            <g key={edge.id}>
                                <line
                                    x1={from.x}
                                    y1={from.y}
                                    x2={to.x}
                                    y2={to.y}
                                    stroke="rgba(255,255,255,0.25)"
                                    strokeWidth="2"
                                    markerEnd="url(#arrowhead)"
                                    filter="url(#glow)"
                                />
                                <rect
                                    x={midX - 40}
                                    y={midY - 12}
                                    width="80"
                                    height="20"
                                    rx="10"
                                    fill="rgba(0,0,0,0.6)"
                                />
                                <text
                                    x={midX}
                                    y={midY + 4}
                                    fill="rgba(255,255,255,0.8)"
                                    fontSize="10"
                                    textAnchor="middle"
                                    fontWeight="500"
                                >
                                    {edge.relationship}
                                </text>
                            </g>
                        );
                    })}

                    {/* Connecting Line */}
                    {connectingFromNode && (
                        <line
                            x1={connectingFromNode.x}
                            y1={connectingFromNode.y}
                            x2={mousePos.x}
                            y2={mousePos.y}
                            stroke={NODE_CONFIGS[connectingFromNode.type].color}
                            strokeWidth="2"
                            strokeDasharray="8,4"
                            opacity="0.6"
                        />
                    )}
                </svg>

                {/* Nodes */}
                {nodes.map(node => {
                    const config = NODE_CONFIGS[node.type];
                    const isSelected = selectedNode === node.id;
                    const isConnecting = connectingFrom === node.id;

                    return (
                        <div
                            key={node.id}
                            onMouseDown={e => handleMouseDown(node.id, e)}
                            onClick={e => handleNodeClick(node.id, e)}
                            style={{
                                position: 'absolute',
                                left: node.x - 55,
                                top: node.y - 22,
                                padding: '10px 18px',
                                background: config.gradient,
                                borderRadius: '25px',
                                cursor: draggedNode === node.id ? 'grabbing' : 'grab',
                                fontSize: '13px',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                boxShadow: isSelected
                                    ? `0 0 30px ${config.color}80, 0 8px 25px rgba(0,0,0,0.4)`
                                    : `0 4px 20px rgba(0,0,0,0.3)`,
                                border: isConnecting
                                    ? '2px dashed #fff'
                                    : isSelected
                                        ? '2px solid #fff'
                                        : '2px solid transparent',
                                transition: 'box-shadow 0.2s, border 0.2s, transform 0.15s',
                                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                userSelect: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                zIndex: isSelected ? 10 : 1
                            }}
                        >
                            <span style={{ fontSize: '14px' }}>{config.icon}</span>
                            {node.label}
                        </div>
                    );
                })}

                {/* Connection Instructions */}
                {connectingFrom && (
                    <div style={{
                        position: 'absolute',
                        bottom: '16px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(29, 78, 216, 0.9) 100%)',
                        borderRadius: '25px',
                        fontSize: '13px',
                        fontWeight: 600,
                        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
                    }}>
                        Click another node to connect with "{newRelationship}"
                    </div>
                )}
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                gap: '20px',
                marginTop: '20px',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                {Object.entries(NODE_CONFIGS).map(([type, config]) => (
                    <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            background: config.gradient,
                            borderRadius: '50%',
                            boxShadow: `0 2px 8px ${config.color}50`
                        }} />
                        <span style={{ opacity: 0.7, textTransform: 'capitalize', fontWeight: 500 }}>{type}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KnowledgeGraphBuilder;
