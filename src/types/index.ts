export type MapRegion = 'white_orchard' | 'velen' | 'skellige' | 'kaer_morhen' | 'toussaint';

export interface ChecklistItem {
    id: string;
    title: string;
    mapSearchTerm: string;
    type: 'missable' | 'critical' | 'gear' | 'quest' | 'exploration' | 'contract' | 'warning' | 'task' | 'save' | 'achievement' | 'decision';
    shortDesc: string;
    longDesc: string;
    location: string;
    wikiSearch: string;
    coordinates?: [number, number];
}

export interface Phase {
    id: string;
    title: string;
    mapRegion: MapRegion;
    description: string;
    color: string;
    items: ChecklistItem[];
    forceExpand?: boolean;
}
