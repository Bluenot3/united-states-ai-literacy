import React from 'react';
import SmartCodeBlock from '../../../zen-programs/components/SmartCodeBlock';

interface SimpleMarkdownProps {
  content: string;
}

const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => (
  text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .filter(Boolean)
    .map((token, index) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={`${keyPrefix}-strong-${index}`}>{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith('*') && token.endsWith('*')) {
        return <em key={`${keyPrefix}-em-${index}`}>{token.slice(1, -1)}</em>;
      }
      return <React.Fragment key={`${keyPrefix}-text-${index}`}>{token}</React.Fragment>;
    })
);

const renderTextBlock = (text: string, blockIndex: number): React.ReactElement[] => {
  const elements: React.ReactElement[] = [];
  let listItems: React.ReactElement[] = [];

  const closeList = () => {
    if (!listItems.length) return;
    elements.push(
      <ul key={`list-${blockIndex}-${elements.length}`} className="my-4 list-inside list-disc space-y-1 pl-4 text-brand-text-light">
        {listItems}
      </ul>,
    );
    listItems = [];
  };

  text.split('\n').forEach((line, lineIndex) => {
    const key = `${blockIndex}-${lineIndex}`;
    if (/^\s*[-*]\s+/.test(line)) {
      listItems.push(<li key={key}>{renderInline(line.replace(/^\s*[-*]\s+/, ''), key)}</li>);
      return;
    }

    closeList();
    if (line.startsWith('### ')) {
      elements.push(<h5 key={key} className="mb-2 mt-4 text-lg font-bold text-brand-text">{renderInline(line.slice(4), key)}</h5>);
    } else if (line.startsWith('## ')) {
      elements.push(<h4 key={key} className="mb-2 mt-4 text-xl font-bold text-brand-text">{renderInline(line.slice(3), key)}</h4>);
    } else if (line.startsWith('# ')) {
      elements.push(<h3 key={key} className="mb-2 mt-4 text-2xl font-bold text-brand-text">{renderInline(line.slice(2), key)}</h3>);
    } else if (line.trim()) {
      elements.push(<p key={key} className="mb-2 text-brand-text-light">{renderInline(line, key)}</p>);
    }
  });

  closeList();
  return elements;
};

const SimpleMarkdown: React.FC<SimpleMarkdownProps> = ({ content }) => {
  if (!content) return null;

  const elements: React.ReactElement[] = [];
  const fence = /```([^\n]*)\n([\s\S]*?)```/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  let blockIndex = 0;

  while ((match = fence.exec(content)) !== null) {
    elements.push(...renderTextBlock(content.slice(cursor, match.index), blockIndex));
    elements.push(
      <SmartCodeBlock
        key={`code-${blockIndex}`}
        code={match[2].trim()}
        language={match[1].trim()}
        variant="light"
      />,
    );
    cursor = match.index + match[0].length;
    blockIndex += 1;
  }

  elements.push(...renderTextBlock(content.slice(cursor), blockIndex));
  return <div>{elements}</div>;
};

export default SimpleMarkdown;
