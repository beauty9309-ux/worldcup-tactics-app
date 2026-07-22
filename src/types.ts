export type Position =
  | "GK"
  | "CB"
  | "LB"
  | "RB"
  | "CDM"
  | "CM"
  | "CAM"
  | "LM"
  | "RM"
  | "LW"
  | "RW"
  | "ST"
  | "CF";

export type PlayStyle = "possession" | "counter" | "pressing" | "defensive";

export interface Player {
  id: string;
  name: string;
  /** Real 2026 World Cup squad shirt number (source: openfootball/worldcup.json). */
  number: number;
  position: Position;
  teamId: string;
  overall: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface Team {
  id: string;
  name: string;
  flag: string;
  style: PlayStyle;
  attackRating: number;
  midfieldRating: number;
  defenseRating: number;
  overallRating: number;
}

export interface FormationSlot {
  role: Position;
  label: string;
  x: number;
  y: number;
}

export interface Formation {
  id: string;
  name: string;
  description: string;
  slots: FormationSlot[];
}

export interface CrisisScenario {
  id: string;
  shortTitle: string;
  competition: string;
  matchDate: string;
  stadium: string;
  koreaTeam: Team;
  opponentTeam: Team;
  /** Player ids offered as bench/tactical options for this scenario — real, verified 2026
   * World Cup squad members (not necessarily confirmed to have appeared in this exact match;
   * `koreaLineup` below is what's confirmed for the match itself). */
  koreaSquadIds: string[];
  concedeMinute: number;
  scorerName: string;
  assistName?: string;
  goalDescription: string;
  substitutionNote?: string;
  koreaFormationId: string;
  koreaLineup: Record<number, string>;
  opponentFormationId: string;
  opponentLineup: Record<number, string>;
}

export type MatchOutcome = "WIN" | "DRAW" | "LOSS";

export interface AIRecommendation {
  formationId: string;
  winProbability: number;
}

export interface CrisisResult {
  /** Probability (before this roll) that the chosen tactics turn the match into a win. */
  winProbability: number;
  outcome: MatchOutcome;
  finalScore: { korea: number; opponent: number };
  timeline: { minute: number; text: string }[];
  reasons: string[];
  chosenFormationId: string;
  aiRecommendation: AIRecommendation;
  followedAI: boolean;
}
