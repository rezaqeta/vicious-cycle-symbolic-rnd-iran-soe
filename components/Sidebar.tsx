import React, { useMemo, useState } from 'react';
import { quotesData } from '../data/quotes';

interface SidebarProps {
    isOpen: boolean;
}

export const LeftSidebar: React.FC<SidebarProps> = ({ isOpen }) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const structuredData = useMemo(() => {
        const data: Record<string, Record<string, Record<string, string[]>>> = {};
        quotesData.forEach(item => {
            if (!data[item.aggregatedDimension]) data[item.aggregatedDimension] = {};
            if (!data[item.aggregatedDimension][item.secondaryTheme]) data[item.aggregatedDimension][item.secondaryTheme] = {};
            if (!data[item.aggregatedDimension][item.secondaryTheme][item.initialCode]) data[item.aggregatedDimension][item.secondaryTheme][item.initialCode] = [];
            data[item.aggregatedDimension][item.secondaryTheme][item.initialCode].push(item.refCode);
        });
        return data;
    }, []);

    const toggle = (key: string) => {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!isOpen) return null;

    return (
        <aside className="w-80 bg-gray-800 p-4 border-r border-gray-700 flex flex-col space-y-4 overflow-y-auto">
            <h2 className="text-xl font-semibold text-cyan-400">Research Codes</h2>
            <div className="text-sm text-gray-300">
                {Object.entries(structuredData).map(([dimension, themes]) => (
                    <div key={dimension} className="mb-2">
                        <h3 onClick={() => toggle(dimension)} className="cursor-pointer font-bold text-rose-400 flex items-center">
                             <svg className={`w-4 h-4 mr-1 transition-transform ${expanded[dimension] ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            {dimension}
                        </h3>
                        {expanded[dimension] && (
                            <div className="pl-4 border-l-2 border-gray-700 ml-2">
                                {Object.entries(themes).map(([theme, codes]) => (
                                    <div key={theme} className="mt-1">
                                        <h4 onClick={() => toggle(theme)} className="cursor-pointer text-sky-400 flex items-center">
                                            <svg className={`w-4 h-4 mr-1 transition-transform ${expanded[theme] ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                            {theme}
                                        </h4>
                                        {expanded[theme] && (
                                            <ul className="pl-4 border-l-2 border-gray-600 ml-2 text-xs">
                                                {Object.entries(codes).map(([code, refs]) => (
                                                    <li key={code} className="mt-1 text-teal-400">{code} ({refs.length})</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
};


const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <span className="group relative">
    {children}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 w-72 mb-2 bg-gray-900 border border-cyan-400 text-sm text-gray-200 px-3 py-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10" dir="rtl">
      {text}
    </span>
  </span>
);

export const RightSidebar: React.FC<SidebarProps> = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <aside className="w-[45rem] bg-gray-100 text-gray-800 p-8 border-l border-gray-300 overflow-y-auto font-serif">
            <div className="prose max-w-none">
                <h1 className="text-3xl font-bold mb-2 text-center">The Vicious Cycle of Symbolic Research and Development in Iran: A Network Analysis of State-Owned Companies</h1>
                <p className="text-center text-lg italic">Ali Babaee & Seyed Reza Mirnezami</p>
                <p className="text-center text-sm text-gray-600">Sharif University of Technology</p>
                
                <h2 className="text-2xl font-bold mt-8 border-b pb-2">
                    <Tooltip text="خلاصه: این بخش، متدولوژی تحقیق را بر اساس چارچوب «نمایش داده» مایلز، هابرمن و سالدانا (۲۰۱۴) بازنویسی می‌کند. در مقاله اصلی فارسی از روش «جیویا» استفاده شده بود، اما این رویکرد جدید بر استفاده از ماتریس‌ها و شبکه‌ها برای «ردیابی ادله» و نمایش «منطق بین‌شاخصی» تمرکز دارد تا مسیر تحلیلی از داده‌های خام تا نتایج نهایی به صورت شفاف و بصری قابل پیگیری باشد.">
                        <span className="flex items-center gap-2">
                          1. Methodology 
                          <span title="کامنت متدولوژی">🗒️</span>
                        </span>
                    </Tooltip>
                </h2>
                <p>This study employs a qualitative, multiple-case study design to analyze the feedback loop of symbolic R&D within Iranian state-owned enterprises. The primary analytical strategy is reframed from the original paper's Gioia methodology to one centered on "evidence tracking" through systematic data displays, as advocated by Miles, Huberman, and Saldaña (2014). This approach emphasizes making the analytical process transparent and verifiable, moving from condensed data in matrices to causal flows in network displays. The interactive network graph at the core of this application serves as the primary tool for this analysis, illustrating the inter-indicator logic from raw evidence to aggregated themes.</p>

                <div className="w-full bg-gray-300 my-6 p-4 border border-gray-400 flex items-center justify-center text-gray-500 text-sm italic">
                    [Embedded Static Visualization of the Network Graph]
                </div>

                <h3 className="text-xl font-bold mt-6">1.1 Data Condensation and Analysis Framework</h3>
                <p>Data was collected through semi-structured interviews with senior executives and policymakers. The initial analysis involved condensing these transcripts into a structured format. Following the principles of matrix displays (Miles, Huberman, & Saldaña, 2014, ch. 5), data was segmented and assigned first-cycle codes (Initial Codes). These codes, along with their corresponding quotes (Evidence), form the foundational layer of the analysis.</p>
                <p>These first-level codes were then conceptually clustered into second-order themes (Secondary Themes) and finally into aggregate dimensions. This hierarchical coding structure, while compatible with the Gioia method, is treated here as the basis for a matrix where rows represent cases or quotes and columns represent thematic categories. This step allows for systematic cross-case comparison and prepares the data for network analysis.</p>

                <h3 className="text-xl font-bold mt-6">
                     <Tooltip text="تغییر متدولوژیک: به جای تحلیل تماتیک صرف، این بخش بر تبدیل داده‌های طبقه‌بندی‌شده به یک مدل شبکه‌ای پویا تمرکز دارد. این شبکه، که ابزار اصلی این اپلیکیشن است، صرفاً یک خروجی نیست، بلکه خود فرایند تحلیلی است که روابط علی و منطقی بین شاخص‌های مختلف را به تصویر می‌کشد و امکان ردیابی بصری ادله را فراهم می‌کند.">
                         <span className="flex items-center gap-2">
                          1.2 From Matrix Analysis to Network Displays
                          <span title="کامنت متدولوژی">🗒️</span>
                        </span>
                    </Tooltip>
                </h3>
                <p>The core of this study's methodology lies in the transformation of the structured data into a dynamic causal network. A network display, according to Miles et al. (2014), is a powerful tool for "displaying the interrelationships between variables" and moving toward explanatory conclusions. The interactive graph presented in this tool is that network.</p>
                <p>Each node in the graph represents a piece of data at a specific level of abstraction (Quote, Initial Code, Secondary Theme, Aggregated Dimension). The links between them represent the "logical chain of evidence" (Miles et al., 2014, p. 290) from raw data to theoretical construct. This visual representation allows for a transparent and auditable analytical path. By interacting with the graph, one can trace the evidence for any given theme, making the "inter-indicator logic" explicit rather than relying on scattered quotes within a narrative text.</p>
                
                <h2 className="text-2xl font-bold mt-8 border-b pb-2">References</h2>
                <div className="text-sm space-y-2">
                    <p>Alizadeh, P., Mokhtari Hasan Abad, S., & Sadat Rasoul, S. M. (2024). Analysis of the Legal Infrastructure of Venture-Capital Development in Iran. <em>Iranian Journal of Public Policy, 10</em>(3), 9–29.</p>
                    <p>Attarpour, M. R., Elyasi, M., & Mohammadi, A. (2023). Patterns of Technological Capability Development in Iran's Steel Industry: An Analysis Based on Windows of Opportunity for Technological Learning. <em>Resources Policy, 85</em>, 104040.</p>
                     <p>Miles, M. B., Huberman, A. M., & Saldaña, J. (2014). <em>Qualitative data analysis: A methods sourcebook</em> (3rd ed.). SAGE Publications, Inc.</p>
                </div>
            </div>
        </aside>
    );
};