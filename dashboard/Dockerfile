FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

ARG VITE_ENDPOINT
ENV VITE_ENDPOINT=$VITE_ENDPOINT
ENV NODE_ENV=development

COPY . .

RUN echo "VITE_ENDPOINT=$VITE_ENDPOINT" > .env.local

EXPOSE 5174
CMD ["npm", "run", "dev"]
