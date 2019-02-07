FROM node:10

RUN mkdir /ng-app
WORKDIR /ng-app

ENV PATH /ng-app/node_modules/.bin:$PATH

# install and cache dependencies
COPY package.json /ng-app/package.json
COPY package-lock.json /ng-app/package-lock.json
RUN cd /ng-app && npm install -g @angular/cli && npm install

COPY . /ng-app

CMD cd /ng-app && ng serve --host 0.0.0.0
