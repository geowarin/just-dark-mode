<script lang="ts">
  import { onMount } from "svelte";
  import { sendMessage } from "webext-bridge/popup";
  import type { DarkMode } from "@/lib/preferences";

  let darkMode: DarkMode = "detect";
  let confidence = 0;
  let hostname = "";

  onMount(async () => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

    const response = await sendMessage("request-state", undefined, "content-script@" + tab.id);
    hostname = response.hostname;
    confidence = response.confidence;
    darkMode = response.sitePreference.mode;
  });

  async function setMode(mode: DarkMode) {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    darkMode = mode;

    const message = {
      mode,
      hostname,
    };
    await sendMessage("toggle-dark-mode", message, "content-script@" + tab.id);
  }
</script>

<main>
  <h1>Just Dark Mode</h1>

  <div class="card">
    <div class="button-group">
      <button class:active={darkMode === "light"} on:click={() => setMode("light")}> Light Mode </button>
      <button class:active={darkMode === "dark"} on:click={() => setMode("dark")}> Dark Mode </button>
      <button class:active={darkMode === "detect"} on:click={() => setMode("detect")}> Auto </button>
    </div>

    {#if hostname}
      <div class="info">
        <div class="hostname">{hostname}</div>
        <div class="confidence">
          Detection confidence: {(confidence * 100).toFixed(0)}%
          {#if darkMode !== "detect"}
            <span class="override">(overridden)</span>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  .info {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    font-size: 0.875em;
    opacity: 0.7;
    margin-top: 0.5em;
  }

  .hostname {
    font-weight: 500;
  }

  .confidence {
    font-size: 0.8em;
  }

  .override {
    color: #ff6b35;
    font-weight: 500;
  }

  .button-group {
    display: flex;
    gap: 0.5em;
  }

  .button-group button {
    flex: 1;
    padding: 0.5em 1em;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9em;
  }

  .button-group button:hover {
    background: #083668;
  }

  .button-group button.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }
</style>
