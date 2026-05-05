import React from 'react';

interface SimpleMarkdownProps {
  content: string;
}

const SimpleMarkdown: React.FC<SimpleMarkdownProps> = ({ content }) => {
  const renderContent = () => {
    if (!content) return null;

    // Process code blocks first
    const codeBlockRegex = /```(.*?)\n([\s\S]*?)```/g;
    const parts = content.split(codeBlockRegex);

    // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
    const elements: (React.ReactElement | string)[] = [];
    let isCode = false;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (isCode) {
            // This is the code content
            const language = parts[i-1] || 'text';
             elements.push(
                <pre key={`code-${i}`} className="bg-slate-900 text-white p-4 rounded-lg my-4 overflow-x-auto">
                    <code className={`language-${language}`}>{part.trim()}</code>
                </pre>
            );
        } else if (i > 0 && parts[i-1] !== undefined && parts[i-2] !== undefined) {
            // This is the language part, which we handle when processing the code content
        } else {
            // This is regular markdown content
            const lines = part.split('\n');
            let inList = false;
            // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
            let currentList: React.ReactElement[] = [];

            const closeList = () => {
                if (inList) {
                    elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-4 pl-4 text-brand-text-light">{currentList}</ul>);
                    inList = false;
                    currentList = [];
                }
            };
            
            lines.forEach((line, index) => {
                let processedLine = line
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>');

                if (processedLine.startsWith('### ')) {
                    closeList();
                    elements.push(<h5 key={`${i}-${index}`} className="font-bold text-lg text-brand-text mt-4 mb-2" dangerouslySetInnerHTML={{ __html: processedLine.substring(4) }} />);
                } else if (processedLine.startsWith('## ')) {
                    closeList();
                    elements.push(<h4 key={`${i}-${index}`} className="font-bold text-xl text-brand-text mt-4 mb-2" dangerouslySetInnerHTML={{ __html: processedLine.substring(3) }} />);
                } else if (processedLine.startsWith('# ')) {
                    closeList();
                    elements.push(<h3 key={`${i}-${index}`} className="font-bold text-2xl text-brand-text mt-4 mb-2" dangerouslySetInnerHTML={{ __html: processedLine.substring(2) }} />);
                } else if (processedLine.match(/^\s*[-*] /)) {
                    inList = true;
                    currentList.push(<li key={`${i}-${index}`} dangerouslySetInnerHTML={{ __html: processedLine.replace(/^\s*[-*] /, '') }} />);
                } else if (processedLine.trim() !== '') {
                    closeList();
                    elements.push(<p key={`${i}-${index}`} className="text-brand-text-light mb-2" dangerouslySetInnerHTML={{ __html: processedLine }} />);
                }
            });
            closeList();
        }
        isCode = !isCode;
    }
    
    return elements;
  };

  return <div>{renderContent()}</div>;
};

export default SimpleMarkdown;