import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'elements',
  title: 'Elements (Liquid)',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9Labs/elements-startos',
  upstreamRepo: 'https://github.com/ElementsProject/elements',
  marketingUrl: 'https://liquid.net/',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    elements: {
      source: {
        dockerBuild: {
          buildArgs: {
            VERSION: '23.3.3',
          },
        },
      },
      arch: ['aarch64', 'x86_64'],
    },
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  // No required dependencies: this is a standalone Liquid full node
  // (validatepegin=0). Other packages depend on THIS one.
  dependencies: {},
})
