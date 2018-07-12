FROM node:10-alpine

RUN apk add --no-cache bash

EXPOSE 3000

RUN mkdir /frontend
WORKDIR /frontend

ADD . .

RUN chmod +x entrypoint.sh
RUN mv entrypoint.sh /entrypoint.sh

RUN chmod +x wait-for-it.sh
RUN mv wait-for-it.sh /wait-for-it.sh

RUN npm install .

ENTRYPOINT ["/entrypoint.sh"]
