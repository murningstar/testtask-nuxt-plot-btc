FROM node:latest

RUN mkdir /usr/nuxt

WORKDIR /usr/nuxt

COPY package*.json .

RUN npm install

COPY ./assets ./assets
COPY ./components ./components
COPY ./pages ./pages
COPY ./plugins ./plugins
COPY ./prisma ./prisma
COPY ./public ./public
COPY ./server ./server
COPY ./utils ./utils
COPY nuxt.config.ts .
COPY tsconfig.json .
COPY tailwind.config.js .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]