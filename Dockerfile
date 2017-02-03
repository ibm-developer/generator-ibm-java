#FROM node:6.9.4-alpine
FROM node:6.9.4

RUN useradd -ms /bin/bash jgen

RUN npm install -g yo

COPY ./generator-java/generators /generator-java/generators
COPY ./generator-java/package.json /generator-java/package.json

RUN cd /generator-java && npm install --save yeoman-generator && npm link

COPY ./config /home/jgen/.config/configstore
RUN chown -R jgen /home/jgen/.config

USER jgen
CMD ["yo", "java"]
