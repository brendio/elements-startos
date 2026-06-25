export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'The Liquid RPC interface is ready': 0,
  'The Liquid RPC interface is not ready': 1,
  'Liquid Sync': 2,
  'Syncing Liquid blocks...${percentage}%': 3,
  'Sync Complete': 4,
  'The Liquid sidechain is fully synced.': 5,
  'Liquid is fully synced': 6,
  'Liquid is starting…': 7,

  // interfaces.ts
  'RPC Interface': 8,
  'Listens for Liquid (elementsd) JSON-RPC commands from dependent services': 9,

  // fileModels/elements.conf.ts
  Default: 10,
  'Database Cache': 11,
  'How much RAM (in MiB) to allocate for caching during sync. Higher values speed up initial sync.': 12,
  'RPC Threads': 13,
  'Number of threads for handling RPC calls.': 14,
  'RPC Work Queue': 15,
  'Depth of the work queue used to service RPC calls.': 16,
  'Maximum Connections': 17,
  'Maximum number of peer connections to maintain.': 18,

  // actions/rpcConfig.ts
  Configuration: 19,
  'Edit performance and RPC tunables in elements.conf': 20,

  // actions/runtimeInfo.ts
  'Runtime & Connection Info': 21,
  'Liquid sync status plus the RPC connection details that dependent services use': 22,
  'Connection (for dependents)': 23,
  'RPC Host': 24,
  'RPC Port': 25,
  'Cookie Path (in volume)': 26,
  Wallet: 27,
  'Liquid Node': 28,
  Chain: 29,
  'Block Height': 30,
  'Header Height': 31,
  'Sync Progress': 32,
  'Peer Connections': 33,
  Version: 34,
  'RPC not reachable yet (node may still be starting).': 35,
  'Elements (Liquid) Runtime Info': 36,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
