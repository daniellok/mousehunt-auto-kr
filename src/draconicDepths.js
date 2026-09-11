import { sleep, log } from "./utils.js";
import {
  DRACONIC_DEPTHS_HUNTS_REMAINING_SELECTOR,
  DRACONIC_DEPTHS_REINFORCE_BUTTON_SELECTOR,
  DRACONIC_DEPTHS_REINFORCE_HUNTS_INPUT_SELECTOR,
  DRACONIC_DEPTHS_REINFORCE_SUBMIT_BUTTON_SELECTOR,
  DRACONIC_DEPTHS_TOP_UP_THRESHOLD_DISABLED,
} from "./constants.js";
import { isInDraconicDepths, getTopUpThreshold, getTopUpTarget } from "./ui.js";

// guards against re-triggering a reinforce while the previous
// one is still in progress (e.g. while the modal is open)
let isReinforcing = false;

export async function checkDraconicDepths() {
  if (!isInDraconicDepths() || isReinforcing) {
    return;
  }

  const huntsRemaining = getHuntsRemaining();
  if (huntsRemaining === null) {
    return;
  }

  const threshold = getTopUpThreshold();
  if (threshold === DRACONIC_DEPTHS_TOP_UP_THRESHOLD_DISABLED) {
    return;
  }
  if (huntsRemaining >= threshold) {
    return;
  }

  const target = getTopUpTarget();
  const amountToReinforce = target - huntsRemaining;
  if (amountToReinforce <= 0) {
    return;
  }

  isReinforcing = true;
  try {
    await reinforceCavern(amountToReinforce);
  } finally {
    isReinforcing = false;
  }
}

function getHuntsRemaining() {
  const el = document.querySelector(DRACONIC_DEPTHS_HUNTS_REMAINING_SELECTOR);
  return el ? Number(el.textContent) : null;
}

async function reinforceCavern(amount) {
  log(`Reinforcing draconic depths cavern by ${amount} hunts...`);

  const reinforceButton = document.querySelector(
    DRACONIC_DEPTHS_REINFORCE_BUTTON_SELECTOR
  );
  reinforceButton.click();
  await sleep(1500);

  const huntsInput = document.querySelector(
    DRACONIC_DEPTHS_REINFORCE_HUNTS_INPUT_SELECTOR
  );
  huntsInput.value = amount;
  huntsInput.dispatchEvent(new Event("input", { bubbles: true }));
  huntsInput.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
  await sleep(1500);

  const submitButton = document.querySelector(
    DRACONIC_DEPTHS_REINFORCE_SUBMIT_BUTTON_SELECTOR
  );
  submitButton.click();
  await sleep(1000);

  log("Cavern reinforced!");
}
