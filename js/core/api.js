// API centralizada del ERP

export async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

export function saveLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadLocal(key) {
  return JSON.parse(localStorage.getItem(key));
}
