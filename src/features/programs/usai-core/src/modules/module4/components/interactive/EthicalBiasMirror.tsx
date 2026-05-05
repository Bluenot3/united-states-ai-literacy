import React, { useState, useEffect } from 'react';
import type { InteractiveComponentProps } from '../../../../types';
import { useAuth } from '../../../../hooks/useAuth';
import { getAiClient } from '../../services/aiService';
import { SparklesIcon } from '../icons/SparklesIcon';

// Language chain for the "telephone game" effect
const LANGUAGE_CHAINS = [
    { name: 'European Route', languages: ['Spanish', 'French', 'German', 'Italian'] },
    { name: 'Asian Journey', languages: ['Japanese', 'Korean', 'Chinese', 'Vietnamese'] },
    { name: 'Global Tour', languages: ['Russian', 'Arabic', 'Hindi', 'Portuguese'] },
    { name: 'Custom (Single)', languages: [] },
];

interface TranslationStep {
    language: string;
    text: string;
    status: 'pending' | 'translating' | 'complete';
}

const EthicalBiasMirror: React.FC<InteractiveComponentProps> = ({ interactiveId }) => {
    const { addPoints, updateModuleProgress, getModuleProgress } = useAuth();
    const [inputText, setInputText] = useState('The doctor helped the nurse with her patient.');
    const [selectedChain, setSelectedChain] = useState(0);
    const [customLanguage, setCustomLanguage] = useState('Spanish');
    const [steps, setSteps] = useState<TranslationStep[]>([]);
    const [finalResult, setFinalResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showComparison, setShowComparison] = useState(false);
    const [diffHighlight, setDiffHighlight] = useState<string[]>([]);

    const moduleProgress = getModuleProgress(1);
    const hasCompleted = moduleProgress.completedInteractives.includes(interactiveId);

    // Sample phrases that demonstrate bias well
    const samplePhrases = [
        'The doctor helped the nurse with her patient.',
        'The CEO met with his assistant to discuss the budget.',
        'The firefighter saved the child from the burning building.',
        'My friend is a successful engineer and loves cooking.',
        'The teacher praised the student for his excellent work.',
    ];

    // Highlight differences between original and result
    useEffect(() => {
        if (finalResult && inputText) {
            const originalWords = inputText.toLowerCase().split(/\s+/);
            const resultWords = finalResult.toLowerCase().split(/\s+/);
            const diffs: string[] = [];

            resultWords.forEach(word => {
                const cleanWord = word.replace(/[.,!?'"]/g, '');
                if (!originalWords.some(ow => ow.replace(/[.,!?'"]/g, '') === cleanWord)) {
                    diffs.push(cleanWord);
                }
            });

            setDiffHighlight(diffs);
        }
    }, [finalResult, inputText]);

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            setError('Please enter some text.');
            return;
        }

        setLoading(true);
        setError('');
        setFinalResult('');
        setShowComparison(false);
        setDiffHighlight([]);

        // Determine which languages to use
        const chain = LANGUAGE_CHAINS[selectedChain];
        const languages = chain.languages.length > 0
            ? chain.languages
            : [customLanguage];

        // Initialize steps
        const initialSteps: TranslationStep[] = languages.map(lang => ({
            language: lang,
            text: '',
            status: 'pending'
        }));
        initialSteps.push({ language: 'English (Final)', text: '', status: 'pending' });
        setSteps(initialSteps);

        try {
            const ai = await getAiClient();
            let currentText = inputText;

            // Translate through each language
            for (let i = 0; i < languages.length; i++) {
                setSteps(prev => prev.map((s, idx) =>
                    idx === i ? { ...s, status: 'translating' } : s
                ));

                const prompt = `Translate the following text to ${languages[i]}. Provide ONLY the translation, no explanation.

Text: "${currentText}"`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt
                });

                currentText = response.text?.trim() || currentText;

                setSteps(prev => prev.map((s, idx) =>
                    idx === i ? { ...s, text: currentText, status: 'complete' } : s
                ));

                // Small delay for visual effect
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            // Final translation back to English
            setSteps(prev => prev.map((s, idx) =>
                idx === languages.length ? { ...s, status: 'translating' } : s
            ));

            const finalPrompt = `Translate the following text back to English. Provide ONLY the translation, no explanation.

Text: "${currentText}"`;

            const finalResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: finalPrompt
            });

            const result = finalResponse.text?.trim() || '';

            setSteps(prev => prev.map((s, idx) =>
                idx === languages.length ? { ...s, text: result, status: 'complete' } : s
            ));

            setFinalResult(result);
            setShowComparison(true);

            if (!hasCompleted) {
                addPoints(1, 25);
                updateModuleProgress(1, interactiveId, 'interactive');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to perform translation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const highlightWord = (word: string) => {
        const cleanWord = word.toLowerCase().replace(/[.,!?'"]/g, '');
        return diffHighlight.includes(cleanWord);
    };

    return (
        <div className="my-8 overflow-hidden">
            {/* Header */}
            <div className="relative p-6 sm:p-8 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-900/50 rounded-t-2xl border border-purple-500/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.15),transparent_50%)]" />
                <div className="relative">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/20 rounded-xl">
                            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                        <h4 className="font-black text-xl sm:text-2xl text-white">Bias: The Telephone Game</h4>
                    </div>
                    <p className="text-center text-purple-200/70 text-sm sm:text-base max-w-2xl mx-auto">
                        Watch how meaning transforms as text travels through multiple languages.
                        Biases hidden in language structures may emerge during translation.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-4 sm:p-6 lg:p-8 bg-slate-900/50 backdrop-blur-sm border-x border-purple-500/20 space-y-6">
                {/* Input Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Text Input */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 font-semibold text-sm text-slate-300">
                            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Original English Phrase
                        </label>
                        <textarea
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            rows={3}
                            className="w-full p-4 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            placeholder="Enter a phrase to test for translation bias..."
                        />
                        {/* Sample Phrases */}
                        <div className="flex flex-wrap gap-2">
                            {samplePhrases.slice(0, 3).map((phrase, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInputText(phrase)}
                                    className="text-xs px-3 py-1.5 bg-slate-800/50 hover:bg-purple-500/20 border border-slate-700/50 rounded-full text-slate-400 hover:text-purple-300 transition-colors truncate max-w-[200px]"
                                    title={phrase}
                                >
                                    {phrase.substring(0, 30)}...
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Language Chain Selection */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 font-semibold text-sm text-slate-300">
                            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Translation Route
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {LANGUAGE_CHAINS.map((chain, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedChain(i)}
                                    className={`p-3 rounded-xl border text-left transition-all ${selectedChain === i
                                            ? 'bg-purple-500/20 border-purple-500/50 text-white'
                                            : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
                                        }`}
                                >
                                    <span className="font-semibold text-sm block">{chain.name}</span>
                                    <span className="text-xs opacity-70">
                                        {chain.languages.length > 0
                                            ? chain.languages.join(' → ')
                                            : 'Pick one language'
                                        }
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Custom Language Selector */}
                        {selectedChain === 3 && (
                            <select
                                value={customLanguage}
                                onChange={e => setCustomLanguage(e.target.value)}
                                className="w-full p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white focus:border-purple-500/50 transition-all"
                            >
                                <option value="Spanish">Spanish</option>
                                <option value="Japanese">Japanese</option>
                                <option value="German">German</option>
                                <option value="French">French</option>
                                <option value="Korean">Korean</option>
                                <option value="Arabic">Arabic</option>
                                <option value="Russian">Russian</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Chinese">Chinese (Simplified)</option>
                                <option value="Turkish">Turkish (Gender-neutral pronouns)</option>
                                <option value="Finnish">Finnish (Gender-neutral pronouns)</option>
                            </select>
                        )}
                    </div>
                </div>

                {/* Action Button */}
                <div className="text-center">
                    <button
                        onClick={handleTranslate}
                        disabled={loading || !inputText.trim()}
                        className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-100"
                    >
                        <SparklesIcon />
                        <span className="text-base sm:text-lg">
                            {loading ? 'Translating Through Languages...' : 'Start Translation Journey'}
                        </span>
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-center text-red-400">{error}</p>
                    </div>
                )}

                {/* Translation Steps Visualization */}
                {steps.length > 0 && (
                    <div className="space-y-4">
                        <h5 className="font-semibold text-slate-300 flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            Translation Chain
                        </h5>

                        {/* Mobile: Vertical Stack */}
                        <div className="block sm:hidden space-y-3">
                            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                <div className="text-xs text-slate-500 mb-1">Original</div>
                                <p className="text-sm text-slate-300">{inputText}</p>
                            </div>
                            {steps.map((step, i) => (
                                <div key={i} className="relative">
                                    <div className="absolute left-4 -top-3 w-px h-3 bg-purple-500/30" />
                                    <div className={`p-3 rounded-xl border transition-all ${step.status === 'translating'
                                            ? 'bg-purple-500/20 border-purple-500/50 animate-pulse'
                                            : step.status === 'complete'
                                                ? 'bg-slate-800/40 border-green-500/30'
                                                : 'bg-slate-800/20 border-slate-700/30'
                                        }`}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-purple-300">{step.language}</span>
                                            {step.status === 'complete' && (
                                                <span className="text-xs text-green-400">✓</span>
                                            )}
                                        </div>
                                        <p className={`text-sm ${step.text ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {step.status === 'translating' ? '...' : step.text || 'Waiting...'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop: Horizontal Flow */}
                        <div className="hidden sm:block overflow-x-auto pb-4">
                            <div className="flex items-start gap-2 min-w-max">
                                {/* Original */}
                                <div className="w-40 flex-shrink-0 p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                    <div className="text-xs text-slate-500 mb-1">Original</div>
                                    <p className="text-xs text-slate-300 line-clamp-3">{inputText}</p>
                                </div>

                                {steps.map((step, i) => (
                                    <React.Fragment key={i}>
                                        {/* Arrow */}
                                        <div className="flex items-center justify-center w-6 flex-shrink-0 self-center">
                                            <svg className={`w-4 h-4 ${step.status === 'translating' ? 'text-purple-400 animate-pulse' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>

                                        {/* Step */}
                                        <div className={`w-40 flex-shrink-0 p-3 rounded-xl border transition-all ${step.status === 'translating'
                                                ? 'bg-purple-500/20 border-purple-500/50'
                                                : step.status === 'complete'
                                                    ? 'bg-slate-800/40 border-green-500/30'
                                                    : 'bg-slate-800/20 border-slate-700/30 opacity-50'
                                            }`}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-purple-300">{step.language}</span>
                                                {step.status === 'complete' && (
                                                    <span className="text-xs text-green-400">✓</span>
                                                )}
                                                {step.status === 'translating' && (
                                                    <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                                )}
                                            </div>
                                            <p className={`text-xs line-clamp-3 ${step.text ? 'text-slate-300' : 'text-slate-600'}`}>
                                                {step.status === 'translating' ? 'Translating...' : step.text || 'Waiting...'}
                                            </p>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Comparison Panel */}
                {showComparison && finalResult && (
                    <div className="mt-6 p-4 sm:p-6 bg-gradient-to-br from-slate-800/60 to-purple-900/20 rounded-2xl border border-purple-500/30">
                        <h5 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Before vs After Comparison
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Original */}
                            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Original</div>
                                <p className="text-base sm:text-lg text-slate-300 leading-relaxed">"{inputText}"</p>
                            </div>

                            {/* Result */}
                            <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                                <div className="text-xs font-medium text-purple-400 mb-2 uppercase tracking-wide">After Translation</div>
                                <p className="text-base sm:text-lg text-white leading-relaxed">
                                    "{finalResult.split(/\s+/).map((word, i) => (
                                        <span
                                            key={i}
                                            className={highlightWord(word) ? 'bg-amber-500/30 text-amber-200 px-1 rounded' : ''}
                                        >
                                            {word}{' '}
                                        </span>
                                    ))}"
                                </p>
                            </div>
                        </div>

                        {/* Analysis */}
                        {diffHighlight.length > 0 && (
                            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-semibold text-amber-300">Potential Drift Detected</p>
                                        <p className="text-xs text-amber-200/70 mt-1">
                                            Words highlighted in yellow appeared in the translation but weren't in the original.
                                            This could indicate bias, cultural differences, or meaning shifts.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {diffHighlight.length === 0 && inputText.toLowerCase() !== finalResult.toLowerCase() && (
                            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-semibold text-blue-300">Subtle Meaning Shift</p>
                                        <p className="text-xs text-blue-200/70 mt-1">
                                            The translation is similar but not identical. Compare word choices and sentence structure—subtle biases often hide in the details.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-900/70 rounded-b-2xl border-x border-b border-purple-500/20">
                <p className="text-center text-xs text-slate-500">
                    💡 Try phrases with gender pronouns or professions to see how different languages handle them
                </p>
            </div>
        </div>
    );
};

export default EthicalBiasMirror;
