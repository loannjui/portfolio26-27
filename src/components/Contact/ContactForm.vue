<script setup>
import { reactive, ref } from "vue";
import Button from "../General/Button.vue";
import Tab from "../General/Tab.vue";
import { useBlocks } from "../../composables/useBlocks.js";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  content: {
    type: Array,
    default: () => [],
  },
});

const { texts, table } = useBlocks(() => props.content);

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
    console.warn("Couldn't send form", err);
    status.value = "error";
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <section v-animate id="contact" class="drk-panel grid gap-xl">
    <div class="col-xs-12 col-xl-12 container flex-column gap-md">
      <h2 v-animate>{{ title }}</h2>
      <div v-animate class="separator" />
    </div>
    <div class="col-xs-12 col-xl-6">
      <h4 v-animate v-for="block in texts" :key="block._key">
        {{ block.content }}
      </h4>
    </div>
    <div class="col-xs-12 col-xl-6">
      <form class="grid gap-md" @submit.prevent="onSubmit">
        <label v-animate class="col-xs-6 container flex-column">
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

        <label v-animate class="col-xs-6 container flex-column">
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

        <label v-animate class="col-xs-12 container flex-column">
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

        <div v-animate class="col-xs-12">
          <Button variant="contact" :disabled="sending">
            {{ sending ? "Sending…" : "Submit" }}
          </Button>
        </div>

        <p
          v-if="status === 'sent'"
          v-animate
          class="col-xs-12 details form-status"
          role="status"
        >
          Thank you for your email, I'll answer it shortly.
        </p>
        <p
          v-else-if="status === 'error'"
          v-animate
          class="col-xs-12 details form-status"
          role="alert"
        >
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
