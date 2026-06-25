import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '23.3.3:0',
  releaseNotes: {
    en_US:
      'Initial release: Elements Core (elementsd) as a Liquid mainnet full node.',
    es_ES:
      'Versión inicial: Elements Core (elementsd) como nodo completo de Liquid mainnet.',
    de_DE:
      'Erstveröffentlichung: Elements Core (elementsd) als Liquid-Mainnet Full Node.',
    pl_PL:
      'Pierwsze wydanie: Elements Core (elementsd) jako pełny węzeł Liquid mainnet.',
    fr_FR:
      'Version initiale : Elements Core (elementsd) en nœud complet Liquid mainnet.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
