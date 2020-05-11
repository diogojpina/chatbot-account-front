#Dockerfile.dev:
#base image from NodeJS
FROM node:12.2.0-alpine as chatbot-web

# set working directory
WORKDIR /app


# add `//node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

RUN npm install
#RUN npm install -g @angular/cli@7.3.9

COPY . ./

CMD ng serve --host 0.0.0.0
#CMD ["yarn", "start"]