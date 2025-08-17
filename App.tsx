
import React, { useState, useMemo, useCallback } from 'react';
import { quotesData } from './data/quotes';
import type { DataItem, Node, GraphData } from './types';
import { NodeType } from './types';
import NetworkGraph from './components/NetworkGraph';
import DetailsPanel from './components/DetailsPanel';
import { LeftSidebar, RightSidebar } from './components/Sidebar';

const LegendItem: React.FC<{ colorClass: string; label: string }> = ({ colorClass, label }) => (
    <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
        <span className="text-xs text-gray-300">{label}</span>
    </div>
);

const App: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<DataItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  const graphData: GraphData = useMemo(() => {
    const nodes: Node[] = [];
    const links: { source: string; target: string }[] = [];
    const nodeIds = new Set<string>();

    const getNodeColor = (type: NodeType, group: string) => {
        switch (type) {
            case NodeType.AGGREGATED: return 'bg-rose-600';
            case NodeType.SECONDARY: return 'bg-sky-600';
            case NodeType.INITIAL: return 'bg-teal-600';
            case NodeType.QUOTE: return 'bg-amber-500';
            default: return 'bg-gray-500';
        }
    };

    quotesData.forEach(item => {
      if (!nodeIds.has(item.aggregatedDimension)) {
        nodeIds.add(item.aggregatedDimension);
        nodes.push({ id: item.aggregatedDimension, group: item.aggregatedDimension, type: NodeType.AGGREGATED, label: item.aggregatedDimension, radius: 20, color: getNodeColor(NodeType.AGGREGATED, item.aggregatedDimension) });
      }
      if (!nodeIds.has(item.secondaryTheme)) {
        nodeIds.add(item.secondaryTheme);
        nodes.push({ id: item.secondaryTheme, group: item.aggregatedDimension, type: NodeType.SECONDARY, label: item.secondaryTheme, radius: 15, color: getNodeColor(NodeType.SECONDARY, item.aggregatedDimension) });
        links.push({ source: item.aggregatedDimension, target: item.secondaryTheme });
      }
      if (!nodeIds.has(item.initialCode)) {
        nodeIds.add(item.initialCode);
        nodes.push({ id: item.initialCode, group: item.aggregatedDimension, type: NodeType.INITIAL, label: item.initialCode, radius: 12, color: getNodeColor(NodeType.INITIAL, item.aggregatedDimension) });
        links.push({ source: item.secondaryTheme, target: item.initialCode });
      }
       if (!nodeIds.has(item.refCode)) {
        nodeIds.add(item.refCode);
        nodes.push({ id: item.refCode, group: item.aggregatedDimension, type: NodeType.QUOTE, label: item.refCode, radius: 8, color: getNodeColor(NodeType.QUOTE, item.aggregatedDimension) });
        links.push({ source: item.initialCode, target: item.refCode });
      }
    });

    return { nodes, links };
  }, []);

  const filteredGraphData = useMemo(() => {
    if (!searchTerm) return graphData;
    const lowercasedFilter = searchTerm.toLowerCase();
    const visibleNodeIds = new Set<string>();
    const matchedNodes = new Set<string>();

    graphData.nodes.forEach(node => {
      if (node.label.toLowerCase().includes(lowercasedFilter)) {
        matchedNodes.add(node.id);
      }
    });

    matchedNodes.forEach(nodeId => {
      visibleNodeIds.add(nodeId);
      const findConnections = (id: string, depth = 0) => {
        if (depth > 5) return;
        graphData.links.forEach(link => {
          if (link.source === id && !visibleNodeIds.has(link.target)) {
            visibleNodeIds.add(link.target);
            findConnections(link.target, depth + 1);
          }
          if (link.target === id && !visibleNodeIds.has(link.source)) {
            visibleNodeIds.add(link.source);
             findConnections(link.source, depth + 1);
          }
        });
      };
      findConnections(nodeId);
    });
    
    if(visibleNodeIds.size === 0) {
        return {nodes: [], links: []};
    }

    const filteredNodes = graphData.nodes.filter(node => visibleNodeIds.has(node.id));
    const filteredLinks = graphData.links.filter(link => visibleNodeIds.has(link.source) && visibleNodeIds.has(link.target));
    
    return { nodes: filteredNodes, links: filteredLinks };
  }, [searchTerm, graphData]);

  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode(node);
    if (node.type === NodeType.QUOTE) {
      const quote = quotesData.find(q => q.refCode === node.id) || null;
      setSelectedQuote(quote);
    } else {
      setSelectedQuote(null);
    }
  }, []);

  const handleClearSelection = () => {
    setSelectedNode(null);
    setSelectedQuote(null);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      <LeftSidebar isOpen={isLeftSidebarOpen} />
      <main className="flex-1 flex flex-col relative">
        <header className="p-3 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <button onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
               </button>
               <div>
                  <h1 className="text-xl font-bold text-cyan-400 group relative">
                    The Vicious Cycle of Symbolic R&D in Iran: A Network Analysis
                     <span className="absolute -top-8 left-0 w-max bg-gray-800 text-sm text-gray-300 px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" dir="rtl">
                       عنوان فارسی: چرخه معیوب تحقیق و توسعه نمادین در ایران
                     </span>
                  </h1>
                  <p className="text-xs text-gray-500 italic mt-1">A methodological reframing using evidence tracking (Miles, Huberman, & Saldaña, 2014) with network displays to show inter-indicator logic.</p>
               </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                  <input
                      type="text"
                      placeholder="Search nodes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-md py-1.5 px-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                   <svg className="w-4 h-4 absolute right-3 top-2.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
              </div>
              <div className="flex items-center space-x-3 border-l border-gray-700 pl-4">
                  <LegendItem colorClass="bg-rose-600" label="Aggregated"/>
                  <LegendItem colorClass="bg-sky-600" label="Secondary"/>
                  <LegendItem colorClass="bg-teal-600" label="Initial"/>
                  <LegendItem colorClass="bg-amber-500" label="Quote"/>
              </div>
               <button onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
               </button>
            </div>
          </div>
        </header>
        <div className="flex-1 relative">
          <NetworkGraph 
            data={filteredGraphData} 
            onNodeClick={handleNodeClick}
            selectedNodeId={selectedNode?.id || null} 
          />
        </div>
      </main>
      <RightSidebar isOpen={isRightSidebarOpen} />
      <DetailsPanel 
        selectedNode={selectedNode}
        selectedQuote={selectedQuote}
        onClear={handleClearSelection}
      />
    </div>
  );
};

export default App;
