FROM keymetrics/pm2:16-buster
COPY . .
EXPOSE 3000
CMD ["yarn", "start"]