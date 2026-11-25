// What the API accepts. Anything not listed here is rejected, so a new game, board, poll or choice needs a change here
// (and a redeploy of the Worker). Scores are whole numbers; anything outside [min, max] is clamped, not stored as-is.
import polls from '../../polls.json' with { type: 'json' }

/** Difficulty votes on a daily result card. */
export const VOTES = ['breeze', 'fair', 'tricky', 'brutal']

/** "Tell us" taps, fixed choices only (no free text, ever). */
export const TELLS = ['broke', 'too-hard', 'too-easy', 'phone', 'more', 'devices']

/** All games (for Tell us and thumbs). */
export const GAMES = ['overprint', 'lookout', 'rungs', 'soupspell', 'rickety', 'star-post', 'odd-one-out', 'wonky-putt', 'blinkwire']

/**
 * Daily games: each board a player can finish today, the score range, and which way is better.
 * better: 'low' (fewer moves, strokes, seconds or coins is better) or 'high' (more points is better).
 * main: the board the hub shows the community difficulty for.
 */
export const DAILIES = {
  overprint: { main: 'small', boards: { small: { min: 1, max: 999, better: 'low' }, large: { min: 1, max: 999, better: 'low' } } },
  lookout: { main: 'small', boards: { small: { min: 0, max: 86400, better: 'low' }, medium: { min: 0, max: 86400, better: 'low' }, large: { min: 0, max: 86400, better: 'low' } } },
  rungs: { main: 'short', boards: { short: { min: 1, max: 99, better: 'low' }, tall: { min: 1, max: 99, better: 'low' }, towering: { min: 1, max: 99, better: 'low' } } },
  soupspell: { main: 'bowl', boards: { bowl: { min: 0, max: 99999, better: 'high' } } },
  rickety: { main: 'gap', boards: { gap: { min: 1, max: 999999, better: 'low' } } },
  // star-post: launches * 1000 + flight tenths of a second (fewest launches first, then the shorter flight)
  'star-post': { main: 'delivery', boards: { delivery: { min: 1, max: 999999, better: 'low' } } },
  'wonky-putt': { main: 'hole', boards: { hole: { min: 1, max: 12, better: 'low' } } },
  blinkwire: { main: 'board', boards: { board: { min: 0, max: 99999, better: 'low' } } },
}

/** Owner polls from polls.json: only approved ones are ever served or counted. */
export const POLLS = (polls.polls || []).filter((p) => p.approved === true)

/** Percentiles ("you beat 62%") are shown only once a board has this many results. */
export const MIN_FOR_PERCENTILE = 30
/** Vote shares are shown once this many votes exist (below it the card just says "thanks"). */
export const MIN_FOR_VOTES = 5
