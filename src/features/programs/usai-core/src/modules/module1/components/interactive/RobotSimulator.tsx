import React, { useState, useEffect } from 'react';

const GRID_SIZE = 5;
const START_POS = { x: 0, y: 0 };
const END_POS = { x: 4, y: 4 };

const RobotSimulator: React.FC = () => {
    const [robotPos, setRobotPos] = useState(START_POS);
    const [path, setPath] = useState([START_POS]);
    const [message, setMessage] = useState('');
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if(robotPos.x === END_POS.x && robotPos.y === END_POS.y) {
            setMessage('Congratulations! You reached the destination!');
            setIsFinished(true);
        }
    }, [robotPos]);

    const move = (dx: number, dy: number) => {
        if (isFinished) return;
        setRobotPos(prev => {
            const newX = prev.x + dx;
            const newY = prev.y + dy;
            if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
                setPath([...path, {x: newX, y: newY}])
                return { x: newX, y: newY };
            }
            setMessage("Oops! Can't move off the grid.");
            return prev;
        });
    };
    
    const handleReset = () => {
        setRobotPos(START_POS);
        setPath([START_POS]);
        setMessage('');
        setIsFinished(false);
    }

    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const isRobot = robotPos.x === x && robotPos.y === y;
            const isStart = START_POS.x === x && START_POS.y === y;
            const isEnd = END_POS.x === x && END_POS.y === y;
            const isPath = path.some(p => p.x === x && p.y === y);

            let content = '';
            if(isRobot) content = '🤖';
            else if(isStart) content = 'S';
            else if(isEnd) content = 'F';

            grid.push(
                <div key={`${x}-${y}`} className={`w-12 h-12 flex items-center justify-center rounded-lg text-lg
                    ${isPath ? 'bg-brand-secondary/50' : ''}
                    ${isRobot || isStart || isEnd ? 'font-bold' : ''}
                `}>
                    {content}
                </div>
            );
        }
    }

    return (
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="p-2 bg-brand-bg rounded-lg shadow-neumorphic-in">
                    <div className="grid grid-cols-5 gap-1">
                        {grid}
                    </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <button onClick={() => move(0, -1)} disabled={isFinished} className="w-16 h-12 rounded-lg shadow-neumorphic-out disabled:opacity-50 flex items-center justify-center">▲</button>
                    <div className="flex gap-3">
                        <button onClick={() => move(-1, 0)} disabled={isFinished} className="w-16 h-12 rounded-lg shadow-neumorphic-out disabled:opacity-50 flex items-center justify-center">◀</button>
                        <button onClick={() => move(1, 0)} disabled={isFinished} className="w-16 h-12 rounded-lg shadow-neumorphic-out disabled:opacity-50 flex items-center justify-center">▶</button>
                    </div>
                    <button onClick={() => move(0, 1)} disabled={isFinished} className="w-16 h-12 rounded-lg shadow-neumorphic-out disabled:opacity-50 flex items-center justify-center">▼</button>
                </div>
            </div>
             {message && <p className={`text-center mt-4 font-semibold ${isFinished ? 'text-pale-green' : ''}`}>{message}</p>}
             <div className="text-center mt-4">
                 <button onClick={handleReset} className="px-4 py-2 text-sm rounded-lg shadow-neumorphic-out hover:shadow-neumorphic-in">Reset</button>
            </div>
        </div>
    );
};

export default RobotSimulator;
