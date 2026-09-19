import { onScopeDispose, ref } from "vue";
import { sanity } from "@/services/sanity.js";
import { cachedFetch } from "@/services/sanityCache.js";

// Shown in place of a section whose query failed
export const CONTENT_ERROR = "The content could not be loaded.";

/**
 * Runs a GROQ query and exposes its result reactively.
 *
 * In development, listens for dataset mutations and re-queries Sanity as soon
 * as a document changes: edits made in the Studio show up without reloading
 * the page. In production, no listener is set up.
 *
 * @param {string} query - GROQ query
 * @param {Object} [params={}] - Query parameters
 * @returns {Object} { data, error, loading, refresh }
 */
export function useSanityQuery(query, params = {}) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(true);

  async function refresh({ force = false } = {}) {
    loading.value = true;

    try {
      data.value = await cachedFetch(query, params, { force });
      error.value = null;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  refresh();

  if (import.meta.env.DEV) {
    // '*' listens to the whole dataset: in dev we favour simplicity.
    // includeResult/includeMutations are false because we refetch anyway,
    // so there is no point in sending the document over the wire.
    const subscription = sanity
      .listen(
        "*",
        {},
        {
          visibility: "query",
          includeResult: false,
          includeMutations: false,
        },
      )
      .subscribe({
        next: (event) => {
          if (event.type === "mutation") refresh({ force: true });
        },
        error: (err) => console.warn("Sanity listener interrupted", err),
      });

    onScopeDispose(() => subscription.unsubscribe());
  }

  return { data, error, loading, refresh };
}
