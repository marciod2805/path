import React, { useState, useEffect } from 'react';
import {
    Shield, AlertTriangle, Map as MapIcon, CheckCircle, Skull,
    Save, Info, ChevronDown, ChevronRight, Anchor,
    BookOpen, Search, X, Maximize2, Minimize2,
    Sparkles, MessageSquare, Send, Filter, LogIn
} from 'lucide-react';
import InteractiveMap from '../../../components/InteractiveMap';
import { ChecklistItem, Phase, MapRegion } from '../../../types';


const callGemini = async (prompt: string, systemInstruction: string): Promise<string | undefined> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    const delays = [1000, 2000, 4000];
    for (let i = 0; i <= delays.length; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (i < delays.length) {
                    await new Promise(r => setTimeout(r, delays[i]));
                    continue;
                }
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "The wind is howling... I couldn't hear the response.";
        } catch (error) {
            if (i === delays.length) return "Meditate on this... (Network Error)";
        }
    }
};


const BASE_MAP_URLS: Record<string, string> = {
    white_orchard: 'https://mapgenie.io/witcher-3/maps/white-orchard',
    velen: 'https://mapgenie.io/witcher-3/maps/velen-novigrad',
    skellige: 'https://mapgenie.io/witcher-3/maps/skellige',
    kaer_morhen: 'https://mapgenie.io/witcher-3/maps/kaer-morhen',
    toussaint: 'https://mapgenie.io/witcher-3/maps/toussaint'
};

