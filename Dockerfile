# Keep the version in step with cypress in package.json.
FROM cypress/included:16.2.1@sha256:f1f257405a482bdf95358cd30202d9c3ac69f907d5e96342ae377b8111ff7a15

WORKDIR /e2e

COPY package.json package-lock.json ./
RUN CYPRESS_INSTALL_BINARY=0 npm ci

COPY . .

ENV CI=true
# Build the Allure report even when tests fail, then exit with the tests' status.
ENTRYPOINT ["sh", "-c", "npm run clean:reports && status=0 && { \"$@\" || status=$?; } && npm run allure:generate && exit $status", "--"]
CMD ["npx", "cypress", "run"]
