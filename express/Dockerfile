FROM node:20-alpine

RUN npm install -g pnpm && pnpm --version

RUN mkdir -p /home/node/code

USER node

WORKDIR /home/node/code

COPY --chown=node:node pnpm-lock.yaml package.json ./

COPY --chown=node:node . .

USER root
RUN pnpm install

USER node

CMD ["pnpm", "tsx", "src/index.ts"]