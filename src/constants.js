/**
 * Configurable constants
 */
export const HORN_DELAY_MIN_SECS = 10;
export const HORN_DELAY_MAX_SECS = 180;

/**
 * CSS selectors
 *
 * These are used to grab elements on the page
 * using the built-in `document.querySelector` method.
 */
export const PUZZLE_FORM_SELECTOR = ".mousehuntPage-puzzle-formContainer";
export const PUZZLE_IMAGE_SELECTOR =
  ".mousehuntPage-puzzle-form-captcha-image > img";
export const PUZZLE_CODE_INPUT = ".mousehuntPage-puzzle-form-code";
export const PUZZLE_SUBMIT_BUTTON = ".mousehuntPage-puzzle-form-code-button";
export const PUZZLE_RESUME_BUTTON =
  ".mousehuntPage-puzzle-form-complete-button";
export const PUZZLE_NEW_CODE_LINK = ".mousehuntPage-puzzle-form-newCode a";

export const HORN_READY_SELECTOR = ".huntersHornView__horn--reveal";
