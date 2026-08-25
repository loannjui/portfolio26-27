import { onScopeDispose, ref } from "vue";
import { sanity } from "@/services/sanity.js";
import { cachedFetch } from "@/services/sanityCache.js";

/**
 * Exécute une requête GROQ et expose son résultat de façon réactive.
 *
 * En développement, écoute les mutations du dataset et réinterroge Sanity dès
 * qu'un document change : les modifications faites dans le Studio apparaissent
 * sans recharger la page. En production, l'écoute n'est pas mise en place.
 *
 * @param {string} query - Requête GROQ
 * @param {Object} [params={}] - Paramètres de la requête
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
    // '*' écoute tout le dataset : en dev on privilégie la simplicité.
    // includeResult/includeMutations à false car on refetch de toute façon,
    // inutile de faire transiter le document.
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
        error: (err) => console.warn("Écoute Sanity interrompue", err),
      });

    onScopeDispose(() => subscription.unsubscribe());
  }

  return { data, error, loading, refresh };
}
