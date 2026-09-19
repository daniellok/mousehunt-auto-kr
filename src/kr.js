import { createWorker, PSM } from "tesseract.js";
import { sleep, log } from "./utils.js";
import {
  PUZZLE_IMAGE_SELECTOR,
  PUZZLE_CODE_INPUT,
  PUZZLE_SUBMIT_BUTTON,
  PUZZLE_RESUME_BUTTON,
  PUZZLE_NEW_CODE_LINK,
} from "./constants.js";
import { removeBackgroundColors, binarize } from "./captchaPreprocess.js";

export async function solveKR() {
  const img = document.querySelector(PUZZLE_IMAGE_SELECTOR);
  const newImg = await loadImage(img);

  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 58;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(newImg, 0, 0);

  // erase the yellow background and diagonal line, then binarize so
  // tesseract sees plain black text on a clean white background
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  removeBackgroundColors(imageData);
  binarize(imageData);
  ctx.putImageData(imageData, 0, 0);

  // use tesseract.js to perform OCR
  const worker = await createWorker();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  // the code is always a single line of text, so tell tesseract not to
  // bother trying to segment the image into paragraphs/blocks
  await worker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_LINE });
  const { data } = await worker.recognize(canvas);
  const rawCode = data.text.trim();
  const code = rawCode.replaceAll(/[^A-Za-z0-9]/g, "");

  // if the predicted code is not 5 chars, get a new image.
  // this happens when OCR can't properly recognize the image
  if (code.length !== 5) {
    log("OCR failed! Couldn't determine characters");
    await getNewCodeImage();

    // return a failure
    return false;
  }

  log("OCR success! Code: " + code);
  const codeInput = document.querySelector(PUZZLE_CODE_INPUT);
  codeInput.value = code;

  // need to dispatch a keyup to enable the claim button
  codeInput.dispatchEvent(new KeyboardEvent("keyup"));

  await sleep(1000);
  const submit = document.querySelector(PUZZLE_SUBMIT_BUTTON);

  submit.click();
  await sleep(8000);

  // if the code was correct, the "resume hunting" button should appear
  const resumeButton = document.querySelector(PUZZLE_RESUME_BUTTON);
  return resumeButton.checkVisibility();
}

/**
 * Gets a new King's Reward image by clicking the "Get new code" link
 */
async function getNewCodeImage() {
  const newCodeLink = document.querySelector(PUZZLE_NEW_CODE_LINK);
  newCodeLink.click();
  await sleep(5000);
}

/**
 * Load an image. Returns a Promise so we can wait
 * for the image to be loaded via async/await syntax.
 */
function loadImage(img) {
  return new Promise((resolve, reject) => {
    const newImg = new Image();
    newImg.crossorigin = "Anonymous";
    newImg.onload = () => resolve(newImg);
    newImg.onerror = () => reject();
    newImg.src = img.src;
  });
}
