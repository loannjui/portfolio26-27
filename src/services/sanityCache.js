import { sanity } from './sanity'
import * as jsonStorage from '@/utils/jsonStorage.js'

const CACHE_PREFIX = 'sanity:'
const DEFAULT_TTL = 5 * 60 * 1000

/**
 * Nothing is cached in development: seeing Studio edits immediately matters
 * more than saving requests.
 */
const CACHE_ENABLED = import.meta.env.PROD

/**
 * In-flight requests, so the same fetch is not fired twice in parallel.
 * Cleared on page reload, unlike localStorage.
 */
const inFlight = new Map()

function cacheKey(query, params) {
  return CACHE_PREFIX + JSON.stringify({ query, params })
}

function readCache(key, ttl) {
  const entry = jsonStorage.getItem(key)

  if (!entry || typeof entry !== 'object') return null
  if (Date.now() - entry.savedAt > ttl) return null

  return entry
}

function writeCache(key, data) {
  try {
    jsonStorage.setItem(key, { savedAt: Date.now(), data })
  } catch (err) {
    // localStorage full or unavailable (private browsing): ignore it
    console.warn('Sanity cache entry not saved', err)
  }
}

/**
 * Runs a GROQ query, reusing the cached result while it is still fresh.
 *
 *
 * @param {string} query - GROQ query
 * @param {Object} [params={}] - Query parameters
 * @param {Object} [options={}]
 * @param {number} [options.ttl=300000] - Cache lifetime in ms
 * @param {boolean} [options.force=false] - Bypass the cache and refetch
 * @returns {Promise<any>} The query result
 */
export function cachedFetch(query, params = {}, { ttl = DEFAULT_TTL, force = false } = {}) {
  const key = cacheKey(query, params)

  if (!force) {
    if (CACHE_ENABLED) {
      const entry = readCache(key, ttl)
      if (entry) return Promise.resolve(entry.data)
    }

    if (inFlight.has(key)) return inFlight.get(key)
  }

  const request = sanity
    .fetch(query, params)
    .then(data => {
      if (CACHE_ENABLED) writeCache(key, data)
      return data
    })
    .finally(() => {
      inFlight.delete(key)
    })

  inFlight.set(key, request)

  return request
}

// Clears every Sanity cache entry from localStorage.

export function clearCache() {
  Object.keys(localStorage)
    .filter(key => key.startsWith(CACHE_PREFIX))
    .forEach(key => localStorage.removeItem(key))
}
