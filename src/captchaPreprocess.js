// the KR CAPTCHA always uses the same yellow background and the same
// diagonal line color, so we can just erase them by comparing against
// these known values.
export const BACKGROUND_COLOR = [255, 220, 100];
export const LINE_COLOR = [225, 164, 22];
export const COLOR_TOLERANCE = 8;

/**
 * Erases the CAPTCHA's yellow background and diagonal line by
 * replacing any pixel close to either known color with white, leaving
 * the (randomly colored) text and any decorative dots untouched.
 *
 * Operates in place on a canvas-style ImageData object ({ data, width,
 * height }), so it works with both browser and node-canvas contexts.
 */
export function removeBackgroundColors(imageData, tolerance = COLOR_TOLERANCE) {
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const pixel = [data[i], data[i + 1], data[i + 2]];
    if (
      isCloseTo(pixel, BACKGROUND_COLOR, tolerance) ||
      isCloseTo(pixel, LINE_COLOR, tolerance)
    ) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }

  return imageData;
}

/**
 * Checks if a pixel's RGB values are all within `tolerance` of a
 * target color, to account for anti-aliasing at color boundaries.
 */
function isCloseTo(pixel, target, tolerance) {
  return pixel.every((value, idx) => Math.abs(value - target[idx]) <= tolerance);
}

// text is always dark, while the background/lines/dots/white shapes
// are all light, so a fairly generous luminance threshold cleanly
// separates the two without needing to know the text's exact color.
export const BINARIZE_THRESHOLD = 150;

/**
 * Converts the image to pure black-and-white: any pixel darker than
 * `BINARIZE_THRESHOLD` becomes black, everything else becomes white.
 * Intended to run after `removeBackgroundColors`, to mop up decorative
 * dots and any anti-aliasing left behind, giving tesseract a clean,
 * high-contrast image.
 *
 * Operates in place on a canvas-style ImageData object.
 */
export function binarize(imageData, threshold = BINARIZE_THRESHOLD) {
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const value = luminance < threshold ? 0 : 255;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
  }

  return imageData;
}
