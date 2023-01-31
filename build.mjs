import * as esbuild from 'esbuild'

const output = await esbuild.build({
  entryPoints: ['src/index.js'],
  banner: {
    js: `// ==UserScript==
// @name         Mousehunt Auto Horn & KR Solver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A new automatic horn & KR solving userscript, with a focus on code readability and modularity. Note that the published userscript is generated by a JS bundler, so don't try to debug it directly. Instead, go to the script's GitHub repo (linked below) and download the source code. The repo has instructions on how to run the bundler yourself.
// @author       daniellok
// @license      MIT
// @website      https://github.com/daniellok/mousehunt-auto-kr
// @match        https://www.mousehuntgame.com/camp.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// ==/UserScript==
`
  },
  bundle: true,
  outfile: 'dist/out.js',
});

if (output.errors.length === 0) {
  console.log("Done!");
} else {
  console.log("Error during build:");
  console.log(output.errors);
}