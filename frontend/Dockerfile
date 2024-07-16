FROM node:20-bullseye

WORKDIR /my-vue-app
COPY . .

RUN npm install 


#RUN npm run build
# RUN npm run lint
EXPOSE 5173
CMD [ "npm", "run", "dev"]