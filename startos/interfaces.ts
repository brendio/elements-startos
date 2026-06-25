import { i18n } from './i18n'
import { sdk } from './sdk'
import { rpcInterfaceId, rpcPort } from './utils'

/**
 * Exposes the Liquid (elementsd) JSON-RPC port so that dependent packages can
 * reach it at `elements.startos:7041`. This is an internal/LAN API interface;
 * it intentionally does NOT create a public Tor UI.
 */
export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const rpcMulti = sdk.MultiHost.of(effects, 'rpc')
  const rpcMultiOrigin = await rpcMulti.bindPort(rpcPort, {
    protocol: 'http',
    preferredExternalPort: rpcPort,
  })
  const rpc = sdk.createInterface(effects, {
    name: i18n('RPC Interface'),
    id: rpcInterfaceId,
    description: i18n(
      'Listens for Liquid (elementsd) JSON-RPC commands from dependent services',
    ),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const rpcReceipt = await rpcMultiOrigin.export([rpc])

  return [rpcReceipt]
})
