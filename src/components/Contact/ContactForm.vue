<script setup>
import { computed, reactive, ref } from "vue";
import Button from "../General/Button.vue";
import Tab from "../General/Tab.vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  content: {
    type: Array,
    default: () => [],
  },
});

const texts = computed(() =>
  props.content.filter((b) => b._type === "textBlock"),
);
const table = computed(() => props.content.find((b) => b._type === "table"));

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const form = reactive({
  name: "",
  email: "",
  message: "",
  // Honeypot
  botcheck: "",
});

const status = ref("idle");
const sending = ref(false);

async function onSubmit() {
  sending.value = true;
  status.value = "idle";

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: `Portfolio — message de ${form.name}`,
        ...form,
      }),
    });

    const result = await response.json();

    if (!result.success) throw new Error(result.message);

    status.value = "sent";
    Object.assign(form, { name: "", email: "", message: "" });
  } catch (err) {
    console.warn("Envoi du formulaire impossible", err);
    status.value = "error";
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <section v-animate id="contact" class="grid gap-xl">
    <div class="col-xs-12 col-xl-12 container flex-column gap-md">
      <h2>{{ title }}</h2>
      <div class="separator" />
    </div>
    <div class="col-xs-12 col-xl-6">
      <p v-animate v-for="block in texts" :key="block._key">
        {{ block.content }}
      </p>
    </div>
    <div class="col-xs-12 col-xl-6">
      <form class="grid gap-md" @submit.prevent="onSubmit">
        <label class="col-xs-6 container flex-column">
          <span>Name</span>
          <input
            v-model.trim="form.name"
            type="text"
            name="name"
            placeholder="Your name"
            autocomplete="name"
            required
          />
        </label>

        <label class="col-xs-6 container flex-column">
          <span>Email</span>
          <input
            v-model.trim="form.email"
            type="email"
            name="email"
            placeholder="Your email"
            autocomplete="email"
            required
          />
        </label>

        <label class="col-xs-12 container flex-column">
          <span>Your message</span>
          <textarea
            v-model.trim="form.message"
            name="message"
            rows="5"
            placeholder="Your message"
            required
          />
        </label>

        <!-- Honeypot -->
        <input
          v-model="form.botcheck"
          class="botcheck"
          type="checkbox"
          tabindex="-1"
          autocomplete="off"
        />

        <div class="col-xs-12">
          <Button variant="contact" :disabled="sending">
            {{ sending ? "Sending…" : "Submit" }}
          </Button>
        </div>

        <p v-if="status === 'sent'" class="col-xs-12 details form-status" role="status">
          Thank you for your email, I'll answer it shortly.
        </p>
        <p v-else-if="status === 'error'" class="col-xs-12 details form-status" role="alert">
          The delivery failed. Try it again or write me something directly.
        </p>
      </form>
    </div>
    <div class="col-xs-12 col-xl-12">
      <Tab
        v-if="table"
        :columns="table.columns"
        :rows="table.rows"
        :show-header="false"
      />
    </div>
  </section>
</template>

<style scoped>
#contact {
  position: relative;
  z-index: 1;
  background-color: var(--color-contact);
  color: var(--color-contact-text);
  border-radius: 0.5rem;
  padding: 1.5rem 1rem;
  :deep(a) {
    color: var(--color-contact-text);
  }
  :deep(table) {
    border-top: 1px solid var(--color-contact-text);
  }
  @media (min-width: 768px) {
    padding: 2rem;
  }
}

#contact .separator {
  background-color: var(--color-contact-text) !important;
}

label > span {
  text-transform: uppercase;
  color: var(--color-lgt-txt);
  padding-bottom: 0.5rem;
}

.botcheck {
  display: none;
}

input,
textarea {
  font-family: inherit;
  font-size: inherit;
  color: var(--black);
  background: var(--color-input);
  border: none;
  border-radius: 9999px;
  padding: 0.75rem 1rem;
  resize: vertical;
  transition: border-color var(--transi-fast) var(--bezier-o);

  &::placeholder {
    color: var(--color-placeholder);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--color-accent);
  }
}

textarea {
  border-radius: 1.5rem;
}

.form-status {
  justify-self: start;
  margin-bottom: 0;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  background: var(--white);
  color: var(--black);
}
</style>