const roadmapData: Phase[] = [
    {
        id: 'phase-1',
        title: 'Phase I: White Orchard',
        mapRegion: 'white_orchard',
        description: 'The Containment Zone. Do not kill the Griffin until all side content is green.',
        color: 'border-l-4 border-gray-400',
        items: [
            {
                id: 'wo-1',
                title: 'The Crystal Skull',
                mapSearchTerm: 'Crystal Skull',
                type: 'missable',
                shortDesc: 'Yennefer\'s item. Pick up immediately.',
                longDesc: 'As soon as the opening cutscene ends (Geralt & Vesemir discussion), DO NOT get on your horse yet. Look slightly north of the road. Use Witcher Senses to find a glowing bird skull on the ground.',
                location: 'Start Point / Crossroads',
                wikiSearch: 'The Crystal Skull Witcher 3',
                coordinates: [350, 450]
            },
            {
                id: 'wo-2',
                title: 'Gwent: The Scholar',
                mapSearchTerm: 'Scholar',
                type: 'critical',
                shortDesc: 'Win the Zoltan card at the Inn.',
                longDesc: 'Inside the White Orchard Inn, there is a scholar teaching Gwent. You MUST beat him now. If you leave White Orchard without beating him, the Zoltan Chivay card is lost forever.',
                location: 'White Orchard Inn',
                wikiSearch: 'Collect \'Em All',
                coordinates: [400, 500]
            },
            {
                id: 'wo-3',
                title: 'Viper School Gear',
                mapSearchTerm: 'Viper',
                type: 'gear',
                shortDesc: 'Find both diagrams (Steel & Silver).',
                longDesc: '1. Silver Sword: In the Cemetery north of the Mill. In the crypt, loot the corpse. 2. Steel Sword: Ransacked Village, in the Bandit fortress ruins on the hill. Kept in a chest.',
                location: 'Cemetery & Ransacked Village',
                wikiSearch: 'Serpentine Steel Sword',
                coordinates: [600, 600]
            },
            {
                id: 'wo-4',
                title: 'Quest: On Death\'s Bed',
                mapSearchTerm: 'Tomira',
                type: 'quest',
                shortDesc: 'Brew Swallow for Tomira.',
                longDesc: 'Talk to the herbalist Tomira. She is trying to save a girl. You must brew the "Swallow" potion and give it to her. This unlocks a followup in Velen later.',
                location: 'Tomira\'s Hut',
                wikiSearch: 'On Death\'s Bed',
                coordinates: [450, 400]
            },
            {
                id: 'wo-6',
                title: 'Clear All "?" Markers',
                mapSearchTerm: 'Place of Power',
                type: 'exploration',
                shortDesc: '6 Places of Power, Smuggler Caches, Nests.',
                longDesc: 'There are 6 Places of Power here. Getting all 6 buffs at once grants the "Power Overwhelming" achievement. Do this before leaving.',
                location: 'Entire White Orchard Map',
                wikiSearch: 'White Orchard Places of Power',
                coordinates: [500, 500]
            }
        ]
    },
    {
        id: 'phase-2',
        title: 'Phase II: Velen (The Critical Path)',
        mapRegion: 'velen',
        description: 'Huge map. Focus on missable interactions before advancing the main story.',
        color: 'border-l-4 border-green-700',
        items: [
            {
                id: 'vel-1',
                title: 'The Bloody Baron (Gwent)',
                mapSearchTerm: 'Bloody Baron',
                type: 'critical',
                shortDesc: 'Win the Sigismund Dijkstra card.',
                longDesc: 'As soon as you gain access to the Baron\'s office, challenge him to Gwent. If you progress his questline too far (Family Matters), he may leave or die, and the card becomes missable.',
                location: 'Crow\'s Perch',
                wikiSearch: 'Bloody Baron Gwent'
            },
            {
                id: 'vel-2',
                title: 'Keira Metz (Full Questline)',
                mapSearchTerm: 'Keira Metz',
                type: 'critical',
                shortDesc: 'Invitation to Kaer Morhen.',
                longDesc: 'Complete "An Invitation from Keira Metz", "A Towerful of Mice", and "A Favor for a Friend". CRITICAL ENDING: In "For the Advancement of Learning", convince her to go to Kaer Morhen. Do NOT kill her.',
                location: 'Keira\'s Hut',
                wikiSearch: 'For the Advancement of Learning'
            },
            {
                id: 'vel-3',
                title: 'The Fall of the House of Reardon',
                mapSearchTerm: 'Reardon',
                type: 'quest',
                shortDesc: 'Recruit Letho (If he is alive in your save).',
                longDesc: 'Take the contract in Lindenvale. Go to the manor. Avoid the traps. Find Letho in the barn. Help him deal with his pursuers. Invite him to Kaer Morhen at the end.',
                location: 'Reardon Manor',
                wikiSearch: 'Ghosts of the Past'
            }
        ]
    },
    {
        id: 'phase-3',
        title: 'Phase III: Novigrad (City of Missables)',
        mapRegion: 'velen',
        description: 'The political center. High risk of failing "Full Crew" here.',
        color: 'border-l-4 border-yellow-600',
        items: [
            {
                id: 'nov-1',
                title: 'A Matter of Life and Death',
                mapSearchTerm: 'Vegelbud',
                type: 'critical',
                shortDesc: 'Triss Gwent Cards (Dandelion, Milva, Vampire).',
                longDesc: 'During the masquerade ball with Triss, there is a yellow "!" in the garden maze. You MUST play the Gwent tournament there. These 3 cards are completely missable if you leave the party.',
                location: 'Vegelbud Estate',
                wikiSearch: 'A Matter of Life and Death'
            },
            {
                id: 'nov-2',
                title: 'Now or Never',
                mapSearchTerm: 'Now or Never',
                type: 'critical',
                shortDesc: 'Mage Escape & Triss Romance.',
                longDesc: 'Help the mages escape. At the docks, if you want to romance Triss, tell her you love her. Regardless of romance, ask her to go to Kaer Morhen (she will go briefly then return).',
                location: 'Novigrad Docks',
                wikiSearch: 'Now or Never'
            },
            {
                id: 'nov-3',
                title: 'A Dangerous Game',
                mapSearchTerm: 'Rosemary',
                type: 'missable',
                shortDesc: 'Zoltan\'s quest. TAKE THE CARDS.',
                longDesc: 'Help Zoltan fetch the cards. At the end of the quest, he asks if you want the cards or the gold. CHOOSE THE CARDS (Isengrim, Fringilla, Natalis). The money is worthless compared to the achievement.',
                location: 'Rosemary and Thyme',
                wikiSearch: 'A Dangerous Game'
            },
            {
                id: 'nov-4',
                title: 'An Eye for an Eye',
                mapSearchTerm: 'Roche',
                type: 'critical',
                shortDesc: 'Save Ves. Recruit Roche.',
                longDesc: 'Roche will ask for help. You must go to the Hanged Man\'s Tree area. CRITICAL: Ves will disobey orders and attack. You must sprint and kill her attackers immediately. If Ves dies, you cannot recruit Roche for Full Crew.',
                location: 'Temerian Partisan Camp',
                wikiSearch: 'An Eye for an Eye'
            },
            {
                id: 'nov-5',
                title: 'High Stakes',
                mapSearchTerm: 'Passiflora',
                type: 'achievement',
                shortDesc: 'Passiflora Gwent Tournament.',
                longDesc: 'Requires strong deck. Save before entering. You must win 4 matches in a row. If you lose one, you are out. Reload save. Do not agree to split the prize unless you want to, but winning is the priority.',
                location: 'Passiflora',
                wikiSearch: 'High Stakes'
            }
        ]
    },
    {
        id: 'phase-4',
        title: 'Phase IV: Skellige Sequence',
        mapRegion: 'skellige',
        description: 'Specific order required to avoid bugging "Flesh for Sale".',
        color: 'border-l-4 border-blue-700',
        items: [
            {
                id: 'sk-1',
                title: 'Flesh for Sale (Quest Conflict)',
                mapSearchTerm: 'Trottheim',
                type: 'warning',
                shortDesc: 'Do this BEFORE "Following the Thread".',
                longDesc: 'Go to the island of Faroe (South East). Find the pirates at Trottheim. If you have already started "Following the Thread" and met Lambert, the pirates will be hostile immediately and you will fail this quest.',
                location: 'Faroe',
                wikiSearch: 'Flesh for Sale'
            },
            {
                id: 'sk-2',
                title: 'The Lord of Undvik',
                mapSearchTerm: 'Undvik',
                type: 'quest',
                shortDesc: 'Rescue Hjalmar, Folan, and Vigi.',
                longDesc: '1. Find Folan being cooked by trolls. 2. Find Vigi the Loon locked in a cage near the Giant. Do not let him out until the boss fight starts, or silence him so the Giant doesn\'t wake up. You need Hjalmar for Full Crew.',
                location: 'Undvik',
                wikiSearch: 'The Lord of Undvik'
            },
            {
                id: 'sk-3',
                title: 'Coronation (King\'s Gambit)',
                mapSearchTerm: 'Kaer Trolde',
                type: 'critical',
                shortDesc: 'Choose a ruler.',
                longDesc: 'You must help either Cerys or Hjalmar during the feast bear attack. Do NOT ignore the investigation ("You guys handle it"), or Svanrige becomes King and you lose allies.',
                location: 'Kaer Trolde',
                wikiSearch: 'King\'s Gambit'
            }
        ]
    },
    {
        id: 'phase-5',
        title: 'Phase V: The Isle of Mists',
        mapRegion: 'kaer_morhen',
        description: 'STOP. Check everything below before entering the boat to the Isle.',
        color: 'border-l-4 border-red-600',
        items: [
            {
                id: 'act2-1',
                title: 'Brothers in Arms: Velen',
                mapSearchTerm: 'Kaer Morhen',
                type: 'critical',
                shortDesc: 'Keira Metz & Letho confirmed?',
                longDesc: 'Check your quest log. Keira should be at Kaer Morhen. Letho (if alive) should be sent there.',
                location: 'Kaer Morhen',
                wikiSearch: 'Brothers in Arms: Velen'
            },
            {
                id: 'act2-2',
                title: 'Brothers in Arms: Novigrad',
                mapSearchTerm: 'Novigrad',
                type: 'critical',
                shortDesc: 'Triss, Roche, Ves, Zoltan.',
                longDesc: 'Triss handles herself. Roche and Ves must be alive and allied (Eye for an Eye completed). Zoltan helps automatically.',
                location: 'Novigrad',
                wikiSearch: 'Brothers in Arms: Novigrad'
            },
            {
                id: 'act2-3',
                title: 'Brothers in Arms: Skellige',
                mapSearchTerm: 'Kaer Trolde',
                type: 'critical',
                shortDesc: 'Hjalmar, Cerys, Ermion.',
                longDesc: 'If a Craite sits on the throne, Hjalmar will join you. Ermion will join you.',
                location: 'Skellige',
                wikiSearch: 'Brothers in Arms: Skellige'
            }
        ]
    },
    {
        id: 'phase-6',
        title: 'Phase VI: Hearts of Stone',
        mapRegion: 'velen',
        description: 'Level 32+ Content. North-East Velen expansion.',
        color: 'border-l-4 border-blue-400',
        items: [
            {
                id: 'hos-1',
                title: 'Wild Rose Dethorned',
                mapSearchTerm: 'Arthach Palace Ruins',
                type: 'achievement',
                shortDesc: 'Clear 8 Fallen Knight Camps.',
                longDesc: 'You must kill all enemies and LOOT THE RED CHEST in all 8 camps. Bug Warning: Do not fast travel out of a camp while clearing it. Do it in one go.',
                location: 'North-East Velen',
                wikiSearch: 'Wild Rose Dethorned locations'
            },
            {
                id: 'hos-2',
                title: 'Open Sesame! (Auction)',
                mapSearchTerm: 'Auction House',
                type: 'missable',
                shortDesc: 'Buy 3 items at Auction House.',
                longDesc: 'During the auction, you must buy: 1. The Statuette (Quest item), 2. The Painting (Sell later), 3. The Glasses (Wearable). Bring at least 1000 crowns.',
                location: 'Auction House (Oxenfurt)',
                wikiSearch: 'Open Sesame'
            }
        ]
    },
    {
        id: 'phase-7',
        title: 'Phase VII: Blood and Wine',
        mapRegion: 'toussaint',
        description: 'The Grand Finale. Toussaint.',
        color: 'border-l-4 border-red-800',
        items: [
            {
                id: 'baw-1',
                title: 'David and Golyat',
                mapSearchTerm: 'Dulcine',
                type: 'missable',
                shortDesc: 'Kill the first boss with a crossbow eye shot.',
                longDesc: 'The very first boss you fight in Toussaint (The Giant). You must kill him by shooting him in the eye with your crossbow. If you kill him normally, reload.',
                location: 'Dulcine Windmill',
                wikiSearch: 'David and Golyat achievement'
            },
            {
                id: 'baw-2',
                title: 'The Warble of a Smitten Knight',
                mapSearchTerm: 'Tourney Grounds',
                type: 'achievement',
                shortDesc: 'Win the Tourney.',
                longDesc: 'You must choose to enter the tourney. You must win all 5 competitions: Shooting, Racing, Dueling, Arena Battle, and the Final Duel. Save before each.',
                location: 'Tourney Grounds',
                wikiSearch: 'The Warble of a Smitten Knight'
            }
        ]
    }
];

