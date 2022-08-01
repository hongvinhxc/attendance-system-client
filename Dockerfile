FROM node:16.15.1 AS development

WORKDIR /app

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn

COPY . /app

FROM development AS build
RUN yarn build

FROM nginx

COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/.nginx/ssl/ /etc/nginx/ssl/

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]