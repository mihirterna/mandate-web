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
  selectedTheme: string | null;
  gameOver: boolean;
  gameOverReason?: string;
}