const IconMap: Record<string, React.ComponentType<any>> = {
    missable: AlertTriangle,
    critical: Skull,
    gear: Shield,
    quest: CheckCircle,
    exploration: MapIcon,
    contract: CheckCircle,
    warning: AlertTriangle,
    task: CheckCircle,
    save: Save,
    achievement: Anchor,
    decision: Info
};

export default function WitcherCommandCenterV5() {
    const [progress, setProgress] = useState<Record<string, boolean>>({});
    const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({ 'phase-1': true });
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [totalProgress, setTotalProgress] = useState(0);

    // MAP & UI STATES
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [activeMapRegion, setActiveMapRegion] = useState<MapRegion>('white_orchard');
    const [searchQuery, setSearchQuery] = useState('');

    // GEMINI STATES
    const [isCodexOpen, setIsCodexOpen] = useState(false);
    const [codexQuery, setCodexQuery] = useState('');
    const [codexResponse, setCodexResponse] = useState('');
    const [isCodexLoading, setIsCodexLoading] = useState(false);
    const [itemAdvice, setItemAdvice] = useState<Record<string, string>>({});
    const [loadingAdvice, setLoadingAdvice] = useState<Record<string, boolean>>({});
    const [focusedItem, setFocusedItem] = useState<ChecklistItem | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('witcher-command-progress');
        if (saved) {
            try {
                setProgress(JSON.parse(saved));
            } catch (e) {
                setProgress({});
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('witcher-command-progress', JSON.stringify(progress));
        const totalItems = roadmapData.reduce((acc, section) => acc + section.items.length, 0);
        const completedItems = Object.values(progress).filter(Boolean).length;
        setTotalProgress(Math.round((completedItems / totalItems) * 100));
    }, [progress]);



    const toggleItemCheck = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setProgress(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const togglePhase = (id: string, mapRegion: MapRegion) => {
        setExpandedPhases(prev => {
            if (!prev[id]) setActiveMapRegion(mapRegion);
            return { ...prev, [id]: !prev[id] };
        });
    };

    const toggleItemDetails = (id: string) => {
        setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleMap = () => setIsMapOpen(!isMapOpen);



    const openWiki = (e: React.MouseEvent, term: string) => {
        e.stopPropagation();
        window.open(`https://witcher.fandom.com/wiki/Special:Search?query=${encodeURIComponent(term)}`, '_blank');
    };


    const handleSmartLocate = (e: React.MouseEvent, item: ChecklistItem, region: MapRegion) => {
        e.stopPropagation();
        if (!isMapOpen) setIsMapOpen(true);
        setActiveMapRegion(region);
        setFocusedItem(item);
    };

    const openMapExternal = () => {
        const url = BASE_MAP_URLS[activeMapRegion];
        window.open(url, '_blank');
    };


    const handleConsultVesemir = async (e: React.MouseEvent, item: ChecklistItem) => {
        e.stopPropagation();
        if (itemAdvice[item.id] || loadingAdvice[item.id]) return;

        setLoadingAdvice(prev => ({ ...prev, [item.id]: true }));
        const systemPrompt = "You are Vesemir. Give concise, tactical advice (under 50 words) for the specific quest/item. Focus on missables and combat tips. Be grumpy.";
        const userPrompt = `Advice for: ${item.title}. Details: ${item.longDesc}`;
        const response = await callGemini(userPrompt, systemPrompt);

        // Safety check to ensure response is a string
        const safeResponse = typeof response === 'string' ? response : "Vesemir grunted. (Error receiving advice)";

        setItemAdvice(prev => ({ ...prev, [item.id]: safeResponse }));
        setLoadingAdvice(prev => ({ ...prev, [item.id]: false }));
    };

    const handleCodexSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!codexQuery.trim()) return;
        setIsCodexLoading(true);
        setCodexResponse('');
        const systemPrompt = "You are the Witcher's Codex. Answer questions about monsters, locations, and lore in The Witcher 3. Keep answers concise.";
        const response = await callGemini(codexQuery, systemPrompt);

        // Safety check
        const safeResponse = typeof response === 'string' ? response : "The pages are faded... (Error receiving response)";

        setCodexResponse(safeResponse);
        setIsCodexLoading(false);
    };


    const getFilteredData = (): Phase[] => {
        if (!searchQuery) return roadmapData;
        const lowerQuery = searchQuery.toLowerCase();

        return roadmapData.reduce<Phase[]>((acc, phase) => {
            const filteredItems = phase.items.filter(item =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.shortDesc.toLowerCase().includes(lowerQuery)
            );

            if (filteredItems.length > 0) {
                acc.push({ ...phase, items: filteredItems, forceExpand: true });
            }
            return acc;
        }, []);
    };

    const filteredData = getFilteredData();



    return (
        <div className="flex flex-col h-screen bg-[#121212] text-[#e0e0e0] font-sans overflow-hidden">




            <div className="h-16 bg-[#1a1a1a] border-b border-[#333] flex items-center justify-between px-4 md:px-6 shadow-lg z-20 shrink-0">
                <div className="flex items-center gap-3 md:gap-4">
                    <Shield className="w-6 h-6 md:w-8 md:h-8 text-[#a81c1c]" />
                    <h1 className="text-lg md:text-2xl font-bold uppercase tracking-wider text-[#f0f0f0] hidden md:block font-serif">
                        Witcher 3 Command
                    </h1>
                </div>


                <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                    <input
                        type="text"
                        placeholder="Search checklist (e.g. 'Gwent')..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#121212] border border-[#333] rounded-full pl-9 pr-4 py-1.5 text-sm text-[#ccc] focus:outline-none focus:border-[#a81c1c] transition-colors"
                    />
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={() => setIsCodexOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all bg-[#2a2a2a] text-[#ffd700] border border-[#ffd700]/30 hover:bg-[#333]"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="hidden lg:inline">Codex</span>
                    </button>

                    <button
                        onClick={toggleMap}
                        className={`
              flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border
              ${isMapOpen
                                ? 'bg-[#a81c1c] text-white border-[#ff4d4d]'
                                : 'bg-[#333] text-[#ccc] border-[#444] hover:bg-[#444]'
                            }
            `}
                    >
                        {isMapOpen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        <span className="hidden lg:inline">{isMapOpen ? 'Close Map' : 'Map'}</span>
                    </button>
                </div>
            </div>


            <div className="flex flex-1 overflow-hidden relative">


                <div className={`flex-1 overflow-y-auto bg-[#121212] transition-all duration-300 ${isMapOpen ? 'hidden md:block md:w-1/2 lg:w-5/12' : 'w-full'}`}>
                    <div className="p-4 md:p-6 space-y-6 pb-24">


                        <div className="sm:hidden mb-4 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                            <input
                                type="text"
                                placeholder="Search checklist..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#121212] border border-[#333] rounded-full pl-9 pr-4 py-2 text-sm text-[#ccc]"
                            />
                        </div>


                        <div className="flex justify-between items-end border-b border-[#333] pb-4 mb-2">
                            <div className="text-right">
                                <div className="text-[10px] text-[#555] uppercase tracking-widest font-bold">Total Completion</div>
                                <div className="text-xl font-bold text-[#ff4d4d]">{totalProgress}%</div>
                            </div>
                        </div>

                        {filteredData.length === 0 && (
                            <div className="text-center py-10 text-[#555]">
                                <Filter className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                <p>No items found for "{searchQuery}"</p>
                            </div>
                        )}

                        {filteredData.map((phase) => (
                            <div key={phase.id} className={`bg-[#1e1e1e] rounded-xl overflow-hidden border border-[#333] ${phase.color}`}>


                                <div className="flex flex-col md:flex-row md:items-center bg-[#252525] border-b border-[#333] group hover:bg-[#2a2a2a] transition-all">
                                    <button
                                        onClick={() => togglePhase(phase.id, phase.mapRegion)}
                                        className="flex-1 p-4 flex items-center justify-between text-left"
                                    >
                                        <div>
                                            <h2 className="text-lg font-bold text-[#f0f0f0] flex items-center gap-3">
                                                {phase.title}
                                            </h2>
                                            {!searchQuery && <p className="text-xs text-[#888] mt-1 font-serif italic">{phase.description}</p>}
                                        </div>
                                        {(expandedPhases[phase.id] || phase.forceExpand) ?
                                            <ChevronDown className="w-5 h-5 text-[#666]" /> :
                                            <ChevronRight className="w-5 h-5 text-[#666]" />
                                        }
                                    </button>

                                    {isMapOpen && activeMapRegion !== phase.mapRegion && (
                                        <button
                                            onClick={() => setActiveMapRegion(phase.mapRegion)}
                                            className="mx-4 mb-3 md:mb-0 text-[10px] bg-[#333] hover:bg-[#a81c1c] text-white px-3 py-1.5 rounded uppercase font-bold tracking-wider transition-colors border border-[#444]"
                                        >
                                            Show on Map
                                        </button>
                                    )}
                                </div>


                                {(expandedPhases[phase.id] || phase.forceExpand || searchQuery) && (
                                    <div className="p-2 space-y-2 bg-[#181818]">
                                        {phase.items.map((item) => {
                                            const Icon = IconMap[item.type] || Info;
                                            const isChecked = progress[item.id];
                                            const isExpanded = expandedItems[item.id] || searchQuery;
                                            const isCritical = item.type === 'critical' || item.type === 'warning';
                                            const advice = itemAdvice[item.id];
                                            const isLoading = loadingAdvice[item.id];

                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`
                            rounded-lg transition-all duration-300 border relative overflow-hidden
                            ${isChecked
                                                            ? 'bg-[#1a1a1a] border-[#2a2a2a] opacity-50'
                                                            : 'bg-[#222] border-[#333] hover:border-[#555] shadow-lg'
                                                        }
                            ${!isChecked && isCritical ? 'border-l-[4px] border-l-red-600' : ''}
                          `}
                                                >
                                                    <div
                                                        className="p-3 flex items-start gap-3 cursor-pointer"
                                                        onClick={() => toggleItemDetails(item.id)}
                                                    >
                                                        <div
                                                            onClick={(e) => toggleItemCheck(e, item.id)}
                                                            className={`
                                mt-1 min-w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 flex-shrink-0
                                ${isChecked
                                                                    ? 'bg-green-800 border-green-800 text-white'
                                                                    : 'bg-transparent border-[#555] hover:border-[#888]'
                                                                }
                              `}
                                                        >
                                                            {isChecked && <CheckCircle className="w-3.5 h-3.5" />}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-wrap items-center gap-x-2 mb-0.5">
                                                                {isCritical && !isChecked && (
                                                                    <span className="text-[9px] font-bold bg-red-600 text-white px-1.5 rounded-sm uppercase tracking-wider">
                                                                        Critical
                                                                    </span>
                                                                )}
                                                                <h3 className={`font-bold text-sm md:text-base truncate ${isChecked ? 'text-[#555] line-through' : 'text-[#e0e0e0]'}`}>
                                                                    {item.title}
                                                                </h3>
                                                            </div>
                                                            <p className={`text-xs ${isChecked ? 'text-[#555]' : 'text-[#999]'}`}>
                                                                {item.shortDesc}
                                                            </p>
                                                        </div>

                                                        <Icon className={`w-5 h-5 flex-shrink-0 ${isCritical ? 'text-red-500' : 'text-[#444]'}`} />
                                                    </div>

                                                    {isExpanded && (
                                                        <div className="px-3 pb-3 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                                                            <div className="pt-3 border-t border-[#333] mt-1 space-y-3">
                                                                <p className="text-[#ccc] text-xs leading-5">{item.longDesc}</p>

                                                                {advice && (
                                                                    <div className="bg-[#2a2a2a] p-3 rounded border-l-2 border-[#ffd700] text-xs">
                                                                        <div className="flex items-center gap-2 mb-1 text-[#ffd700] font-bold uppercase tracking-wider">
                                                                            <Sparkles className="w-3 h-3" /> Vesemir's Tip:
                                                                        </div>
                                                                        <p className="text-[#e0e0e0] italic leading-relaxed">"{advice}"</p>
                                                                    </div>
                                                                )}


                                                                <div className="grid grid-cols-3 gap-2">
                                                                    <button
                                                                        onClick={(e) => handleSmartLocate(e, item, phase.mapRegion)}
                                                                        className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#333] text-[#ccc] py-2 rounded text-xs transition-colors font-medium border border-[#333] hover:text-blue-400 group"
                                                                    >
                                                                        <MapIcon className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                                                                        Locate
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => openWiki(e, item.wikiSearch)}
                                                                        className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#333] text-[#ccc] py-2 rounded text-xs transition-colors font-medium border border-[#333] hover:text-orange-400 group"
                                                                    >
                                                                        <BookOpen className="w-3.5 h-3.5 text-orange-500 group-hover:scale-110 transition-transform" />
                                                                        Wiki
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => handleConsultVesemir(e, item)}
                                                                        disabled={!!(isLoading || advice)}
                                                                        className={`
                                      flex items-center justify-center gap-2 py-2 rounded text-xs transition-colors font-medium border
                                      ${advice
                                                                                ? 'bg-[#1a1a1a] text-[#555] border-[#333] cursor-default'
                                                                                : isLoading
                                                                                    ? 'bg-[#333] text-[#888] border-[#444] cursor-wait'
                                                                                    : 'bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-200 border-indigo-800/50'
                                                                            }
                                    `}
                                                                    >
                                                                        {isLoading ? <span>...</span> : advice ? <span>Done</span> : (
                                                                            <>
                                                                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                                                                Vesemir
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}

                        <button
                            onClick={() => {
                                if (window.confirm('Reset progress?')) setProgress({});
                            }}
                            className="w-full text-center text-xs text-[#444] hover:text-red-500 uppercase tracking-widest py-4"
                        >
                            Reset All Data
                        </button>
                    </div>
                </div>


                <div className={`
          absolute inset-0 z-30 bg-[#121212] transition-transform duration-300 md:relative md:inset-auto md:translate-x-0 flex flex-col
          ${isMapOpen ? 'translate-x-0 md:w-1/2 lg:w-7/12 border-l border-[#333]' : 'translate-x-full md:hidden w-0'}
        `}>

                    <div className="h-10 bg-[#1a1a1a] flex items-center justify-between px-3 border-b border-[#333]">
                        <span className="text-xs font-bold text-[#888] uppercase tracking-wider flex items-center gap-2">
                            Interactive Map
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={openMapExternal}
                                className="flex items-center gap-2 bg-[#a81c1c] hover:bg-[#c42121] text-white text-[10px] font-bold px-3 py-1 rounded transition-colors border border-[#ff4d4d]"
                                title="Login / Sync features require external tab"
                            >
                                <LogIn className="w-3 h-3" /> Open to Login / Sync
                            </button>
                            <button
                                onClick={toggleMap}
                                className="p-1.5 hover:bg-[#333] rounded text-[#ccc] md:hidden"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 bg-black relative w-full h-full overflow-hidden">
                        <InteractiveMap
                            activeMapRegion={activeMapRegion}
                            items={filteredData.flatMap(phase => phase.items)}
                            focusedItem={focusedItem}
                        />
                    </div>
                </div>

            </div>


            {isCodexOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1e1e1e] border border-[#444] rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]">
                        <div className="flex items-center justify-between p-4 border-b border-[#333] bg-[#252525] rounded-t-xl">
                            <div className="flex items-center gap-2 text-[#ffd700]">
                                <Sparkles className="w-5 h-5" />
                                <h3 className="font-bold font-serif tracking-wider">The Witcher's Codex</h3>
                            </div>
                            <button onClick={() => setIsCodexOpen(false)} className="text-[#888] hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto min-h-[300px] flex flex-col gap-4">
                            {codexResponse ? (
                                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center flex-shrink-0 border border-[#555]">
                                            <MessageSquare className="w-4 h-4 text-[#888]" />
                                        </div>
                                        <div className="bg-[#2a2a2a] p-3 rounded-lg text-sm text-[#ccc] border border-[#333]">
                                            <p className="font-bold text-[#888] text-xs uppercase mb-1">Query</p>
                                            {codexQuery}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-900/30 flex items-center justify-center flex-shrink-0 border border-indigo-500/30">
                                            <Sparkles className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <div className="bg-[#1a1a1a] p-4 rounded-lg text-sm text-[#e0e0e0] border border-[#333] leading-relaxed shadow-inner">
                                            <p className="font-bold text-indigo-400 text-xs uppercase mb-2">Codex Entry</p>
                                            {codexResponse}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-[#555] space-y-3">
                                    <BookOpen className="w-12 h-12 opacity-20" />
                                    <p className="text-center text-sm px-8">"Search the ancient texts..."</p>
                                </div>
                            )}
                        </div>
                        <form onSubmit={handleCodexSubmit} className="p-4 border-t border-[#333] bg-[#252525] rounded-b-xl">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={codexQuery}
                                    onChange={(e) => setCodexQuery(e.target.value)}
                                    placeholder="Ask the Codex..."
                                    className="flex-1 bg-[#151515] border border-[#444] rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-[#ffd700] transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={isCodexLoading || !codexQuery.trim()}
                                    className={`
                    px-4 py-2 rounded bg-[#ffd700] text-black font-bold flex items-center justify-center transition-all
                    ${isCodexLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#ffed4a] hover:scale-105'}
                  `}
                                >
                                    {isCodexLoading ? <span className="animate-spin">⏳</span> : <Send className="w-4 h-4" />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
