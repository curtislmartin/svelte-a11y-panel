// src/init/codegen.ts
export interface InitConfig {
  accentColor: string;
  orgName: string;
  email: string;
  assessmentDate: string;
}

function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function buildPanelMount(cfg: InitConfig): string {
  return `<PanelMount config={{
  accentColor: '${cfg.accentColor}',
  statement: {
    orgName: '${esc(cfg.orgName)}',
    email: '${esc(cfg.email)}',
    assessmentDate: '${esc(cfg.assessmentDate)}',
  }
}} />`;
}

export function injectIntoLayout(existing: string, cfg: InitConfig): string {
  let content = existing;
  const importLine = `  import { PanelMount } from 'svelte-a11y-panel';`;

  if (!content.includes("from 'svelte-a11y-panel'")) {
    if (/<script[\s>]/m.test(content)) {
      content = content.replace(/(<script[^>]*>)/, `$1\n${importLine}`);
    } else {
      content = `<script lang="ts">\n${importLine}\n</script>\n\n` + content;
    }
  }

  const panel = buildPanelMount(cfg);

  if (content.includes('{@render children()}')) {
    content = content.replace('{@render children()}', `${panel}\n\n{@render children()}`);
  } else {
    content = content.trimEnd() + `\n\n${panel}\n`;
  }

  return content;
}

export function createLayout(cfg: InitConfig): string {
  return `<script lang="ts">
  import { PanelMount } from 'svelte-a11y-panel';
  let { children } = $props();
</script>

${buildPanelMount(cfg)}

{@render children()}
`;
}
