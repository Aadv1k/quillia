FROM node:latest

RUN apt-get update \
    && apt-get install -y \
        findutils \
        grep \
        unzip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8080

EXPOSE 8080

RUN npm run build

CMD ["npm", "start"]
