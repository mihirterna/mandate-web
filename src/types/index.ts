export interface MetricChanges {
  health?: number;
  economy?: number;
  votes?: number;
  relations?: number;
}

export interface Choice {
  text: string;
  consequences: MetricChanges;
  nextCardId?: string;
}

export interface GameCard {
  id: string;
  text: string;
  imagePrompt?: string;
  triggerConditions?: {
    min_health?: number;
    max_health?: number;
    min_economy?: number;
    max_economy?: number;
    min_votes?: number;
    max_votes?: number;
    min_relations?: number;
    max_relations?: number;
  };
  choices: {
    left: Choice;
    right: Choice;
  };
  themes?: string[];
  severity?: 'normal' | 'high' | 'critical';
}

export interface BreakingNewsEvent {
  id: string;
  headline: string;
  description: string;
  consequences: MetricChanges;
  themes?: string[];
}

export interface GameState {
  metrics: {
    health: number;
    economy: number;
    votes: number;
    relations: number;
  };
  turnCount: number;
  flags: string[];
  deck: GameCard[];
  currentCard: GameCard | null;
  activeEvent: BreakingNewsEvent | null;
  selectedTheme: string | null;
  gameOver: boolean;
  gameOverReason?: string;
  endingTitle?: string;
  consolationMessage?: string;
  isVictory?: boolean;
  gameOverType?: 'victory' | 'health_low' | 'economy_low' | 'votes_low' | 'relations_low';
}
