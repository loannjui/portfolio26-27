<script setup>
import { reactive, ref } from "vue";
import Button from "../General/Button.vue";

// Public by design: the key only identifies the inbox, set on web3forms.com
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const form = reactive({
  name: "",
  email: "",
  message: "",
  // Honeypot: bots fill it in, humans never see it
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

    <p v-if="status === 'sent'" class="col-xs-12 details" role="status">
      Thank you for your emai, I'll answer it shortly.
    </p>
    <p v-else-if="status === 'error'" class="col-xs-12 details" role="alert">
      The delivery failed. Try it again or write me someting directly.
    </p>
  </form>
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
  color: inherit;
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
</style>
