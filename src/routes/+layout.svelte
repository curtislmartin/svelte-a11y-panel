<script lang="ts">
  import { PanelMount } from '$lib';
  let { children } = $props();
</script>

<PanelMount config={{
  statement: {
    orgName: 'Demo App',
    email: 'demo@example.com',
    assessmentDate: 'April 2026',
  }
}} />

{@render children()}
