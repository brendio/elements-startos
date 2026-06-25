import { elementsConfFile } from '../fileModels/elements.conf'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (!kind) return

  // install, update, restore
  await storeJson.merge(effects, {})

  // Merging with {} writes the enforced/default keys into elements.conf
  // (chain=liquidv1, server, listen, txindex, validatepegin=0, rpc binding…)
  // via the fileModel's formToFile, on every lifecycle event.
  await elementsConfFile.merge(effects, {})
})
