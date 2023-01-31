import { createWorker } from "tesseract.js";
import { sleep, log } from "./utils.js";
import {
  PUZZLE_IMAGE_SELECTOR,
  PUZZLE_CODE_INPUT,
  PUZZLE_SUBMIT_BUTTON,
  PUZZLE_RESUME_BUTTON,
  PUZZLE_NEW_CODE_LINK,
} from "./constants.js";

export async function solveKR() {
  const img = document.querySelector(PUZZLE_IMAGE_SELECTOR);
  const newImg = await loadImage(img);

  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 58;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(newImg, 0, 0);

  // erase the 4 lines that run through the characters
  // if we fail to do so, return `false` to indicate that
  // OCR has failed for this king's reward.
  const success = eraseLines(ctx);
  if (!success) {
    await getNewCodeImage();
    return false;
  }

  // use tesseract.js to perform OCR
  const worker = await createWorker();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  const { data } = await worker.recognize(canvas);
  const code = data.text.trim();

  // if the predicted code is not 5 chars, get a new image.
  // this happens when one of the lines is the same color
  // as the text, causing the `eraseLines()` method to erase
  // the entire image.
  if (code.length !== 5) {
    log("OCR failed! Couldn't determine characters");
    await getNewCodeImage();

    // return a failure
    return false;
  }

  log("OCR success! Code: " + code);
  const codeInput = document.querySelector(PUZZLE_CODE_INPUT);
  codeInput.value = code;

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
 * This function erases the 4 colored lines that run through the
 * characters in the CAPTCHA. The logic is described in the inline
 * comments below.
 */
function eraseLines(ctx) {
  // convert the canvas image data to a 2d array. this step is not
  // necessary, but makes it easier to visualize what's going on
  // as we iterate through the rows and columns of the image
  const data = ctx.getImageData(0, 0, 200, 58);
  const img = convertTo2d(data.data);

  // first, we get the colors of the 4 lines that run through the image.
  const colors = getLineColors(img);
  if (colors == null) {
    return false;
  }

  // deep copy the image data so we don't modify anything
  const newData = JSON.parse(JSON.stringify(img));

  // for each pixel in the image...
  for (let row = 1; row < 57; row += 1) {
    for (let col = 0; col < 200; col += 1) {
      const point = img[row][col];

      // if it's not one of the 4 line colors, ignore the pixel
      if (!colorContains(colors, point)) {
        continue;
      }

      // else, check the pixel above and below it
      const above = img[row - 1][col];
      const below = img[row + 1][col];

      // if the pixel above and below are both white (or one of the
      // other 4 colors; this handles the case where lines intersect),
      // remove the pixel by setting it to white
      const aCheck = isWhite(above) || colorContains(colors, above);
      const bCheck = isWhite(below) || colorContains(colors, below);
      if (aCheck && bCheck) {
        newData[row][col] = [255, 255, 255, 255];
      }
    }
  }

  // flatten the image (from 2d -> 1d)
  // and put it back into the canvas.
  const flat = newData.flat().flat();
  for (let i = 0; i < flat.length; i++) {
    data.data[i] = flat[i];
  }
  ctx.putImageData(data, 0, 0);

  return true;
}

/**
 * Check if a pixel is white. the background in the king's reward
 * image is not uniformly white -- the pixels have minor variations,
 * so we approximate by just summing all the RGBA channels and
 * asserting that it is sufficiently high.
 */
function isWhite(pixel) {
  return sum(pixel) > 1010;
}

/**
 * Similar to the white check, the line colors are also not uniformly
 * one color. We determine that two colors are "equivalent" if their
 * RGBA values are close enough (within a difference of 2)
 */
function isEquivalent(color1, color2) {
  for (let i = 0; i < 4; i++) {
    // max difference for each pixel is 2
    if (Math.abs(color1[i] - color2[i]) > 2) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if a pixel is equivalent to any color in a provided array
 */
function colorContains(colors, pixel) {
  return colors.reduce((acc, curr) => acc || isEquivalent(curr, pixel), false);
}

/**
 * Converts a 1d array of RGBA values to a 2d array of pixels.
 * Technically I suppose the resulting array is 3d, since each
 * pixel is an array of 4 values.
 */
function convertTo2d(arr) {
  const img = [];
  for (let i = 0; i < arr.length; i += 4) {
    if (i % (200 * 4) === 0) {
      img.push([]);
    }

    const pixel = [arr[i], arr[i + 1], arr[i + 2], arr[i + 3]];

    img[img.length - 1].push(pixel);
  }
  return img;
}

/**
 * Get the colors of the four lines that run through the
 * image. The algorithm here isn't very robust, and relies
 * on the fact that the lines always extend past the
 * characters.
 *
 * We simply start at a point past the characters (column
 * 160), and scan the column for 4 non-white pixels. If we
 * find them, then we have our colors. If not (e.g. because
 * the lines are intersecting), then move one pixel to the right
 * and repeat.
 *
 * If we reach the end of the image, then return null to
 * indicate that the colors couldn't be found.
 */
function getLineColors(img) {
  for (let col = 160; col < 200; col++) {
    const colors = img.map((row) => JSON.stringify(row[col]));
    const filtered = colors
      .filter((val, idx) => colors.indexOf(val) === idx)
      .map((val) => JSON.parse(val))
      .filter((val) => sum(val) < 1010);

    log("Found line colors:", filtered);

    if (filtered.length === 4) {
      return filtered;
    }
  }

  log("Failed to find line colors!");
  return null;
}

/**
 * Minor helper function to sum all values in an array
 */
function sum(arr) {
  return arr.reduce((a, b) => a + b);
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
