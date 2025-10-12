<script lang="ts">
  import { onMount } from "svelte";
  import { storage } from "#imports";
  import { isRequestStateResponse } from "@/lib/messages";

  let isDarkModeEnabled = false;
  let confidence = 0;
  let hostname = "";
  let hasUserPreference = false;

  onMount(async () => {
    // Request current state from active tab
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) return;

    // Request state from content script
    try {
      const response = await browser.tabs.sendMessage(tab.id, { type: "request-state" });
      if (isRequestStateResponse(response)) {
        hostname = response.hostname;
        confidence = response.confidence;

        isDarkModeEnabled = response.sitePreference.mode !== "light";
      }
    } catch (error) {
      console.error("Failed to get dark mode state:", error);
    }
  });

  async function handleToggle() {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab.id || !hostname) return;

    isDarkModeEnabled = !isDarkModeEnabled;
    hasUserPreference = true;

    // Store user preference
    const storageKey = `dark-mode-preference:${hostname}`;
    await storage.setItem(`local:${storageKey}`, isDarkModeEnabled);

    // Send message to content script to apply changes
    await browser.tabs.sendMessage(tab.id, {
      type: "toggle-dark-mode",
      enabled: isDarkModeEnabled,
      hostname,
    });
  }
</script>

<main>
  <h1>Just Dark Mode</h1>

  <div class="card">
    <label>
      <input type="checkbox" checked={isDarkModeEnabled} on:change={handleToggle} />
      <span>Dark Mode</span>
    </label>

    {#if hostname}
      <div class="info">
        <div class="hostname">{hostname}</div>
        <div class="confidence">
          Detection confidence: {(confidence * 100).toFixed(0)}%
          {#if hasUserPreference}
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
</style>
