import React, { useState } from 'react';
import type { InteractiveComponentProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { Type } from '@google/genai';

interface Article {
    id: number;
    title: string;
    tags: string[];
}

const allArticles: Article[] = [
    { id: 1, title: "The Rise of Python in Data Science", tags: ['python', 'data science'] },
    { id: 2, title: "Building Your First Neural Network", tags: ['ml', 'programming'] },
    { id: 3, title: "Ethical Dilemmas in AI", tags: ['ethics', 'ai'] },
    { id: 4, title: "Getting Started with Robotics", tags: ['robotics', 'hardware'] },
    { id: 5, title: "A Beginner's Guide to Solidity", tags: ['blockchain', 'programming'] },
    { id: 6, title: "Understanding Vector Databases", tags: ['data science', 'ai'] },
    { id: 7, title: "The Future of Autonomous Systems", tags: ['robotics', 'ai'] },
    { id: 8, title: "Is Web3 the Future of the Internet?", tags: ['blockchain', 'web3'] },
];

const getRandomArticle = (excludeIds: number[] = []): Article => {
    const available = allArticles.filter(a => !excludeIds.includes(a.id));
    return available[Math.floor(Math.random() * available.length)];
};

const PersonalizationSimulator: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { user, addPoints, updateProgress } = useAuth();
    const [profile, setProfile] = useState<string[]>([]);
    const [recommendations, setRecommendations] = useState<Article[]>(() => {
        const first = getRandomArticle();
        const second = getRandomArticle([first.id]);
        return [first, second];
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const hasCompleted = user?.progress.completedInteractives.includes(interactiveId);

    const handleLike = async (likedArticle: Article) => {
        setLoading(true);
        setError('');

        const newTags = likedArticle.tags.filter(tag => !profile.includes(tag));
        const updatedProfile = [...profile, ...newTags];
        setProfile(updatedProfile);

        const availableArticles = allArticles.filter(a => a.id !== likedArticle.id);

        const prompt = `You are an AI recommendation engine. A user has the following interest profile: [${updatedProfile.join(', ')}].
        They just liked an article titled "${likedArticle.title}".
        From the following list of available articles, choose the two best articles to recommend next.
        
        Available Articles:
        ${availableArticles.map(a => `- ${a.title} (ID: ${a.id})`).join('\n')}
        
        Return your answer as a JSON array of two article IDs. Example: [3, 7]`;

        try {
            const ai = await getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: { type: Type.ARRAY, items: { type: Type.NUMBER } }
                }
            });
            const recommendedIds = JSON.parse(response.text) as number[];
            const nextRecs = allArticles.filter(a => recommendedIds.includes(a.id));
            
            if (nextRecs.length === 2) {
                setRecommendations(nextRecs);
            } else {
                throw new Error("AI returned an invalid number of recommendations.");
            }

            if (!hasCompleted) {
                addPoints(5);
                if (updatedProfile.length > 5) {
                    updateProgress(interactiveId, 'interactive');
                }
            }
        } catch (e) {
            console.error(e);
            setError("AI failed to recommend. Using random fallback.");
            const first = getRandomArticle([likedArticle.id]);
            const second = getRandomArticle([likedArticle.id, first.id]);
            setRecommendations([first, second]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h4 className="font-bold text-center text-brand-text mb-2">Learner Profile</h4>
                    <p className="text-xs text-center text-brand-text-light mb-3">Your interests based on liked articles.</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {profile.length > 0 ? profile.map(tag => (
                             <span key={tag} className="px-2 py-1 bg-brand-secondary/80 text-white text-xs font-semibold rounded-full">{tag}</span>
                        )) : <p className="text-sm text-brand-text-light">No interests yet. Like an article!</p>}
                    </div>
                </div>

                <div className="md:col-span-2">
                     <h4 className="font-bold text-center text-brand-text mb-4">Recommended For You</h4>
                     {error && <p className="text-center text-red-500 text-sm mb-2">{error}</p>}
                     <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${loading ? 'opacity-50' : ''}`}>
                        {recommendations.map(rec => (
                            <div key={rec.id} className="p-4 bg-brand-bg rounded-lg shadow-neumorphic-out flex flex-col justify-between">
                                <div>
                                    <h5 className="font-semibold text-brand-text mb-2">{rec.title}</h5>
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {rec.tags.map(tag => (
                                            <span key={tag} className="text-xs text-brand-text-light">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => handleLike(rec)} disabled={loading} className="w-full py-2 text-sm font-semibold rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in text-brand-primary disabled:opacity-50">
                                    {loading ? '...' : 'Like'}
                                </button>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalizationSimulator;