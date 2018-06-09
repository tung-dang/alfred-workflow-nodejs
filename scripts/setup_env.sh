#!/usr/bin/env bash

# install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash

# install node 8
nvm install 8

# to make node 8 the default
nvm alias default 8

npm install --global typescript
npm install --global prettier
npm install --global nodemon
