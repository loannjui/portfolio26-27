import { computed, toValue } from "vue";

export function useBlocks(content) {
  const blocks = computed(() => toValue(content) ?? []);
  const ofType = (type) =>
    computed(() => blocks.value.filter((b) => b._type === type));

  return {
    texts: ofType("textBlock"),
    images: ofType("reference"),
    buttons: ofType("button"),
    table: computed(() => blocks.value.find((b) => b._type === "table")),
  };
}
