FROM renovate/renovate:39.169.0

ENV SCHEDULE="0 0 * * *"
ENV TIME_ZONE="Europe/London"

WORKDIR /usr/src

COPY ./src ./cron/src
COPY ./package-lock.json ./cron
COPY ./package.json ./cron

USER root
RUN curl -L https://www.npmjs.com/install.sh | bash
RUN cd ./cron && npm i

USER 1000

CMD ["node", "./cron/src/index.js"]