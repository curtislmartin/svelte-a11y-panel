<script lang="ts">
  import Accordion from '$lib/controls/Accordion.svelte';
  let { startOpen = false }: { startOpen?: boolean } = $props();
</script>

<Accordion title="Test Section" {startOpen}>
  {#snippet icon()}<span>★</span>{/snippet}
  {#snippet children()}<span>Child content</span>{/snippet}
</Accordion>
