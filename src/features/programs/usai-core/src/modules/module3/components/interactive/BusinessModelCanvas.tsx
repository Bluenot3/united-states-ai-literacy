import React, { useState } from 'react';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const canvasSections = [
    { id: 'partners', title: 'Key Partners' }, { id: 'activities', title: 'Key Activities' }, { id: 'value', title: 'Value Proposition' }, { id: 'relations', title: 'Customer Relations' }, { id: 'segments', title: 'Customer Segments' }, { id: 'resources', title: 'Key Resources' }, { id: 'channels', title: 'Channels' }, { id: 'costs', title: 'Cost Structure' }, { id: 'revenue', title: 'Revenue Streams' },
];

const gridLayout: { [key: string]: string } = {
    partners: 'col-span-2', activities: 'col-span-2', value: 'col-span-2 row-span-2', relations: 'col-span-2', segments: 'col-span-2 row-span-2', resources: 'col-span-2', channels: 'col-span-2', costs: 'col-span-3', revenue: 'col-span-3',
};

type CanvasData = { [key: string]: string };

const BusinessModelCanvas: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [data, setData] = useState<CanvasData>({});
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleSectionClick = (sectionId: string) => {
        setActiveSection(activeSection === sectionId ? null : sectionId);
    };
    
    const handleDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (activeSection) {
            setData({ ...data, [activeSection]: e.target.value });
        }
    };

    const getAiFeedback = async () => {
        setLoading(true);
        setFeedback('');
        const canvasContent = canvasSections.map(s => `- ${s.title}: ${data[s.id] || 'Not specified'}`).join('\n');
        const prompt = `You are an experienced venture capitalist reviewing a business model canvas. Provide a constructive critique of the following model. Identify potential strengths, weaknesses, and one key question the founder should consider.

${canvasContent}`;
        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
            setFeedback(response.text);
            if (!hasCompleted) {
                addPoints(30);
                updateProgress(interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setFeedback('There was an error getting feedback from the AI.');
        } finally {
            setLoading(false);
        }
    };
    
    const sectionsFilled = Object.values(data).filter(Boolean).length;

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Interactive Business Model Canvas</h4>
            <div className="grid grid-cols-6 gap-2">
                {canvasSections.map(section => (
                    <div
                        key={section.id}
                        className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${gridLayout[section.id]} ${activeSection === section.id ? 'shadow-neumorphic-in' : 'shadow-neumorphic-out'}`}
                        onClick={() => handleSectionClick(section.id)}
                    >
                        <h5 className={`text-center font-semibold text-sm mb-1 ${activeSection === section.id ? 'text-brand-primary' : 'text-brand-text'}`}>{section.title}</h5>
                        <div className="text-xs text-brand-text-light whitespace-pre-wrap p-1">
                             {data[section.id] || <span className="opacity-50">Click to edit...</span>}
                        </div>
                    </div>
                ))}
            </div>
            
            {activeSection && (
                <div className="mt-6 animate-fade-in">
                     <h5 className="font-bold text-brand-text mb-2">Editing: {canvasSections.find(s => s.id === activeSection)?.title}</h5>
                     <textarea
                        value={data[activeSection] || ''}
                        onChange={handleDataChange}
                        rows={4}
                        className="w-full p-3 bg-brand-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text shadow-neumorphic-in"
                        placeholder={`Enter details for ${canvasSections.find(s => s.id === activeSection)?.title}...`}
                     />
                </div>
            )}
            
            <div className="text-center mt-6">
                <button onClick={getAiFeedback} disabled={loading || sectionsFilled < 3} className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-neumorphic-out hover:shadow-neumorphic-in disabled:opacity-50 disabled:cursor-not-allowed">
                    <SparklesIcon /> {loading ? 'Analyzing...' : 'Get AI Feedback'}
                </button>
                 {sectionsFilled < 3 && <p className="text-xs text-brand-text-light mt-2">Fill at least 3 sections to get feedback.</p>}
            </div>

            {(loading || feedback) && (
                <div className="mt-6 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h5 className="font-semibold text-brand-text mb-2">AI Venture Capitalist Feedback</h5>
                    {loading ? <p className="animate-pulse">Generating critique...</p> : <pre className="text-brand-text-light whitespace-pre-wrap font-sans">{feedback}</pre>}
                </div>
            )}
        </div>
    );
};

export default BusinessModelCanvas;