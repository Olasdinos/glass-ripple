import { GlassRipple } from './glass-ripple';
import { claude, presetsByCategory } from './icons';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const gr = new GlassRipple({
  canvas,
  icon: claude.icon,
});

// Set initial tint to Claude's brand color
if (claude.color) gr.setTint(claude.color);

// ── Icon picker ──────────────────────────────────────────────────────────

const picker = document.getElementById('icon-picker')!;
const titleEl = document.getElementById('title')!;
let activeBtn: HTMLButtonElement | null = null;

let isFirst = true;
for (const [category, presets] of presetsByCategory) {
  // Category separator (skip for first group)
  if (!isFirst) {
    const sep = document.createElement('div');
    sep.className = 'picker-separator';
    picker.appendChild(sep);
  }
  isFirst = false;

  // Category label
  const label = document.createElement('span');
  label.className = 'picker-category';
  label.textContent = category;
  picker.appendChild(label);

  for (const preset of presets) {
    const btn = document.createElement('button');
    btn.title = preset.name;
    btn.setAttribute('aria-label', preset.name);

    // Render inline SVG preview
    const icon = preset.icon;
    if ('svgPath' in icon) {
      const vb = icon.viewBox ?? 24;
      const fillRule = icon.fillRule ? ` fill-rule="${icon.fillRule}"` : '';
      btn.innerHTML = `<svg viewBox="0 0 ${vb} ${vb}" fill="${icon.color ?? '#fff'}"><path d="${icon.svgPath}"${fillRule}/></svg>`;
    } else {
      btn.innerHTML = icon.svg;
    }

    btn.addEventListener('click', () => {
      activeBtn?.classList.remove('active');
      btn.classList.add('active');
      activeBtn = btn;
      gr.setIcon(preset.icon);
      if (preset.color) gr.setTint(preset.color);

      // Update title with fade transition
      titleEl.classList.add('fade-out');
      setTimeout(() => {
        titleEl.textContent = preset.name;
        titleEl.classList.remove('fade-out');
      }, 200);

      // Auto-scroll active button into view
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });

    // Default active state for Claude
    if (preset === claude) {
      btn.classList.add('active');
      activeBtn = btn;
    }

    picker.appendChild(btn);
  }
}
