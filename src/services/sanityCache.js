import { sanity } from './sanity'
import * as jsonStorage from '@/utils/jsonStorage.js'

const CACHE_PREFIX = 'sanity:'
const DEFAULT_TTL = 5 * 60 * 1000

/**
 * En développement on ne met rien en cache : voir ses modifications du Studio
 * immédiatement prime sur l'économie de requêtes.
 */
const CACHE_ENABLED = import.meta.env.PROD

/**
 * Requêtes en cours, pour ne pas lancer deux fois le même fetch en parallèle.
 * Vidé au rechargement de la page, contrairement au localStorage.
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
    // localStorage plein ou indisponible (navigation privée) : on ignore
    console.warn('Cache Sanity non enregistré', err)
  }
}

/**
 * Exécute une requête GROQ en réutilisant le résultat mis en cache s'il est
 * encore frais.
 *
 * @param {string} query - Requête GROQ
 * @param {Object} [params={}] - Paramètres de la requête
 * @param {Object} [options={}]
 * @param {number} [options.ttl=300000] - Durée de validité du cache en ms
 * @param {boolean} [options.force=false] - Ignorer le cache et refetch
 * @returns {Promise<any>} Le résultat de la requête
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

// Vide tout le cache Sanity du localStorage.

export function clearCache() {
  Object.keys(localStorage)
    .filter(key => key.startsWith(CACHE_PREFIX))
    .forEach(key => localStorage.removeItem(key))
}
