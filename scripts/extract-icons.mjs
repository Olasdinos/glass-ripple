#!/usr/bin/env node
/**
 * Extract SVG icon data from @lobehub/icons and generate TypeScript preset files.
 *
 * Usage: node scripts/extract-icons.mjs
 *
 * For single-path icons → SvgPathIcon { svgPath, color, viewBox?, scale?, fillRule? }
 * For multi-path/gradient icons → SvgStringIcon { svg, scale? }
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LOBE = resolve(ROOT, 'node_modules/@lobehub/icons/es');
const OUT = resolve(ROOT, 'src/icons');

// ── Icon manifest ────────────────────────────────────────────────────────
// [lobeDir, exportName, displayName, category, colorOverride?]
const ICONS = [
  // AI Models (22)
  ['Claude',      'claude',      'Claude',       'AI Models',    '#D97757'],
  ['Anthropic',   'anthropic',   'Anthropic',    'AI Models',    '#D97757'],
  ['OpenAI',      'openai',      'OpenAI',       'AI Models',    '#10A37F'],
  ['Gemini',      'gemini',      'Gemini',       'AI Models',    '#3186FF'],
  ['Google',      'google',      'Google',       'AI Models',    '#4285F4'],
  ['Meta',        'meta',        'Meta',         'AI Models',    '#0081FB'],
  ['Mistral',     'mistral',     'Mistral',      'AI Models',    '#FF7000'],
  ['DeepSeek',    'deepseek',    'DeepSeek',     'AI Models',    '#4D6BFE'],
  ['Groq',        'groq',        'Groq',         'AI Models',    '#F55036'],
  ['Cohere',      'cohere',      'Cohere',       'AI Models',    '#39594D'],
  ['XAI',         'xai',         'xAI',          'AI Models',    '#EFEFEF'],
  ['Qwen',        'qwen',        'Qwen',         'AI Models',    '#615CED'],
  ['Moonshot',    'moonshot',    'Moonshot',     'AI Models',    '#4589F7'],
  ['Doubao',      'doubao',      'Doubao',       'AI Models',    '#4E6EF2'],
  ['Zhipu',       'zhipu',       'Zhipu',        'AI Models',    '#3D5AF1'],
  ['Perplexity',  'perplexity',  'Perplexity',   'AI Models',    '#20B8CD'],
  ['Minimax',     'minimax',     'Minimax',      'AI Models',    '#16C47F'],
  ['Baichuan',    'baichuan',    'Baichuan',     'AI Models',    '#FF7028'],
  ['Yi',          'yi',          'Yi',           'AI Models',    '#1A5CFF'],
  ['Stepfun',     'stepfun',     'Stepfun',      'AI Models',    '#325AFF'],
  ['Spark',       'spark',       'Spark',        'AI Models',    '#0070FF'],
  ['Inflection',  'inflection',  'Inflection',   'AI Models',    '#5B58F6'],

  // Creative AI (8)
  ['Midjourney',  'midjourney',  'Midjourney',   'Creative AI',  '#EFEFEF'],
  ['Stability',   'stability',   'Stability',    'Creative AI',  '#A855F7'],
  ['Runway',      'runway',      'Runway',       'Creative AI',  '#EFEFEF'],
  ['Suno',        'suno',        'Suno',         'Creative AI',  '#EFEFEF'],
  ['Pika',        'pika',        'Pika',         'Creative AI',  '#EFEFEF'],
  ['ElevenLabs',  'elevenlabs',  'ElevenLabs',   'Creative AI',  '#EFEFEF'],
  ['Dalle',       'dalle',       'DALL-E',       'Creative AI',  '#10A37F'],
  ['Flux',        'flux',        'Flux',         'Creative AI',  '#EFEFEF'],

  // Dev Tools (14)
  ['Github',      'github',      'GitHub',       'Dev Tools',    '#8B5CF6'],
  ['Copilot',     'copilot',     'Copilot',      'Dev Tools',    '#0EA5E9'],
  ['Cursor',      'cursor',      'Cursor',       'Dev Tools',    '#EFEFEF'],
  ['Vercel',      'vercel',      'Vercel',       'Dev Tools',    '#EFEFEF'],
  ['Notion',      'notion',      'Notion',       'Dev Tools',    '#EFEFEF'],
  ['Ollama',      'ollama',      'Ollama',       'Dev Tools',    '#EFEFEF'],
  ['HuggingFace', 'huggingface', 'Hugging Face', 'Dev Tools',    '#FFD21E'],
  ['LangChain',   'langchain',   'LangChain',    'Dev Tools',    '#1C3C3C'],
  ['OpenRouter',  'openrouter',  'OpenRouter',   'Dev Tools',    '#6366F1'],
  ['Replicate',   'replicate',   'Replicate',    'Dev Tools',    '#EFEFEF'],
  ['Colab',       'colab',       'Colab',        'Dev Tools',    '#F9AB00'],
  ['Dify',        'dify',        'Dify',         'Dev Tools',    '#1F6FEB'],
  ['Windsurf',    'windsurf',    'Windsurf',     'Dev Tools',    '#04DBA0'],
  ['Cline',       'cline',       'Cline',        'Dev Tools',    '#EAB308'],

  // Cloud & Infra (8)
  ['Nvidia',      'nvidia',      'NVIDIA',       'Cloud & Infra', '#74B71B'],
  ['Aws',         'aws',         'AWS',          'Cloud & Infra', '#FF9900'],
  ['Azure',       'azure',       'Azure',        'Cloud & Infra', '#0078D4'],
  ['GoogleCloud', 'googlecloud', 'Google Cloud', 'Cloud & Infra', '#4285F4'],
  ['Together',    'together',    'Together',     'Cloud & Infra', '#6366F1'],
  ['Fireworks',   'fireworks',   'Fireworks',    'Cloud & Infra', '#A855F7'],
  ['Cloudflare',  'cloudflare',  'Cloudflare',   'Cloud & Infra', '#F6821F'],
  ['Apple',       'apple',       'Apple',        'Cloud & Infra', '#EFEFEF'],
];

// ── Helpers ──────────────────────────────────────────────────────────────

function readLobeFile(dir, variant) {
  const p = resolve(LOBE, dir, 'components', `${variant}.js`);
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
}

function readStyle(dir) {
  const p = resolve(LOBE, dir, 'style.js');
  if (!existsSync(p)) return {};
  const src = readFileSync(p, 'utf8');
  const title = src.match(/TITLE\s*=\s*'([^']+)'/)?.[1] ?? dir;
  const color = src.match(/COLOR_PRIMARY\s*=\s*'([^']+)'/)?.[1] ?? '#fff';
  return { title, color };
}

/**
 * Parse all _jsx("path", { ... }) calls from Color.js or Mono.js.
 * Returns array of { d, fill?, fillRule? }
 */
