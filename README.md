# Mousehunt Auto Horn & KR Solver
## Getting Started
If you just want to use the userscript, go to `dist/out.js` and copy paste the code into a new Tampermonkey script (or get it at [GreasyFork](https://greasyfork.org/en/scripts/459195-mousehunt-auto-horn-kr-solver))!

If you want to build on the script, follow these steps:

1. Make sure you have Node.js and NPM installed! Follow the instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install them.
2. Clone this repo by running `git clone https://github.com/daniellok/mousehunt-auto-kr.git` in your terminal
3. `cd` into the folder, and run `npm install`
4. Start making your changes! The source code is found in the `src/` directory. The main function can be found in `src/index.js`. 
5. To keep things neat, the source code is separated into modules, and bundled together using `esbuild` to produce the final userscript. To run the bundler, run `npm run build`. The output can be found at `dist/out.js`.


## How it works
This section will be expanded upon in the future, but at a high level, the KR solver works by removing the lines that run through the CAPTCHA, and then running Tesseract.js to OCR it.
