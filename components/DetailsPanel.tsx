import React from 'react';
import type { Node, DataItem } from '../types';
import { NodeType } from '../types';

interface DetailsPanelProps {
  selectedNode: Node | null;
  selectedQuote: DataItem | null;
  onClear: () => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ selectedNode, selectedQuote, onClear }) => {
  if (!selectedNode) return null;

  const getBadgeColor = (type: NodeType) => {
    switch (type) {
      case NodeType.AGGREGATED: return 'bg-rose-600/20 text-rose-300 border-rose-500/50';
      case NodeType.SECONDARY: return 'bg-sky-600/20 text-sky-300 border-sky-500/50';
      case NodeType.INITIAL: return 'bg-teal-600/20 text-teal-300 border-teal-500/50';
      case NodeType.QUOTE: return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-500/50';
    }
  };

  return (
    <div className="absolute top-24 right-4 w-[32rem] bg-gray-800/80 backdrop-blur-md border border-gray-600 rounded-lg shadow-2xl text-gray-200 z-20 flex flex-col" style={{maxHeight: 'calc(100vh - 8rem)'}}>
      <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
        <h2 className="text-lg font-semibold text-cyan-400">Node Details</h2>
        <button onClick={onClear} className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        <div>
          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${getBadgeColor(selectedNode.type)}`}>
            {selectedNode.type}
          </span>
        </div>
        <div>
          <p className="text-sm text-gray-400">Label</p>
          <p className="font-semibold text-lg">{selectedNode.label}</p>
        </div>
        
        {selectedQuote && (
          <div className="border-t border-gray-700 pt-4 mt-4" dir="rtl">
            <p className="text-sm text-gray-400">Quote (from <span className="font-mono">{selectedQuote.refCode}</span>)</p>
            <blockquote className="mt-2 p-3 bg-gray-900/50 border-r-4 border-amber-500 text-gray-300 italic">
              {selectedQuote.quote}
            </blockquote>
            <div className="mt-4 space-y-2 text-sm text-right">
              <p><strong className="font-semibold text-teal-400 ml-2">:کد اولیه</strong> {selectedQuote.initialCode}</p>
              <p><strong className="font-semibold text-sky-400 ml-2">:تم فرعی</strong> {selectedQuote.secondaryTheme}</p>
              <p><strong className="font-semibold text-rose-400 ml-2">:بعد کلان</strong> {selectedQuote.aggregatedDimension}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsPanel;