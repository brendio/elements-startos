import { sdk } from './sdk'

// This package is a standalone Liquid full node. It has no required runtime
// dependencies — other packages depend on IT.
export const setDependencies = sdk.setupDependencies(
  async ({ effects }) => ({}),
)
