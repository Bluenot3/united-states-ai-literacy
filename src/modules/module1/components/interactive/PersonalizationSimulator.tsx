import React, { useState } from 'react';

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

const PersonalizationSimulator: React.FC = () => {
    const [profile, setProfile] = useState<string[]>([]);
    const [recommendations, setRecommendations] = useState<[Article, Article]>(() => {
        const first = getRandomArticle();
        const second = getRandomArticle([first.id]);
        return [first, second];
    });

    const getNextRecs = (likedArticle: Article, currentProfile: string[]): [Article, Article] => {
        // Find one article that matches the profile
        const potentialMatches = allArticles.filter(a => 
            a.id !== likedArticle.id &&
            a.tags.some(tag => currentProfile.includes(tag))
        );
        const personalizedRec = potentialMatches.length > 0 
            ? potentialMatches[Math.floor(Math.random() * potentialMatches.length)] 
            : getRandomArticle([likedArticle.id]);

        // Find one random article
        const randomRec = getRandomArticle([likedArticle.id, personalizedRec.id]);
        
        // Randomize their position
        return Math.random() > 0.5 ? [personalizedRec, randomRec] : [randomRec, personalizedRec];
    };
    
    const handleLike = (likedArticle: Article) => {
        const newTags = likedArticle.tags.filter(tag => !profile.includes(tag));
        const updatedProfile = [...profile, ...newTags];
        setProfile(updatedProfile);
        setRecommendations(getNextRecs(likedArticle, updatedProfile));
    };

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <h4 className="font-bold text-center text-brand-text mb-2">Learner Profile</h4>
                    <p className="text-xs text-center text-brand-text-light mb-3">Your interests based on liked articles.</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {profile.length > 0 ? profile.map(tag => (
                             <span key={tag} className="px-2 py-1 bg-brand-secondary text-brand-primary text-xs font-semibold rounded-full">{tag}</span>
                        )) : <p className="text-sm text-brand-text-light">No interests yet. Like an article!</p>}
                    </div>
                </div>

                <div className="md:col-span-2">
                     <h4 className="font-bold text-center text-brand-text mb-4">Recommended For You</h4>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                <button onClick={() => handleLike(rec)} className="w-full py-2 text-sm font-semibold rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in text-brand-primary">
                                    Like
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
