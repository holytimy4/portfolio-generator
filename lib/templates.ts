import { PortfolioData } from './types';

export function generateHTML(data: PortfolioData): string {
  const { personal, projects, contacts, theme } = data;

  const projectsHTML = projects
    .map(
      (p) => `
    <div class="project-card">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      ${p.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
      ${p.url ? `<a href="${p.url}" target="_blank">Переглянути →</a>` : ''}
    </div>
  `,
    )
    .join('');

  const contactsHTML = [
    contacts.email &&
      `<a href="mailto:${contacts.email}">✉ ${contacts.email}</a>`,
    contacts.github &&
      `<a href="https://github.com/${contacts.github}" target="_blank">GitHub</a>`,
    contacts.linkedin &&
      `<a href="https://linkedin.com/in/${contacts.linkedin}" target="_blank">LinkedIn</a>`,
    contacts.telegram &&
      `<a href="https://t.me/${contacts.telegram}" target="_blank">Telegram</a>`,
  ]
    .filter(Boolean)
    .join(' · ');

  const themes = {
    minimal: minimalCSS(),
    dark: darkCSS(),
    creative: creativeCSS(),
  };

  return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${personal.name} — Portfolio</title>
  <style>${themes[theme]}</style>
</head>
<body>
  <header>
    <h1>${personal.name}</h1>
    <p class="title">${personal.title}</p>
  </header>

  <section class="bio">
    <p>${personal.bio}</p>
  </section>

  ${
    projects.length > 0
      ? `
  <section class="projects">
    <h2>Проєкти</h2>
    <div class="projects-grid">
      ${projectsHTML}
    </div>
  </section>`
      : ''
  }

  <footer>
    <div class="contacts">${contactsHTML}</div>
    <p class="generated">Згенеровано за допомогою Portfolio Generator</p>
  </footer>
</body>
</html>`;
}

function minimalCSS(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #222; line-height: 1.7; }
    header { border-bottom: 2px solid #222; padding-bottom: 24px; margin-bottom: 32px; }
    h1 { font-size: 2.5rem; font-weight: normal; }
    .title { font-size: 1.1rem; color: #666; margin-top: 8px; }
    .bio { margin-bottom: 48px; font-size: 1.05rem; }
    .projects h2 { font-size: 1.5rem; font-weight: normal; margin-bottom: 24px; }
    .projects-grid { display: grid; gap: 24px; }
    .project-card { border: 1px solid #ddd; padding: 24px; }
    .project-card h3 { font-size: 1.2rem; margin-bottom: 8px; }
    .project-card p { color: #444; margin-bottom: 12px; }
    .tag { background: #f0f0f0; padding: 2px 10px; font-size: 0.8rem; margin-right: 6px; }
    .project-card a { color: #222; font-size: 0.9rem; }
    footer { margin-top: 64px; border-top: 1px solid #ddd; padding-top: 24px; }
    .contacts a { color: #222; text-decoration: none; margin-right: 8px; }
    .contacts a:hover { text-decoration: underline; }
    .generated { font-size: 0.75rem; color: #aaa; margin-top: 12px; }
  `;
}

function darkCSS(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; max-width: 860px; margin: 0 auto; padding: 40px 20px; background: #0d0d0d; color: #e0e0e0; line-height: 1.7; }
    header { border-bottom: 1px solid #333; padding-bottom: 24px; margin-bottom: 32px; }
    h1 { font-size: 2.5rem; color: #00ff88; }
    .title { font-size: 1rem; color: #888; margin-top: 8px; }
    .bio { margin-bottom: 48px; color: #ccc; }
    .projects h2 { color: #00ff88; font-size: 1.3rem; margin-bottom: 24px; letter-spacing: 2px; text-transform: uppercase; }
    .projects-grid { display: grid; gap: 20px; }
    .project-card { border: 1px solid #222; background: #111; padding: 24px; border-radius: 4px; }
    .project-card h3 { color: #fff; margin-bottom: 8px; }
    .project-card p { color: #999; margin-bottom: 12px; font-size: 0.95rem; }
    .tag { background: #1a1a1a; border: 1px solid #333; color: #00ff88; padding: 2px 10px; font-size: 0.75rem; margin-right: 6px; }
    .project-card a { color: #00ff88; font-size: 0.9rem; text-decoration: none; }
    footer { margin-top: 64px; border-top: 1px solid #222; padding-top: 24px; }
    .contacts a { color: #00ff88; text-decoration: none; margin-right: 8px; }
    .generated { font-size: 0.75rem; color: #444; margin-top: 12px; }
  `;
}

function creativeCSS(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; max-width: 900px; margin: 0 auto; padding: 0; color: #333; line-height: 1.6; }
    header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 40px; }
    h1 { font-size: 3rem; font-weight: 800; }
    .title { font-size: 1.2rem; opacity: 0.85; margin-top: 8px; }
    .bio { padding: 40px; background: #f9f9f9; font-size: 1.05rem; color: #555; }
    .projects { padding: 40px; }
    .projects h2 { font-size: 1.8rem; font-weight: 800; margin-bottom: 28px; color: #667eea; }
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .project-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .project-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
    .project-card p { color: #666; font-size: 0.95rem; margin-bottom: 16px; }
    .tag { background: #f0edff; color: #667eea; padding: 3px 12px; border-radius: 20px; font-size: 0.78rem; margin-right: 6px; }
    .project-card a { color: #667eea; font-weight: 600; font-size: 0.9rem; text-decoration: none; }
    footer { background: #1a1a2e; color: #aaa; padding: 32px 40px; }
    .contacts a { color: #667eea; text-decoration: none; margin-right: 12px; }
    .generated { font-size: 0.75rem; color: #555; margin-top: 12px; }
  `;
}
