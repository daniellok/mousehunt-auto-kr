import { formatTime } from "./utils.js";
import {
  DRACONIC_DEPTHS_SELECTOR,
  DRACONIC_DEPTHS_HUNTS_REMAINING_SELECTOR,
  DRACONIC_DEPTHS_TOP_UP_THRESHOLD_MIN,
  DRACONIC_DEPTHS_TOP_UP_THRESHOLD_MAX,
  DRACONIC_DEPTHS_TOP_UP_THRESHOLD_DEFAULT,
  DRACONIC_DEPTHS_TOP_UP_THRESHOLD_DISABLED,
  DRACONIC_DEPTHS_TOP_UP_TARGET_MAX,
} from "./constants.js";

const CONTAINER_ID = "mh-bot-container";
const HEADER_ID = "mh-bot-header";
const LOCATION_BADGE_ID = "mh-bot-location-badge";
const STATE_TEXT_ID = "mh-bot-state-text";
const DRACONIC_DEPTHS_SECTION_ID = "mh-bot-draconic-depths-section";
const TOP_UP_THRESHOLD_SELECT_ID = "mh-bot-top-up-threshold";
const TOP_UP_TARGET_SELECT_ID = "mh-bot-top-up-target";
const TOP_UP_THRESHOLD_STORAGE_KEY = "mh-bot-top-up-threshold";
const TOP_UP_TARGET_STORAGE_KEY = "mh-bot-top-up-target";

const css = `
#${CONTAINER_ID} {
  font-size: 12px;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  padding: 18px;
  background: white;
}

#${HEADER_ID} {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

#${STATE_TEXT_ID} {
  font-size: 12px;
  margin: 0px;
}

#${DRACONIC_DEPTHS_SECTION_ID} {
  display: none;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
}
`;

const AppState = {
  WAITING_FOR_HORN: "WAITING_FOR_HORN",
  SOLVING_KR: "SOLVING_KR",
  STOPPED: "STOPPED",
};

function injectCSS() {
  GM_addStyle(css);
}

export function initUI() {
  injectCSS();

  const container = document.createElement("div");
  container.className = CONTAINER_ID;
  container.id = CONTAINER_ID;

  const header = document.createElement("h2");
  header.className = HEADER_ID;
  header.id = HEADER_ID;
  header.textContent = "MouseHunt Auto Horn & KR Solver";

  const locationBadge = document.createElement("span");
  locationBadge.id = LOCATION_BADGE_ID;
  header.appendChild(locationBadge);

  container.appendChild(header);

  const stateText = document.createElement("p");
  stateText.id = STATE_TEXT_ID;
  stateText.textContent = "Initializing...";
  container.appendChild(stateText);

  container.appendChild(buildDraconicDepthsSection());

  const mhContainer = document.getElementById("mousehuntContainer");
  mhContainer.insertBefore(container, mhContainer.firstChild);

  updateDraconicDepthsUI();
}

