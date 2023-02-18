import { formatTime } from "./utils.js";

const CONTAINER_ID = "mh-bot-container";
const HEADER_ID = "mh-bot-header";
const STATE_TEXT_ID = "mh-bot-state-text";

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
  container.appendChild(header);

  const stateText = document.createElement("p");
  stateText.id = STATE_TEXT_ID;
  stateText.textContent = "Initializing...";
  container.appendChild(stateText);

  const mhContainer = document.getElementById("mousehuntContainer");
  mhContainer.insertBefore(container, mhContainer.firstChild);
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
