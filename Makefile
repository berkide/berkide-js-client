include .env

.PHONY: build clean publish

build:
	npm run build

clean:
	npm run clean

publish:
	NPM_TOKEN=$(NPM_TOKEN) npm publish --access public
