import { T } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import {
  chain,
  cookiePath,
  defaultWallet,
  elementsCliArgs,
  elementsMounts,
  GetBlockchainInfo,
  GetNetworkInfo,
  rpcPort,
} from '../utils'

export const runtimeInfo = sdk.Action.withoutInput(
  'runtime-info',

  async ({ effects }) => ({
    name: i18n('Runtime & Connection Info'),
    description: i18n(
      'Liquid sync status plus the RPC connection details that dependent services use',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const value: T.ActionResultMember[] = []

    value.push({
      type: 'group',
      name: i18n('Connection (for dependents)'),
      description: null,
      value: [
        single(i18n('RPC Host'), 'elements.startos', true),
        single(i18n('RPC Port'), String(rpcPort), true),
        single(i18n('Cookie Path (in volume)'), cookiePath, true),
        single(i18n('Wallet'), defaultWallet, true),
      ],
    })

    try {
      const bciRes = await sdk.SubContainer.withTemp(
        effects,
        { imageId: 'elements' },
        elementsMounts,
        'getblockchaininfo',
        (subc) => subc.execFail([...elementsCliArgs(), 'getblockchaininfo']),
      )
      const bci: GetBlockchainInfo = JSON.parse(bciRes.stdout as string)

      const niRes = await sdk.SubContainer.withTemp(
        effects,
        { imageId: 'elements' },
        elementsMounts,
        'getnetworkinfo',
        (subc) => subc.execFail([...elementsCliArgs(), 'getnetworkinfo']),
      )
      const ni: GetNetworkInfo = JSON.parse(niRes.stdout as string)

      value.push({
        type: 'group',
        name: i18n('Liquid Node'),
        description: null,
        value: [
          single(i18n('Chain'), bci.chain || chain, false),
          single(i18n('Block Height'), String(bci.blocks), false),
          single(i18n('Header Height'), String(bci.headers), false),
          single(
            i18n('Sync Progress'),
            bci.initialblockdownload
              ? `${(bci.verificationprogress * 100).toFixed(2)}%`
              : '100%',
            false,
          ),
          single(i18n('Peer Connections'), String(ni.connections), false),
          single(i18n('Version'), ni.subversion || String(ni.version), false),
        ],
      })
    } catch (e) {
      value.push(
        single(
          i18n('Liquid Node'),
          i18n('RPC not reachable yet (node may still be starting).'),
          false,
        ),
      )
    }

    return {
      version: '1',
      title: i18n('Elements (Liquid) Runtime Info'),
      message: null,
      result: { type: 'group', value },
    }
  },
)

function single(
  name: string,
  value: string,
  copyable: boolean,
): T.ActionResultMember {
  return {
    type: 'single',
    name,
    description: null,
    value,
    copyable,
    masked: false,
    qr: false,
  }
}
