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
export const PUZZLE_ACTIVE_SELECTOR = ".puzzleView--active";
export const PUZZLE_IMAGE_SELECTOR = ".puzzleView__image > img";
export const PUZZLE_CODE_INPUT = ".puzzleView__code";
export const PUZZLE_SUBMIT_BUTTON = ".puzzleView__solveButton";
export const PUZZLE_RESUME_BUTTON = "puzzleView__resumeButton";
export const PUZZLE_NEW_CODE_LINK = ".puzzleView__requestNewPuzzleButton";
export const HORN_READY_SELECTOR = ".huntersHornView__horn--reveal";
