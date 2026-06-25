import { sdk } from '../sdk'
import { rpcConfig } from './rpcConfig'
import { runtimeInfo } from './runtimeInfo'

export const actions = sdk.Actions.of()
  .addAction(rpcConfig)
  .addAction(runtimeInfo)
