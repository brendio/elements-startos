<p align="center">
  <img src="icon.svg" alt="Elements (Liquid) Logo" width="21%">
</p>

# Elements (Liquid) on StartOS

> **Upstream repo:** <https://github.com/ElementsProject/elements>

Elements Core (`elementsd`) packaged for StartOS as a **Liquid mainnet
(`liquidv1`) full node**. It exposes a JSON-RPC interface and a wallet so that
other StartOS services — primarily **PeerSwap** — can use Liquid (L-BTC)
functionality. It is a greenfield package: no Elements/Liquid package previously
existed on StartOS.

This README documents the package architecture for developers and LLMs. End-user
docs are in [`instructions.md`](instructions.md).

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [The Dependency Contract](#the-dependency-contract)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property      | Value                                                |
| ------------- | ---------------------------------------------------- |
| Image         | built from `ElementsProject/elements` release `23.3.3` |
| Build         | multi-stage `Dockerfile` (download + SHA256-verify release tarball) |
| Architectures | x86_64, aarch64                                      |
| Daemon        | `elementsd -datadir=/root/.elements`                 |
| CLI           | `elements-cli` (used by health checks and actions)   |

---

## Volume and Data Layout

| Volume | Mount Point        | Purpose                          |
| ------ | ------------------ | -------------------------------- |
| `main` | `/root/.elements`  | Config, chain data, wallet, cookie |

On the `main` volume:

```
/root/.elements/elements.conf
/root/.elements/store.json
/root/.elements/liquidv1/.cookie
/root/.elements/liquidv1/blocks/
/root/.elements/liquidv1/chainstate/
/root/.elements/liquidv1/wallets/peerswap/
```

---

## The Dependency Contract

This is the whole point of the package. A dependent (e.g. `peerswap`) mounts
this package's `main` volume **read-only** and connects to the RPC:

| Field        | Value                                                  |
| ------------ | ------------------------------------------------------ |
| RPC host     | `elements.startos`                                     |
| RPC port     | `7041`                                                 |
| Cookie file  | `<mountpoint>/liquidv1/.cookie` (e.g. `/mnt/elements/liquidv1/.cookie`) |
| Cookie format| `__cookie__:<password>` (split on first `:`)            |
| Wallet       | `peerswap` (pre-created on first run)                  |

A dependent typically sets, in its own config:

```
elementsd.rpchost=elements.startos
elementsd.rpcport=7041
elementsd.rpcuser=<from cookie or rpcuser>
elementsd.rpcpass=<from cookie or rpcpassword>
elementsd.rpcwallet=peerswap
```

The cookie is the primary credential surface (always present, regenerated each
run). Optionally `rpcuser`/`rpcpassword` may be set in `elements.conf` for fixed
credentials.

---

## Installation and First-Run Flow

1. `seedFiles` writes `elements.conf` (enforced keys + defaults) and `store.json`.
2. `main.ts` starts `elementsd`, which begins initial block download of the
   Liquid sidechain.
3. Once RPC is reachable, the `create-wallet` oneshot loads or creates the
   `peerswap` wallet.
4. The `sync-progress` health check tracks IBD and fires a one-time "Sync
   Complete" notification when finished.

---

## Configuration Management

`elements.conf` is managed by the `elementsConfFile` FileHelper
(`startos/fileModels/elements.conf.ts`). Enforced keys (not user-editable):

```
chain=liquidv1
server=1
listen=1
txindex=1
validatepegin=0
rpcbind=0.0.0.0
rpcallowip=0.0.0.0/0
rpcport=7041
rpccookiefile=.cookie
```

User-tunable via the **Configuration** action: `dbcache`, `rpcthreads`,
`rpcworkqueue`, `maxconnections`.

---

## Network Access and Interfaces

| Interface     | Port | Type | Purpose                                    |
| ------------- | ---- | ---- | ------------------------------------------ |
| RPC Interface | 7041 | api  | Liquid JSON-RPC for dependent services     |

This is an internal/LAN API interface. There is **no public Tor UI** — the node
is a backend, not a user-facing app.

---

## Actions (StartOS UI)

| Action                    | Purpose                                                       |
| ------------------------- | ------------------------------------------------------------- |
| Configuration             | Edit performance/RPC tunables in `elements.conf`              |
| Runtime & Connection Info | Live sync status + the RPC connection details for dependents  |

---

## Backups and Restore

**Included:** `main` volume — including `elements.conf` and the `peerswap`
wallet (`liquidv1/wallets/`).

**Excluded (re-syncable):** `liquidv1/blocks/`, `liquidv1/chainstate/`,
`liquidv1/indexes/`, `liquidv1/.cookie`, lock/pid files.

---

## Health Checks

| Check    | Method                          | Notes                                  |
| -------- | ------------------------------- | -------------------------------------- |
| RPC      | cookie exists + port 7041 listen | Daemon readiness                       |
| Liquid Sync | `getblockchaininfo` via elements-cli | Surfaces IBD / verification progress |

---

## Dependencies

**None.** This is a standalone Liquid full node (`validatepegin=0`). Other
packages depend on it.

---

## Limitations and Differences

1. **Liquid mainnet only** (`chain=liquidv1`). No Bitcoin/testnet/Liquid-testnet.
2. **No peg-in validation** (`validatepegin=0`) — intended for wallet/swap use.
3. **Backend only** — no user-facing web UI.

---

## Quick Reference for AI Consumers

```yaml
package_id: elements
title: Elements (Liquid)
image: built from ElementsProject/elements 23.3.3
architectures: [x86_64, aarch64]
chain: liquidv1
volumes:
  main: /root/.elements
interfaces:
  rpc:
    type: api
    port: 7041
    hostname: elements.startos
dependency_contract:
  rpc_host: elements.startos
  rpc_port: 7041
  cookie_file: <mountpoint>/liquidv1/.cookie   # e.g. /mnt/elements/liquidv1/.cookie
  cookie_format: "__cookie__:<password>"
  wallet: peerswap
enforced_conf:
  chain: liquidv1
  server: 1
  listen: 1
  txindex: 1
  validatepegin: 0
  rpcbind: 0.0.0.0
  rpcallowip: 0.0.0.0/0
  rpcport: 7041
  rpccookiefile: .cookie
actions: [config, runtime-info]
dependencies: none
```
