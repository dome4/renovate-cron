![Renovate banner](https://app.renovatebot.com/images/renovate_660_220.jpg)

# Run Renovate bot on schedule

Automated dependency updates.
Multi-platform and multi-language.

## Environment variables

- SCHEDULE 
- TIME_ZONE (see [moment.js](https://momentjs.com/timezone/))

## Build & Publish Docker image

1. Build Docker image: `sudo docker compose build renovate`
2. Get Docker image ID: `sudo docker image ls`
3. Tag Docker image: `sudo docker tag <image-id> git.dominic-seitz.de/dome4/renovate-cron:latest`
4. Publish Docker image: `sudo docker push <tag-name>`