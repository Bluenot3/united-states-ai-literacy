import React, { useState } from 'react';

const pedagogies = [
    { term: 'Constructivism', def: 'Students actively build knowledge through experiences.' },
    { term: 'Connectivism', def: 'Learning happens through networks in a digital age.' },
    { term: 'Competency-Based', def: 'Progress is measured by demonstrated skills, not time.' },
    { term: 'Inquiry-Based', def: 'Students drive learning through their own questions.' },
].sort(() => Math.random() - 0.5); // Randomize order

const definitions = [...pedagogies].sort(() => Math.random() - 0.5);

const PedagogyMatcher: React.FC = () => {
    const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
    const [selectedDef, setSelectedDef] = useState<string | null>(null);
    const [correctMatches, setCorrectMatches] = useState<string[]>([]);
    const [feedback, setFeedback] = useState('');

    React.useEffect(() => {
        if(selectedTerm && selectedDef) {
            const termObj = pedagogies.find(p => p.term === selectedTerm);
            if(termObj && termObj.def === selectedDef) {
                setCorrectMatches([...correctMatches, selectedTerm]);
                setFeedback('Correct Match!');
            } else {
                setFeedback('Not a match. Try again.');
            }
            setSelectedTerm(null);
            setSelectedDef(null);
        }
    }, [selectedTerm, selectedDef, correctMatches]);
    
    const handleReset = () => {
        setCorrectMatches([]);
        setFeedback('');
    }

    const isMatched = (term: string) => correctMatches.includes(term);

    if (correctMatches.length === pedagogies.length) {
         return (
             <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out text-center">
                <h4 className="font-bold text-xl text-pale-green mb-4">Congratulations!</h4>
                <p className="text-lg text-brand-text-light">You've matched all the pedagogical approaches.</p>
                <button onClick={handleReset} className="mt-4 px-6 py-2 rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Play Again</button>
            </div>
         )
    }

    return(
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-bold text-center text-brand-text mb-4">Terms</h4>
                    <div className="space-y-3">
                        {pedagogies.map(p => (
                             <button
                                key={p.term}
                                onClick={() => !isMatched(p.term) && setSelectedTerm(p.term)}
                                disabled={isMatched(p.term)}
                                className={`w-full p-4 rounded-lg text-left transition-all duration-200 
                                    ${isMatched(p.term) ? 'opacity-30 cursor-not-allowed' : ''}
                                    ${selectedTerm === p.term ? 'shadow-neumorphic-in text-brand-primary' : 'shadow-neumorphic-out'}`
                                }
                             >
                                {p.term}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <h4 className="font-bold text-center text-brand-text mb-4">Definitions</h4>
                    <div className="space-y-3">
                         {definitions.map(p => (
                            <button
                                key={p.def}
                                onClick={() => !isMatched(p.term) && setSelectedDef(p.def)}
                                disabled={isMatched(p.term)}
                                className={`w-full p-4 rounded-lg text-left transition-all duration-200 text-sm
                                    ${isMatched(p.term) ? 'opacity-30 cursor-not-allowed' : ''}
                                    ${selectedDef === p.def ? 'shadow-neumorphic-in text-brand-primary' : 'shadow-neumorphic-out'}`
                                }
                            >
                                {p.def}
                            </button>
                         ))}
                    </div>
                </div>
            </div>
             {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
        </div>
    )

}

export default PedagogyMatcher;
