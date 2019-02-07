FROM node:10

RUN mkdir /ng-app
WORKDIR /ng-app

ENV PATH /ng-app/node_modules/.bin:$PATH

# Install and cache dependencies
COPY package.json /ng-app/package.json
COPY package-lock.json /ng-app/package-lock.json

# Split this into two lines because my remote host couldn't build the container
RUN cd /ng-app && npm install -g @angular/cli
RUN cd /ng-app && npm install

COPY . /ng-app

# This is dangerous, but whatever. It's only temporary.
CMD cd /ng-app && ng serve --host 0.0.0.0 --disable-host-check
