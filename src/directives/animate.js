let observer;

function getObserver() {
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      const appearing = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            (b.target.dataset.animate === "reveal") -
              (a.target.dataset.animate === "reveal") ||
            a.boundingClientRect.top - b.boundingClientRect.top,
        );

      appearing.forEach((entry, index) => {
        entry.target.style.setProperty("--animate-index", index);
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0,
      rootMargin: "0px 0px -7% 0px",
    },
  );

  return observer;
}

export const animate = {
  beforeMount(el, binding) {
    el.dataset.animate = binding.arg ?? "rise";
  },
  mounted(el) {
    getObserver().observe(el);
  },
  unmounted(el) {
    getObserver().unobserve(el);
  },
};
