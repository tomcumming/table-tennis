serve:
	python3 -m http.server --directory dist

bundle:
	deno bundle -c src/gui/tsconfig.json src/gui/main.ts dist/main.js
