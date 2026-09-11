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
export const PUZZLE_RESUME_BUTTON = ".puzzleView__resumeButton";
export const PUZZLE_NEW_CODE_LINK = ".puzzleView__requestNewPuzzleButton";
export const HORN_READY_SELECTOR = ".huntersHornView__horn--reveal";
export const DRACONIC_DEPTHS_SELECTOR = ".hudLocationContent.draconic_depths";
export const DRACONIC_DEPTHS_HUNTS_REMAINING_SELECTOR =
  ".draconicDepthsCavernView__huntsRemainingQuantity";
export const DRACONIC_DEPTHS_REINFORCE_BUTTON_SELECTOR =
  ".draconicDepthsCavernView__reinforceCavernButton";
export const DRACONIC_DEPTHS_REINFORCE_HUNTS_INPUT_SELECTOR = "#reinforceHunts";
export const DRACONIC_DEPTHS_REINFORCE_SUBMIT_BUTTON_SELECTOR =
  ".draconicDepthsReinforceCavernDialogView__reinforceButton";

/**
 * Draconic Depths auto-reinforce config
 */
export const DRACONIC_DEPTHS_TOP_UP_THRESHOLD_MIN = 1;
export const DRACONIC_DEPTHS_TOP_UP_THRESHOLD_MAX = 24;
export const DRACONIC_DEPTHS_TOP_UP_THRESHOLD_DEFAULT = 10;
export const DRACONIC_DEPTHS_TOP_UP_THRESHOLD_DISABLED = 1;
export const DRACONIC_DEPTHS_TOP_UP_TARGET_MAX = 25;
