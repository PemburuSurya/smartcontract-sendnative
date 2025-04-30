# Use Ubuntu 22.04 as base image
FROM ubuntu:22.04

# Set environment variables to avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install required system dependencies
RUN apt-get update && \
    apt-get install -y \
        curl \
        tar \
        git \
        openssl \
        wget \
        python3 \
        python3-pip \
        build-essential \
        libssl-dev \
        pciutils && \
    rm -rf /var/lib/apt/lists/*

# Create gaianet user and directories
RUN useradd -m gaianet7 && \
    mkdir -p /home/gaianet7/gaianet && \
    chown -R gaianet7:gaianet7 /home/gaianet7

# Switch to gaianet user
USER gaianet7
WORKDIR /home/gaianet7

# Set environment variables
ENV HOME=/home/gaianet7
ENV GAIANET_BASE_DIR=/home/gaianet7/gaianet
ENV PATH="/home/gaianet7/gaianet/bin:${PATH}"

# Create necessary directories
RUN mkdir -p $GAIANET_BASE_DIR/{bin,log,qdrant,gaia-frp,tmp}

# Download and run the install script (with retry mechanism)
RUN for i in {1..5}; do \
      curl -sSfL 'https://github.com/GaiaNet-AI/gaianet-node/releases/latest/download/install.sh' | bash -s -- --base $GAIANET_BASE_DIR && break || \
      sleep 15; \
    done

# Initialize with the provided config
RUN gaianet init --config https://raw.githubusercontent.com/PemburuSurya/gaianet/main/qwen1.5./config.json

# Copy entrypoint script
COPY --chown=gaianet7:gaianet7 entrypoint.sh /home/gaianet7/entrypoint.sh
RUN chmod +x /home/gaianet7/entrypoint.sh

# Expose necessary ports
EXPOSE 8080 8081 8082 6333 6334

# Set entrypoint
ENTRYPOINT ["/home/gaianet7/entrypoint.sh"]
