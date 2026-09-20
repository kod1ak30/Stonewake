// Descriptive names for new work. Existing short identifiers remain compatibility
// exports until their callers can be renamed without changing saved behavior.
export {
  Al as createKingdom,
  Kl as simulateBattle,
  SWCapacity as resourceCapacity,
  SWBuildingLimit as buildingLimit,
  SWChapter as storyChapter
} from './rules.js';
export {
  Y as normalizeKingdom,
  Ul as applyKingdomAction,
  SWUpgradeQuote14 as quoteBuildingUpgrade,
  SWTrainQuote14 as quoteArmyTraining,
  SWValidateLoadout14 as validateArmyLoadout
} from '../../client/build14/rules.js';
export {
  SWCreateBattle14 as prepareBattle,
  SWPackCargo14 as packFleetCargo,
  SWValidateCargo14 as validateFleetCargo,
  SWValidateShipOrders14 as validateShipOrders
} from '../../client/build14/naval.js';