function parsePaths(src) {
  const paths = [];
  // Match _jsx("path", { ... })
  const pathRegex = /_jsx\("path",\s*\{([^}]+)\}/g;
  let m;
  while ((m = pathRegex.exec(src)) !== null) {
    const block = m[1];
    const d = block.match(/d:\s*"([^"]+)"/)?.[1];
    if (!d) continue;

    const fill = block.match(/fill:\s*"([^"]+)"/)?.[1];
    const fillRule = block.match(/fillRule:\s*"([^"]+)"/)?.[1];

    // Check for dynamic fill (gradient ref like `a.fill`)
    const dynFill = block.match(/fill:\s*([a-z])\.fill/)?.[1];

    paths.push({ d, fill: fill ?? null, fillRule: fillRule ?? null, dynFill: dynFill ?? null });
  }
  return paths;
}

/**
 * Parse gradient defs from Color.js.
 * Returns array of { varName, stops: [{stopColor, offset?, stopOpacity?}], attrs: {...} }
 */
function parseGradients(src) {
  const gradients = [];
  // Match _jsxs("linearGradient", { ... children: [...] })
  const lgRegex = /_jsxs\("linearGradient",\s*\{([\s\S]*?children:\s*\[[\s\S]*?\])\s*\}/g;
  let m;
  while ((m = lgRegex.exec(src)) !== null) {
    const block = m[1];
    const id = block.match(/id:\s*([a-z])\.id/)?.[1];
    const gu = block.match(/gradientUnits:\s*"([^"]+)"/)?.[1];
    const x1 = block.match(/x1:\s*"([^"]+)"/)?.[1];
    const x2 = block.match(/x2:\s*"([^"]+)"/)?.[1];
    const y1 = block.match(/y1:\s*"([^"]+)"/)?.[1];
    const y2 = block.match(/y2:\s*"([^"]+)"/)?.[1];

    // Parse stops
    const stops = [];
    const stopRegex = /_jsx\("stop",\s*\{([^}]+)\}/g;
    let s;
    const childrenBlock = block.match(/children:\s*\[([\s\S]*)\]/)?.[1] ?? '';
    while ((s = stopRegex.exec(childrenBlock)) !== null) {
      const sb = s[1];
      const stopColor = sb.match(/stopColor:\s*"([^"]+)"/)?.[1];
      const offset = sb.match(/offset:\s*"([^"]+)"/)?.[1];
      const stopOpacity = sb.match(/stopOpacity:\s*"([^"]+)"/)?.[1];
      stops.push({ stopColor, offset, stopOpacity });
    }

    gradients.push({ varName: id, gradientUnits: gu, x1, x2, y1, y2, stops });
  }
  return gradients;
}

