FROM node:alpine

RUN [ "npm", "i", "uuid" ]
COPY auditor.js /opt

EXPOSE 2205

CMD [ "node", "/opt/auditor.js" ]