function buildDraconicDepthsSection() {
  const section = document.createElement("div");
  section.id = DRACONIC_DEPTHS_SECTION_ID;

  const thresholdLabel = document.createElement("label");
  thresholdLabel.textContent = "Top up when less than: ";
  const thresholdSelect = document.createElement("select");
  thresholdSelect.id = TOP_UP_THRESHOLD_SELECT_ID;
  for (
    let i = DRACONIC_DEPTHS_TOP_UP_THRESHOLD_MIN;
    i <= DRACONIC_DEPTHS_TOP_UP_THRESHOLD_MAX;
    i++
  ) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent =
      i === DRACONIC_DEPTHS_TOP_UP_THRESHOLD_DISABLED ? `${i} (disabled)` : i;
    thresholdSelect.appendChild(option);
  }
  const storedThreshold =
    Number(localStorage.getItem(TOP_UP_THRESHOLD_STORAGE_KEY)) ||
    DRACONIC_DEPTHS_TOP_UP_THRESHOLD_DEFAULT;
  thresholdSelect.value = storedThreshold;
  thresholdLabel.appendChild(thresholdSelect);

  const targetLabel = document.createElement("label");
  targetLabel.textContent = "Top up to: ";
  const targetSelect = document.createElement("select");
  targetSelect.id = TOP_UP_TARGET_SELECT_ID;
  targetLabel.appendChild(targetSelect);
  const storedTarget =
    Number(localStorage.getItem(TOP_UP_TARGET_STORAGE_KEY)) ||
    DRACONIC_DEPTHS_TOP_UP_TARGET_MAX;
  populateTopUpTargetOptions(targetSelect, storedThreshold, storedTarget);
  targetSelect.disabled = storedThreshold === DRACONIC_DEPTHS_TOP_UP_THRESHOLD_DISABLED;

  thresholdSelect.addEventListener("change", () => {
    localStorage.setItem(TOP_UP_THRESHOLD_STORAGE_KEY, thresholdSelect.value);
    populateTopUpTargetOptions(targetSelect, Number(thresholdSelect.value));
    localStorage.setItem(TOP_UP_TARGET_STORAGE_KEY, targetSelect.value);
    targetSelect.disabled =
      Number(thresholdSelect.value) === DRACONIC_DEPTHS_TOP_UP_THRESHOLD_DISABLED;
  });

  targetSelect.addEventListener("change", () => {
    localStorage.setItem(TOP_UP_TARGET_STORAGE_KEY, targetSelect.value);
  });

  section.appendChild(thresholdLabel);
  section.appendChild(targetLabel);

  return section;
}

function populateTopUpTargetOptions(targetSelect, minValue, preferredValue) {
  const fallbackValue =
    preferredValue ??
    (Number(targetSelect.value) || DRACONIC_DEPTHS_TOP_UP_TARGET_MAX);
  targetSelect.innerHTML = "";
  for (let i = minValue; i <= DRACONIC_DEPTHS_TOP_UP_TARGET_MAX; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    targetSelect.appendChild(option);
  }
  targetSelect.value =
    fallbackValue >= minValue ? fallbackValue : DRACONIC_DEPTHS_TOP_UP_TARGET_MAX;
}

export function updateDraconicDepthsUI() {
  const locationBadge = document.getElementById(LOCATION_BADGE_ID);
  const section = document.getElementById(DRACONIC_DEPTHS_SECTION_ID);

  if (!isInDraconicDepths()) {
    if (locationBadge.textContent !== "") {
      locationBadge.textContent = "";
    }
    section.style.display = "none";
    return;
  }

  const huntsRemaining = getHuntsRemaining();
  const badgeText =
    huntsRemaining !== null
      ? ` (Draconic Depths, ${huntsRemaining} hunts remaining)`
      : " (Draconic Depths)";
  if (locationBadge.textContent !== badgeText) {
    locationBadge.textContent = badgeText;
  }
  section.style.display = "flex";
}

function getHuntsRemaining() {
  const el = document.querySelector(DRACONIC_DEPTHS_HUNTS_REMAINING_SELECTOR);
  return el ? Number(el.textContent) : null;
}

export function isInDraconicDepths() {
  return !!document.querySelector(DRACONIC_DEPTHS_SELECTOR);
}

export function getTopUpThreshold() {
  return Number(document.getElementById(TOP_UP_THRESHOLD_SELECT_ID).value);
}

export function getTopUpTarget() {
  return Number(document.getElementById(TOP_UP_TARGET_SELECT_ID).value);
}

export function renderWaitingForHorn(nextHornTime) {
  const secsToNextHorn = Math.floor((nextHornTime - Date.now()) / 1000);
  const formattedTime = formatTime(new Date(nextHornTime));
  const stateText = getStateTextElement();
  stateText.textContent = `Waiting for next horn. Next horn at ${formattedTime} (${secsToNextHorn} seconds)`;
}

export function renderSolvingKR(attempt) {
  const stateText = getStateTextElement();
  stateText.textContent = `Solving KR (attempt ${attempt + 1}/${3})`;
}

export function renderStopped() {
  const stateText = getStateTextElement();
  stateText.textContent = `Script stopped! Please refresh to restart.`;
}

function getStateTextElement() {
  return document.getElementById(STATE_TEXT_ID);
}