/**
 * Extract viewBox from source.
 */
function parseViewBox(src) {
  const m = src.match(/viewBox:\s*"([^"]+)"/);
  return m?.[1] ?? '0 0 24 24';
}

/**
 * Check for svg-level fill and fillRule.
 */
function parseSvgAttrs(src) {
  // Look for fill/fillRule on the svg element (before path calls)
  const svgBlock = src.split('_jsx("path"')[0] ?? '';
  const fill = svgBlock.match(/fill:\s*"([^"]+)"/)?.[1];
  const fillRule = svgBlock.match(/fillRule:\s*"([^"]+)"/)?.[1];
  return { fill, fillRule };
}

// ── Generator ────────────────────────────────────────────────────────────

function generateIconFile(entry) {
  const [dir, exportName, displayName, category, colorOverride] = entry;

  // Try Color.js first, then Mono.js
  let src = readLobeFile(dir, 'Color');
  let isMono = false;
  if (!src) {
    src = readLobeFile(dir, 'Mono');
    isMono = true;
  }
  if (!src) {
    console.warn(`SKIP: ${dir} — no Color.js or Mono.js`);
    return null;
  }

  const style = readStyle(dir);
  const paths = parsePaths(src);
  const viewBox = parseViewBox(src);
  const svgAttrs = parseSvgAttrs(src);

  if (paths.length === 0) {
    console.warn(`SKIP: ${dir} — no paths found`);
    return null;
  }

  // Determine if single-path icon
  const hasGradients = src.includes('linearGradient') || src.includes('radialGradient');
  const allSameFill = paths.every(p => p.fill === paths[0].fill && !p.dynFill);
  const isSinglePath = paths.length === 1 && !hasGradients;
  const isMultiPathSameColor = !isSinglePath && allSameFill && !hasGradients && paths.every(p => !p.dynFill);

  // Parse viewBox dimensions
  const vbParts = viewBox.split(' ').map(Number);
  const vbW = vbParts[2];
  const vbH = vbParts[3];
  const isStandardVB = vbW === 24 && vbH === 24;
  const needsScale = isStandardVB; // viewBox 24 needs scale 0.7

  if (isSinglePath || isMultiPathSameColor) {
    // ── SvgPathIcon ──
    const pathD = paths.map(p => p.d).join(' ');
    // Determine color: use fill from path, or colorOverride for mono
    let color;
    if (isMono || paths[0].fill === 'currentColor' || !paths[0].fill) {
      color = colorOverride;
    } else {
      color = paths[0].fill;
    }

    // Determine fillRule
    let fillRule = paths[0].fillRule ?? svgAttrs.fillRule ?? null;

    let iconObj = `    svgPath:\n      '${pathD}',`;
    iconObj += `\n    color: '${color}',`;
    if (!isStandardVB) {
      iconObj += `\n    viewBox: ${vbW},`;
    }
    if (needsScale) {
      iconObj += `\n    scale: 0.7,`;
    }
    if (fillRule && fillRule !== 'nonzero') {
      iconObj += `\n    fillRule: '${fillRule}',`;
    }

    return `import type { IconPreset } from '../types';

export const ${exportName}: IconPreset = {
  name: '${displayName}',
  category: '${category}',
  color: '${colorOverride}',
  icon: {
${iconObj}
  },
};
`;
  } else {
    // ── SvgStringIcon ── (multi-path or gradient)
    const gradients = parseGradients(src);

    // Build SVG string
    let svgParts = [];
    for (const p of paths) {
      let attrs = `d="${p.d}"`;
      if (p.fill && !p.dynFill) {
        attrs += ` fill="${p.fill}"`;
      } else if (p.dynFill) {
        // Find gradient with matching var name
        const gIdx = gradients.findIndex(g => g.varName === p.dynFill);
        if (gIdx >= 0) {
          attrs += ` fill="url(#${exportName}_g${gIdx})"`;
        }
      }
      if (p.fillRule) {
        attrs += ` fill-rule="${p.fillRule}"`;
      }
      svgParts.push(`<path ${attrs}/>`)
    }

    // Build gradient defs
    let defsStr = '';
    if (gradients.length > 0) {
      let defsContent = '';
      for (let i = 0; i < gradients.length; i++) {
        const g = gradients[i];
        let gAttrs = `id="${exportName}_g${i}"`;
        if (g.gradientUnits) gAttrs += ` gradientUnits="${g.gradientUnits}"`;
        if (g.x1) gAttrs += ` x1="${g.x1}"`;
        if (g.y1) gAttrs += ` y1="${g.y1}"`;
        if (g.x2) gAttrs += ` x2="${g.x2}"`;
        if (g.y2) gAttrs += ` y2="${g.y2}"`;

        let stopsStr = '';
        for (const s of g.stops) {
          let sAttrs = '';
          if (s.offset) sAttrs += ` offset="${s.offset}"`;
          if (s.stopColor) sAttrs += ` stop-color="${s.stopColor}"`;
          if (s.stopOpacity) sAttrs += ` stop-opacity="${s.stopOpacity}"`;
          stopsStr += `<stop${sAttrs}/>`;
        }
        defsContent += `<linearGradient ${gAttrs}>${stopsStr}</linearGradient>`;
      }
      defsStr = `<defs>${defsContent}</defs>`;
    }

    const svgContent = svgParts.join('') + defsStr;
    const scaleAttr = needsScale ? `\n    scale: 0.7,` : '';

    return `import type { IconPreset } from '../types';

export const ${exportName}: IconPreset = {
  name: '${displayName}',
  category: '${category}',
  color: '${colorOverride}',
  icon: {
    svg: '<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>',${scaleAttr}
  },
};
`;
  }
}

// ── Main ─────────────────────────────────────────────────────────────────

let generated = 0;
let skipped = 0;

for (const entry of ICONS) {
  const [dir, exportName] = entry;
  const content = generateIconFile(entry);
  if (content) {
    writeFileSync(resolve(OUT, `${exportName}.ts`), content);
    generated++;
    console.log(`OK: ${exportName}`);
  } else {
    skipped++;
  }
}

console.log(`\nDone: ${generated} generated, ${skipped} skipped`);
