# Build stage: download the official Elements Core release tarball for the
# target architecture, verify it against the published SHA256SUMS, and extract.
FROM debian:stable-slim AS builder

ARG VERSION
ARG TARGETPLATFORM

WORKDIR /build

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates wget && \
    rm -rf /var/lib/apt/lists/*

# Map Docker's TARGETPLATFORM to the Elements release tarball arch string.
RUN case "${TARGETPLATFORM}" in \
      "linux/amd64") echo "x86_64-linux-gnu"  > /tarball-arch ;; \
      "linux/arm64") echo "aarch64-linux-gnu" > /tarball-arch ;; \
      *) echo "Unsupported platform: ${TARGETPLATFORM}" && exit 1 ;; \
    esac && \
    echo "elements-${VERSION}-$(cat /tarball-arch).tar.gz" > /tarball-name

RUN url="https://github.com/ElementsProject/elements/releases/download/elements-${VERSION}" && \
    wget -q "${url}/$(cat /tarball-name)" "${url}/SHA256SUMS" && \
    grep " $(cat /tarball-name)\$" SHA256SUMS | sha256sum -c -

RUN tar -xzf "$(cat /tarball-name)" --strip-components=1

# Final image
FROM debian:stable-slim

ENV ELEMENTS_DATA=/root/.elements
ENV ELEMENTS_PREFIX=/opt/elements
ENV PATH=${ELEMENTS_PREFIX}/bin:$PATH

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates curl tini && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /build/bin/elementsd    ${ELEMENTS_PREFIX}/bin/
COPY --from=builder /build/bin/elements-cli ${ELEMENTS_PREFIX}/bin/

WORKDIR /root

# tini (installed above) is available at /usr/bin/tini for signal-forwarding/
# zombie-reaping. StartOS Daemons invoke the daemon command directly (mirroring
# bitcoind-startos), so no ENTRYPOINT is set here; elementsd receives SIGTERM
# from StartOS and shuts down cleanly within the configured sigtermTimeout.
