#!/bin/bash

# Start GaiaNet services
gaianet start

# Keep the container running
tail -f /dev/null
