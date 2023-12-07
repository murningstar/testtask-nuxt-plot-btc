FROM node:latest

RUN mkdir /usr/nuxt

WORKDIR /usr/nuxt

COPY package*.json .

RUN npm install

COPY ./server ./server
COPY ./pages ./pages
COPY ./public ./public
COPY ./components ./components
COPY ./assets ./assets
COPY tsconfig.json .
COPY nuxt.config.ts .
COPY tailwind.config.js .

COPY ./prisma ./prisma
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]