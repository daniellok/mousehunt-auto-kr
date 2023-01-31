import {
  PUZZLE_FORM_SELECTOR,
  HORN_READY_SELECTOR,
  HORN_DELAY_MIN_SECS,
  HORN_DELAY_MAX_SECS,
} from "./constants";
import { getSecsToNextHorn, soundHorn, log, sleep, formatTime } from "./utils";
import { solveKR } from "./kr.js";

/**
 * Figure out what the next step is (e.g. is the horn
 * ready, is there a king's reward, etc), and take the
 * appropriate action
 */
async function getState() {
  // if the horn is present, sound it
  const hornImage = document.querySelector(HORN_READY_SELECTOR);
  if (hornImage) {
    log("Sounding horn...");
    await soundHorn();
    log("Horn sounded!");
  }

  // if a king's reward is present, solve it
  // attempt to solve it 3 times, and give up
  // if it wasn't successful.
  const hasPuzzle = document.querySelector(PUZZLE_FORM_SELECTOR);
  if (hasPuzzle) {
    log("Solving KR...");
    let success = false;
    let retryCount = 0;

    while (!success && retryCount < 3) {
      success = await solveKR();
      retryCount++;
      if (!success) {
        log("Failed to solve KR, retrying...");
      }
    }

    // if it was successful, reload the page.
    // there's no particular reason for this,
    // but it's an easy way to reset the script.
    if (success) {
      log("KR solved!");
      window.location.reload();
    } else {
      alert(
        "Failed to solve KR 3 times. Please solve it " +
          "manually and refresh the page when finished!"
      );
      return -1;
    }
  }

  // after everything is done, get the next horn time
  // and return it so the caller knows how long to wait.
  const secsToNextHorn = getSecsToNextHorn();
  const randomDelay = Math.max(
    Math.random() * HORN_DELAY_MAX_SECS,
    HORN_DELAY_MIN_SECS
  );
  const nextHornTime = Date.now() + (secsToNextHorn + randomDelay) * 1000;
  log("Next horn time: " + formatTime(new Date(nextHornTime)));

  return nextHornTime;
}

/**
 * Function that handles the main loop of the script.
 * It checks every 5 seconds to see if the horn is ready.
 *
 * The reason we check every 5 seconds instead of just
 * sleeping until the next horn is that the script can
 * go to sleep (e.g. if you close your laptop). In such
 * cases, the timer stops, which can potentially delay the
 * next horn time.
 */
async function loop() {
  let nextHornTime = 0;

  while (true) {
    if (nextHornTime === -1) {
      break;
    } else if (nextHornTime > Date.now()) {
      await sleep(5000);
    } else {
      nextHornTime = await getState();
    }
  }
}

loop();
