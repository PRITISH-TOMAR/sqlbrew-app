// Tracks which problems the current user has solved.
// Uses the server's flag when the API provides one, and keeps a per-user
// copy in localStorage so the "Solved" state shows immediately after an
// accepted submission and on the problems list.
import { store } from '../../redux/store';

const STORAGE_PREFIX = 'sqlbrew:solved:';

function userKey() {
  const user = store.getState()?.auth?.user;
  const id = user?.id ?? user?.userId ?? user?._id ?? user?.email ?? user?.username ?? 'anon';
  return `${STORAGE_PREFIX}${id}`;
}

function readSet() {
  try {
    const raw = localStorage.getItem(userKey());
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function getSolvedIds() {
  return readSet();
}

export function isProblemSolved(problemId) {
  return problemId != null && readSet().has(String(problemId));
}

export function markProblemSolved(problemId) {
  if (problemId == null) return;
  try {
    const set = readSet();
    set.add(String(problemId));
    localStorage.setItem(userKey(), JSON.stringify([...set]));
  } catch {
    /* storage unavailable — ignore */
  }
}

/** True if an API object (problem detail or list item) says it's solved. */
export function isSolvedFromApi(obj) {
  if (!obj) return false;
  const status = String(obj.status ?? obj.userStatus ?? obj.solveStatus ?? '').toUpperCase();
  return Boolean(
    obj.solved || obj.isSolved || obj.accepted ||
    status === 'SOLVED' || status === 'ACCEPTED' || status === 'COMPLETED'
  );
}
