import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageJsonPath = path.join(repoRoot, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const packageMajor = packageJson.version.match(/^(\d+)\./)?.[1];
const docsVersion = packageMajor ? `${packageMajor}.x` : undefined;
const sourceRoot = docsVersion ? path.join(repoRoot, 'website/docs', docsVersion) : undefined;

if (!sourceRoot || !fs.existsSync(sourceRoot)) {
  throw new Error(`Could not find website docs for package version ${packageJson.version}`);
}

const generatedRoot = path.join(repoRoot, 'docs');
const generatedPaths = ['README.md', 'llms.txt', 'llms-full.txt', 'api', 'guides', 'cookbook'];

const pages = [
  {
    title: 'LLM Guidelines',
    source: 'docs/guides/llm-guidelines.mdx',
    output: 'guides/llm-guidelines.md',
    description: 'Quick rules for agents writing RNTL tests.',
  },
  {
    title: 'Quick Start',
    source: 'docs/start/quick-start.mdx',
    output: 'guides/quick-start.md',
    description: 'Installation and setup basics.',
  },
  {
    title: 'How to Query',
    source: 'docs/guides/how-to-query.mdx',
    output: 'guides/how-to-query.md',
    description: 'Query priority and selection guidance.',
  },
  {
    title: 'Common Mistakes',
    source: 'docs/guides/common-mistakes.mdx',
    output: 'guides/common-mistakes.md',
    description: 'Common anti-patterns and preferred alternatives.',
  },
  {
    title: 'Troubleshooting',
    source: 'docs/guides/troubleshooting.mdx',
    output: 'guides/troubleshooting.md',
    description: 'Common integration and runtime issues.',
  },
  {
    title: 'Testing Environment',
    source: 'docs/advanced/testing-env.mdx',
    output: 'guides/testing-environment.md',
    description: 'How RNTL simulates React Native under tests.',
  },
  {
    title: 'Understanding act',
    source: 'docs/advanced/understanding-act.mdx',
    output: 'guides/understanding-act.md',
    description: 'How act warnings happen and how to resolve them.',
  },
  {
    title: 'Migration to 14.x',
    source: 'docs/start/migration-v14.mdx',
    output: 'guides/migration-v14.md',
    description: 'Breaking changes and upgrade steps for RNTL v14.',
  },
  {
    title: 'API Overview',
    source: 'docs/api.md',
    output: 'api/overview.md',
    description: 'Top-level API map.',
  },
  {
    title: 'render',
    source: 'docs/api/render.mdx',
    output: 'api/render.md',
    description: 'Rendering components in tests.',
  },
  {
    title: 'screen',
    source: 'docs/api/screen.mdx',
    output: 'api/screen.md',
    description: 'Recommended global query surface.',
  },
  {
    title: 'Queries',
    source: 'docs/api/queries.mdx',
    output: 'api/queries.md',
    description: 'Query variants and predicates.',
  },
  {
    title: 'Jest Matchers',
    source: 'docs/api/jest-matchers.mdx',
    output: 'api/jest-matchers.md',
    description: 'Built-in RNTL assertions.',
  },
  {
    title: 'User Event',
    source: 'docs/api/events/user-event.mdx',
    output: 'api/user-event.md',
    description: 'Realistic user interactions.',
  },
  {
    title: 'Fire Event',
    source: 'docs/api/events/fire-event.mdx',
    output: 'api/fire-event.md',
    description: 'Low-level event triggering.',
  },
  {
    title: 'Async Utilities',
    source: 'docs/api/misc/async.mdx',
    output: 'api/async-utilities.md',
    description: 'Async queries and wait helpers.',
  },
  {
    title: 'renderHook',
    source: 'docs/api/misc/render-hook.mdx',
    output: 'api/render-hook.md',
    description: 'Testing custom hooks.',
  },
  {
    title: 'Configuration',
    source: 'docs/api/misc/config.mdx',
    output: 'api/configuration.md',
    description: 'Runtime configuration options.',
  },
  {
    title: 'Accessibility',
    source: 'docs/api/misc/accessibility.mdx',
    output: 'api/accessibility.md',
    description: 'Accessibility helpers and hidden elements.',
  },
  {
    title: 'Other Helpers',
    source: 'docs/api/misc/other.mdx',
    output: 'api/other-helpers.md',
    description: 'within, act, cleanup, and related helpers.',
  },
  {
    title: 'Custom Render',
    source: 'cookbook/basics/custom-render.md',
    output: 'cookbook/custom-render.md',
    description: 'Reusable render wrappers.',
  },
  {
    title: 'Async Events',
    source: 'cookbook/basics/async-events.md',
    output: 'cookbook/async-events.md',
    description: 'Testing async interactions.',
  },
  {
    title: 'Network Requests',
    source: 'cookbook/advanced/network-requests.md',
    output: 'cookbook/network-requests.md',
    description: 'Testing components that make network requests.',
  },
];

for (const generatedPath of generatedPaths) {
  fs.rmSync(path.join(generatedRoot, generatedPath), { recursive: true, force: true });
}

fs.mkdirSync(generatedRoot, { recursive: true });

const writtenPages = [];

for (const page of pages) {
  const sourcePath = path.join(sourceRoot, page.source);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source doc: ${path.relative(repoRoot, sourcePath)}`);
  }

  const outputPath = path.join(generatedRoot, page.output);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const content = normalizeMarkdown(fs.readFileSync(sourcePath, 'utf8'), page.output);
  fs.writeFileSync(outputPath, content);
  writtenPages.push(page);
}

fs.writeFileSync(path.join(generatedRoot, 'README.md'), buildReadme(writtenPages));

execFileSync(
  'yarn',
  ['prettier', '--write', 'docs/README.md', 'docs/api', 'docs/guides', 'docs/cookbook'],
  { cwd: repoRoot, stdio: 'inherit' },
);

console.log(`Generated package docs from website/docs/${docsVersion}`);

function normalizeMarkdown(input, output) {
  let markdown = input.replace(/\r\n/g, '\n');

  markdown = markdown.replace(/^---\n[\s\S]*?\n---\n+/, '');
  markdown = markdown.replace(/\{#([^}]+)\}/g, '');
  markdown = markdown.replace(/<span style=\{\{[^}]+}}\>(.*?)<\/span>/g, '**$1**');
  markdown = normalizeAdmonitions(markdown);
  markdown = rewriteInternalLinks(markdown, output);

  return `${markdown.trim()}\n`;
}

function normalizeAdmonitions(markdown) {
  const lines = markdown.split('\n');
  const result = [];

  for (let index = 0; index < lines.length; index += 1) {
    const start = lines[index].match(/^:::(note|info|warning|tip|danger|caution)\s*(.*)$/);

    if (!start) {
      result.push(lines[index]);
      continue;
    }

    const body = [];
    index += 1;

    while (index < lines.length && lines[index].trim() !== ':::') {
      body.push(lines[index]);
      index += 1;
    }

    result.push(admonition(start[1].toUpperCase(), start[2], body.join('\n')));
  }

  return result.join('\n');
}

function admonition(kind, title, body) {
  const label = title.trim() ? `[!${kind}] ${title.trim()}` : `[!${kind}]`;
  const quotedBody = body
    .trim()
    .split('\n')
    .map((line) => (line ? `> ${line}` : '>'))
    .join('\n');

  return `> ${label}\n${quotedBody}`;
}

function rewriteInternalLinks(markdown, output) {
  const linkTargets = new Map([
    ['docs/api/events/user-event', 'api/user-event.md'],
    ['docs/api/events/fire-event', 'api/fire-event.md'],
    ['docs/api/misc/async', 'api/async-utilities.md'],
    ['docs/api/misc/render-hook', 'api/render-hook.md'],
    ['docs/api/misc/config', 'api/configuration.md'],
    ['docs/api/misc/accessibility', 'api/accessibility.md'],
    ['docs/api/misc/other', 'api/other-helpers.md'],
    ['docs/api/render', 'api/render.md'],
    ['docs/api/screen', 'api/screen.md'],
    ['docs/api/queries', 'api/queries.md'],
    ['docs/api/jest-matchers', 'api/jest-matchers.md'],
    ['docs/api', 'api/overview.md'],
    ['docs/guides/how-to-query', 'guides/how-to-query.md'],
    ['docs/guides/common-mistakes', 'guides/common-mistakes.md'],
    ['docs/guides/troubleshooting', 'guides/troubleshooting.md'],
    ['docs/guides/llm-guidelines', 'guides/llm-guidelines.md'],
    ['docs/advanced/testing-env', 'guides/testing-environment.md'],
    ['docs/advanced/understanding-act', 'guides/understanding-act.md'],
    ['cookbook/basics/custom-render', 'cookbook/custom-render.md'],
    ['cookbook/basics/async-events', 'cookbook/async-events.md'],
    ['cookbook/advanced/network-requests', 'cookbook/network-requests.md'],
  ]);

  return markdown.replace(/\]\(\/(?:14\.x\/)?([^)#]+)(#[^)]+)?\)/g, (match, target, hash = '') => {
    const mapped = linkTargets.get(target);

    if (!mapped) {
      return match;
    }

    const fromDirectory = path.posix.dirname(output);
    const relative = path.posix.relative(fromDirectory, mapped);
    const normalized = relative.startsWith('.') ? relative : `./${relative}`;

    return `](${normalized}${hash})`;
  });
}

function buildReadme(pages) {
  return `# React Native Testing Library package docs

These markdown files are bundled with the npm package for coding agents. They describe the installed package version.

Start with [LLM Guidelines](./guides/llm-guidelines.md) for the agent setup snippet and quick rules, or use the included page list below to load specific references.

## Included pages

${pages.map((page) => `- [${page.title}](./${page.output}) - ${page.description}`).join('\n')}
`;
}
