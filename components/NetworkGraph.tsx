import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { GraphData, Node as NodeType, Link as LinkType } from '../types';

interface NetworkGraphProps {
  data: GraphData;
  onNodeClick: (node: NodeType) => void;
  selectedNodeId: string | null;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ data, onNodeClick, selectedNodeId }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const simulationRef = useRef<d3.Simulation<NodeType, LinkType> | null>(null);
  const zoomContainerRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const parent = svg.node()?.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;
    svg.attr('width', width).attr('height', height);

    const zoomContainer = d3.select(zoomContainerRef.current);

    let link = zoomContainer.select<SVGGElement>('.links').selectAll<SVGLineElement, LinkType>('line');
    let node = zoomContainer.select<SVGGElement>('.nodes').selectAll<SVGGElement, NodeType>('g');
    
    const nodes = data.nodes.map(d => ({...d}));
    const links = data.links.map(d => ({...d}));
    
    if (!simulationRef.current) {
        simulationRef.current = d3.forceSimulation<NodeType, LinkType>()
            .force('link', d3.forceLink<NodeType, LinkType>().id(d => d.id).distance(70))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('x', d3.forceX(width / 2).strength(0.1))
            .force('y', d3.forceY(height / 2).strength(0.1));
    }
    
    const simulation = simulationRef.current;

    link = link.data(links, d => `${d.source}-${d.target}`);
    link.exit().remove();
    const linkEnter = link.enter().append('line').attr('stroke', 'rgba(107, 114, 128, 0.5)').attr('stroke-width', 1.5);
    link = linkEnter.merge(link);

    node = node.data(nodes, d => d.id);
    node.exit().remove();
    const nodeEnter = node.enter().append('g')
        .on('click', (event, d) => {
            onNodeClick(d);
            event.stopPropagation();
        })
        .call(d3.drag<SVGGElement, NodeType>()
              .on("start", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
              })
              .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
              })
              .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
              }));

    nodeEnter.append('circle');
    nodeEnter.append('text')
        .attr('dy', -20)
        .attr('text-anchor', 'middle')
        .attr('fill', '#e5e7eb')
        .attr('font-size', '10px')
        .attr('paint-order', 'stroke')
        .attr('stroke', '#111827')
        .attr('stroke-width', '3px');
        
    node = nodeEnter.merge(node);
    
    node.select('circle')
        .attr('r', d => d.radius)
        .attr('class', d => d.color)
        .attr('stroke', d => selectedNodeId === d.id ? '#34d399' : '#4b5563')
        .attr('stroke-width', d => selectedNodeId === d.id ? 3 : 1.5);
        
    node.select('text').text(d => d.label);
        
    simulation.nodes(nodes);
    simulation.force<d3.ForceLink<NodeType, LinkType>>('link')?.links(links);
    
    simulation.on('tick', () => {
        link
            .attr('x1', d => (d.source as unknown as NodeType).x!)
            .attr('y1', d => (d.source as unknown as NodeType).y!)
            .attr('x2', d => (d.target as unknown as NodeType).x!)
            .attr('y2', d => (d.target as unknown as NodeType).y!);

        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
            zoomContainer.attr('transform', event.transform);
        });

    svg.call(zoom);
    
    simulation.alpha(1).restart();
    
    return () => {
      simulation.stop();
    };

  }, [data, onNodeClick, selectedNodeId]);

  return (
    <div className="w-full h-full absolute top-0 left-0 bg-gray-800/50 rounded-lg overflow-hidden">
      <svg ref={svgRef}>
        <g ref={zoomContainerRef} className="zoom-container">
          <g className="links"></g>
          <g className="nodes"></g>
        </g>
      </svg>
    </div>
  );
};

export default NetworkGraph;