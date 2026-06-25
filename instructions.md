# Elements (Liquid)

This package runs **Elements Core (`elementsd`) as a Liquid mainnet full
node**. It is primarily a **backend for other services** (such as PeerSwap)
rather than something you interact with directly — there is no web UI, only an
internal JSON-RPC interface.

## Before you start: sync time & disk

`elementsd` runs a full, validating **Liquid** node. On first launch it
performs an initial block download (IBD) of the entire Liquid sidechain:

- **Disk:** plan for **a few GB and growing** (far smaller than Bitcoin
  mainnet, which is hundreds of GB).
- **Sync time:** Liquid has 1-minute blocks; the initial sync typically takes a
  few hours depending on your hardware and network. The service is **not fully
  usable until sync completes** — dependent services may show "starting" until
  then.

The **Dashboard** shows live sync progress under the **Liquid Sync** health
check, and the **Runtime & Connection Info** action shows block height and
percentage complete.

## What you get

- A **standalone Liquid full node** (`validatepegin=0`) — no Bitcoin node
  required alongside it.
- A **JSON-RPC interface** reachable by other StartOS packages at
  `elements.startos:7041`.
- A pre-created **`peerswap` wallet** for swap consumers.

## For dependent packages (e.g. PeerSwap)

A dependent package should mount this package's `main` volume read-only and use:

| Field | Value |
|---|---|
| RPC host | `elements.startos` |
| RPC port | `7041` |
| RPC cookie | `<mountpoint>/liquidv1/.cookie` (e.g. `/mnt/elements/liquidv1/.cookie`) |
| Wallet | `peerswap` |

The cookie file format is `__cookie__:<password>`; split on the first `:` to get
the RPC username and password. Alternatively, `rpcuser`/`rpcpassword` may be set
in `elements.conf` for explicit credentials.

## Actions

- **Configuration** — edit performance/RPC tunables (DB cache, RPC threads,
  work queue, max connections).
- **Runtime & Connection Info** — live sync status and the exact RPC connection
  details dependents use.

## Limitations

- This is a **Liquid mainnet** node only (`chain=liquidv1`). It does not run
  Bitcoin mainnet, testnet, or Liquid testnet.
- It runs with peg-in validation disabled (`validatepegin=0`), which is the
  intended mode for wallet/swap use. Peg-in *validation* against the Bitcoin
  chain is therefore not performed.
