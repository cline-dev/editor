FROM node:20-alpine
RUN apk add --no-cache bash git python3 make g++
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY . .
RUN mkdir -p workspace
EXPOSE 3000
CMD ["npm", "start"]
