/** Stable boundaries for persisted saves, forecasts and the Worker protocol.
 * Legacy rules retain their runtime validation while individual fields are typed.
 */
export type Resources = { gold: number; wood: number; stone: number; food: number };
export interface Building {
  id: string;
  kind: string;
  x: number;
  y: number;
  level: number;
  readyAt?: number;
  [key: string]: unknown;
}
export interface Kingdom {
  buildings: Building[];
  resources: Resources;
  army: Record<string, number>;
  unitLevels: Record<string, number>;
  gems: number;
  lastTick: number;
  campaign: number;
  seaCampaign?: number;
  [key: string]: unknown;
}
export interface BattleInput {
  seed: number;
  army: Record<string, number>;
  defense: { buildings: Building[]; [key: string]: unknown };
  orders: unknown[];
  [key: string]: unknown;
}
export interface BattleResult {
  won: boolean;
  frames: unknown[];
  duration: number;
  destruction: number;
  survivors: Record<string, number>;
  [key: string]: unknown;
}
export interface SaveEnvelope {
  state: Kingdom;
  reports: unknown[];
  battle?: BattleResult | null;
  input?: BattleInput | null;
  time?: number;
}
export type WorkerRequest = { id: number; input: BattleInput };
export type WorkerReply =
  | { type: 'ready'; build: number }
  | { id: number; result: BattleResult }
  | { id: number; error: string };
