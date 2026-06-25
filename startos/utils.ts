import { sdk } from './sdk'

/**
 * Shared constants and helpers for the Elements (Liquid) package.
 *
 * DEPENDENCY CONTRACT (read by sibling packages such as peerswap-startos):
 *   - hostname:      elements.startos
 *   - rpc port:      7041            (Liquid mainnet `liquidv1` default)
 *   - cookie file:   <datadir>/liquidv1/.cookie
 *   - mount:         a dependent mounts the `main` volume read-only and finds
 *                    the cookie at  <mountpoint>/liquidv1/.cookie
 *                    e.g. mountpoint /mnt/elements  ->  /mnt/elements/liquidv1/.cookie
 *   - wallet:        `peerswap` (pre-created by this package on first run)
 *
 * The cookie file format is  __cookie__:<password>  and is what elements-cli
 * uses for `-rpccookiefile`. A dependent can either read the cookie directly
 * or use the rpcuser/rpcpassword written into the config (see below).
 */

export const chain = 'liquidv1'
export const rpcInterfaceId = 'rpc'

// Liquid mainnet (liquidv1) RPC default port
export const rpcPort = 7041

// Liquid mainnet (liquidv1) P2P default port
export const peerPort = 7042

// elementsd inside its container stores everything under this datadir.
// The `main` volume is mounted here, so on the volume the layout is:
//   /root/.elements/elements.conf
//   /root/.elements/liquidv1/.cookie
//   /root/.elements/liquidv1/wallets/peerswap/...
export const rootDir = '/root/.elements'

// chain-specific subdirectory created by elementsd for liquidv1
export const chainDir = `${rootDir}/${chain}`

export const rpccookiefile = '.cookie'
export const cookiePath = `${chainDir}/${rpccookiefile}`

export const rpcbind = '0.0.0.0'
export const rpcallowip = '0.0.0.0/0'

// Wallet pre-created for peerswap and other Liquid consumers.
export const defaultWallet = 'peerswap'

export const elementsMounts = sdk.Mounts.of().mountVolume({
  volumeId: 'main',
  subpath: null,
  mountpoint: rootDir,
  readonly: false,
})

/** elements-cli connection args, used by the daemon health check + actions. */
export function elementsCliArgs(): string[] {
  return [
    'elements-cli',
    `-datadir=${rootDir}`,
    `-chain=${chain}`,
    `-rpccookiefile=${cookiePath}`,
    `-rpcport=${rpcPort}`,
    '-rpcconnect=127.0.0.1',
  ]
}

export type GetBlockchainInfo = {
  chain: string
  blocks: number
  headers: number
  bestblockhash: string
  mediantime: number
  verificationprogress: number
  initialblockdownload: boolean
  size_on_disk: number
  pruned: boolean
  warnings?: string | string[]
}

export type GetNetworkInfo = {
  version: number
  subversion: string
  connections: number
  connections_in?: number
  connections_out?: number
}

export type GetWalletInfo = {
  walletname: string
  balance?: Record<string, number> | number
}
