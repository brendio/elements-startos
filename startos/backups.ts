import { sdk } from './sdk'
import { chain } from './utils'

/**
 * Back up the `main` volume but exclude the bulky, re-syncable chain data and
 * the runtime cookie. The Liquid wallet (under <chain>/wallets) IS preserved.
 */
export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.ofVolumes('main').setOptions({
    exclude: [
      `${chain}/blocks/`,
      `${chain}/chainstate/`,
      `${chain}/indexes/`,
      `${chain}/.cookie`,
      `${chain}/.lock`,
      `${chain}/*.pid`,
      '**/*-journal',
    ],
  }),
)
