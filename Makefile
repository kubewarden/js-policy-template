.PHONY: all build-policy build-plugin test e2e clean fmt

# Get the plugin from the SDK
KUBEWARDEN_PLUGIN := node_modules/kubewarden-policy-sdk/plugin/javy-plugin-kubewarden.wasm
all: build-policy annotated-policy.wasm

install: dist/bundled.js
	npm install

dist/bundled.js: src/index.ts package.json webpack.config.cjs
	@mkdir -p dist
	npm install
	npm run build

policy.wasm: dist/bundled.js $(KUBEWARDEN_PLUGIN)
	javy build dist/bundled.js -C plugin=$(KUBEWARDEN_PLUGIN) -o policy.wasm

annotated-policy.wasm: policy.wasm metadata.yml
	kwctl annotate policy.wasm --metadata-path metadata.yml --output-path annotated-policy.wasm

build-policy: install dist/bundled.js policy.wasm

e2e: annotated-policy.wasm
	bats e2e.bats

fmt:
	npm run format

clean:
	npm cache clean --force
	rm -f policy.wasm annotated-policy.wasm
	rm -rf dist dist-ts node_modules package-lock.json
