FROM mcr.microsoft.com/playwright:v1.53.2-noble AS playwright

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/packages/frontend-ui

# CMD [ "npm", "run", "test:visual" ]
CMD [ "xvfb-run", "--auto-servernum", "--", "npm", "run", "test:visual" ]