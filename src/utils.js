import { HORN_DELAY_MAX_SECS, HORN_DELAY_MIN_SECS } from "./constants.js";

export function sum(arr) {
  return arr.reduce((a, b) => a + b);
}

export async function sleep(ms) {
  return new Promise((_) => setTimeout(_, ms));
}

export async function soundHorn() {
  const horn = document.querySelector(".huntersHornView__horn--reveal");
  const mouseDown = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
  });
  const mouseUp = new MouseEvent("mouseup", {
    bubbles: true,
    cancelable: true,
  });

  horn.dispatchEvent(mouseDown);
  await sleep(500);
  horn.dispatchEvent(mouseUp);
  await sleep(2000);

  const messageText = document.querySelector(
    ".huntersHornView__message"
  ).textContent;
  if (messageText !== "") {
    window.location.reload();
  }
}

export function getSecsToNextHorn() {
  const timerText = document.querySelector(
    ".huntersHornView__timerState--type-countdown"
  ).textContent;
  const [mins, secs] = timerText.split(":");
  return Number(mins) * 60 + Number(secs);
}

export function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const mins = date.getMinutes().toString().padStart(2, "0");
  const secs = date.getSeconds().toString().padStart(2, "0");

  return `${hours}:${mins}:${secs}`;
}

export function log(message) {
  const time = formatTime(new Date());
  console.log(`${time}: ${message}`);
}

export function getRandomHornDelay() {
  return Math.max(Math.random() * HORN_DELAY_MAX_SECS, HORN_DELAY_MIN_SECS);
}
