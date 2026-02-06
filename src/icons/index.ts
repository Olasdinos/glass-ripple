import type { IconPreset } from '../types';

// AI Models
export { claude, claudeIcon } from './claude';
export { anthropic } from './anthropic';
export { openai } from './openai';
export { gemini } from './gemini';
export { google } from './google';
export { meta } from './meta';
export { mistral } from './mistral';
export { deepseek } from './deepseek';
export { groq } from './groq';
export { cohere } from './cohere';
export { xai } from './xai';
export { qwen } from './qwen';
export { moonshot } from './moonshot';
export { doubao } from './doubao';
export { zhipu } from './zhipu';
export { perplexity } from './perplexity';
export { minimax } from './minimax';
export { baichuan } from './baichuan';
export { yi } from './yi';
export { stepfun } from './stepfun';
export { spark } from './spark';
export { inflection } from './inflection';

// Creative AI
export { midjourney } from './midjourney';
export { stability } from './stability';
export { runway } from './runway';
export { suno } from './suno';
export { pika } from './pika';
export { elevenlabs } from './elevenlabs';
export { dalle } from './dalle';
export { flux } from './flux';

// Dev Tools
export { github } from './github';
export { copilot } from './copilot';
export { cursor } from './cursor';
export { vercel } from './vercel';
export { notion } from './notion';
export { ollama } from './ollama';
export { huggingface } from './huggingface';
export { langchain } from './langchain';
export { openrouter } from './openrouter';
export { replicate } from './replicate';
export { colab } from './colab';
export { dify } from './dify';
export { windsurf } from './windsurf';
export { cline } from './cline';

// Cloud & Infra
export { nvidia } from './nvidia';
export { aws } from './aws';
export { azure } from './azure';
export { googlecloud } from './googlecloud';
export { together } from './together';
export { fireworks } from './fireworks';
export { cloudflare } from './cloudflare';
export { apple } from './apple';

// ── Imports for allPresets ────────────────────────────────────────────────

import { claude } from './claude';
import { anthropic } from './anthropic';
import { openai } from './openai';
import { gemini } from './gemini';
import { google } from './google';
import { meta } from './meta';
import { mistral } from './mistral';
import { deepseek } from './deepseek';
import { groq } from './groq';
import { cohere } from './cohere';
import { xai } from './xai';
import { qwen } from './qwen';
import { moonshot } from './moonshot';
import { doubao } from './doubao';
import { zhipu } from './zhipu';
import { perplexity } from './perplexity';
import { minimax } from './minimax';
import { baichuan } from './baichuan';
import { yi } from './yi';
import { stepfun } from './stepfun';
import { spark } from './spark';
import { inflection } from './inflection';
import { midjourney } from './midjourney';
import { stability } from './stability';
import { runway } from './runway';
import { suno } from './suno';
import { pika } from './pika';
import { elevenlabs } from './elevenlabs';
import { dalle } from './dalle';
import { flux } from './flux';
import { github } from './github';
import { copilot } from './copilot';
import { cursor } from './cursor';
import { vercel } from './vercel';
import { notion } from './notion';
import { ollama } from './ollama';
import { huggingface } from './huggingface';
import { langchain } from './langchain';
import { openrouter } from './openrouter';
import { replicate } from './replicate';
import { colab } from './colab';
import { dify } from './dify';
import { windsurf } from './windsurf';
import { cline } from './cline';
import { nvidia } from './nvidia';
import { aws } from './aws';
import { azure } from './azure';
import { googlecloud } from './googlecloud';
import { together } from './together';
import { fireworks } from './fireworks';
import { cloudflare } from './cloudflare';
import { apple } from './apple';

export const allPresets: IconPreset[] = [
  // AI Models
  claude, anthropic, openai, gemini, google, meta, mistral,
  deepseek, groq, cohere, xai, qwen, moonshot, doubao, zhipu,
  perplexity, minimax, baichuan, yi, stepfun, spark, inflection,
  // Creative AI
  midjourney, stability, runway, suno, pika, elevenlabs, dalle, flux,
  // Dev Tools
  github, copilot, cursor, vercel, notion, ollama, huggingface,
  langchain, openrouter, replicate, colab, dify, windsurf, cline,
  // Cloud & Infra
  nvidia, aws, azure, googlecloud, together, fireworks, cloudflare, apple,
];

/** Presets grouped by category for UI rendering */
export const presetsByCategory: Map<string, IconPreset[]> = new Map();
for (const preset of allPresets) {
  const cat = preset.category ?? 'Other';
  const list = presetsByCategory.get(cat) ?? [];
  list.push(preset);
  presetsByCategory.set(cat, list);
}
