import React, { useState, useEffect } from 'react';

interface Transaction {
    id: string;
    from: string;
    to: string;
    amount: number;
    type?: string;
}
interface Block {
    id: number;
    prevHash: string;
    hash: string;
    transactions: Transaction[];
}

const generateHash = () => Math.random().toString(36).substring(2, 10);
const generateAddress = () => '0x' + Math.random().toString(16).substring(2, 12);

const initialChain: Block[] = [
    {id: 1, prevHash: '00000000', hash: generateHash(), transactions: [{id: generateHash(), from: 'Genesis', to: generateAddress(), amount: 100}]},
    {id: 2, prevHash: '', hash: generateHash(), transactions: [{id: generateHash(), from: generateAddress(), to: generateAddress(), amount: 10}, {id: generateHash(), from: generateAddress(), to: generateAddress(), amount: 5}]},
    {id: 3, prevHash: '', hash: generateHash(), transactions: [{id: generateHash(), from: generateAddress(), to: generateAddress(), amount: 25}]},
];
initialChain[1].prevHash = initialChain[0].hash;
initialChain[2].prevHash = initialChain[1].hash;


const BlockchainExplorer: React.FC = () => {
    const [chain, setChain] = useState<Block[]>(initialChain);
    const [selectedItem, setSelectedItem] = useState<Block | Transaction | null>(chain[0]);

    useEffect(() => {
        const handleCompile = () => {
            setChain(prevChain => {
                const lastBlock = prevChain[prevChain.length - 1];
                const newTx: Transaction = {
                    id: generateHash(),
                    from: 'Compiler',
                    to: generateAddress(),
                    amount: 0,
                    type: 'Contract Creation'
                };
                const newBlock: Block = {
                    id: lastBlock.id + 1,
                    prevHash: lastBlock.hash,
                    hash: generateHash(),
                    transactions: [newTx]
                };
                const newChain = [...prevChain, newBlock];
                setSelectedItem(newBlock);
                return newChain;
            });
        };

        document.addEventListener('compileSmartContract', handleCompile);
        return () => document.removeEventListener('compileSmartContract', handleCompile);
    }, []);

    return(
        <div className="my-8 p-6 bg-brand-bg rounded-2xl shadow-neumorphic-out">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                    <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Blocks</h4>
                    <div className="space-y-3">
                        {chain.map(block => (
                            <div key={block.id} className={`p-3 bg-brand-bg rounded-lg transition-all duration-300 ${selectedItem && 'prevHash' in selectedItem && selectedItem.id === block.id ? 'shadow-neumorphic-in' : 'shadow-neumorphic-out'}`}>
                                <button onClick={() => setSelectedItem(block)} className="font-semibold text-brand-primary w-full text-left">Block #{block.id}</button>
                                <div className="mt-2 space-y-1">
                                    {block.transactions.map(tx => (
                                        <button key={tx.id} onClick={() => setSelectedItem(tx)} className={`text-sm w-full text-left pl-4 rounded py-1 ${selectedItem && 'from' in selectedItem && selectedItem.id === tx.id ? 'text-brand-primary font-semibold' : 'text-brand-text-light hover:text-brand-primary'}`}>Tx: {tx.id.substring(0,8)}...</button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-4 bg-brand-bg rounded-lg shadow-neumorphic-in">
                     <h4 className="font-bold text-lg text-brand-text mb-4 text-center">Details</h4>
                     {selectedItem && 'prevHash' in selectedItem && (
                         <div className="text-sm space-y-2 break-words">
                            <p><strong>Type:</strong> Block</p>
                            <p><strong>ID:</strong> {selectedItem.id}</p>
                            <p><strong>Hash:</strong> {selectedItem.hash}</p>
                            <p><strong>Prev. Hash:</strong> {selectedItem.prevHash}</p>
                            <p><strong>Transactions:</strong> {selectedItem.transactions.length}</p>
                         </div>
                     )}
                     {selectedItem && 'from' in selectedItem && (
                          <div className="text-sm space-y-2 break-words">
                            <p><strong>Type:</strong> Transaction</p>
                            {selectedItem.type && <p><strong>Subtype:</strong> {selectedItem.type}</p>}
                            <p><strong>ID:</strong> {selectedItem.id}</p>
                            <p><strong>From:</strong> {selectedItem.from}</p>
                            <p><strong>To:</strong> {selectedItem.to}</p>
                            <p><strong>Amount:</strong> {selectedItem.amount} ZLT</p>
                         </div>
                     )}
                </div>
            </div>
        </div>
    )
}

export default BlockchainExplorer;