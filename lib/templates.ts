import { PortfolioData } from './types';

export function generateHTML(data: PortfolioData): string {
  const { personal, projects, skills, education, contacts, theme } = data;

  const projectsHTML = projects
    .map(
      (p) => `
    <div class="project-card">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="tags">
        ${p.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
      </div>
      ${p.url ? `<a href="${p.url}" target="_blank">Переглянути →</a>` : ''}
    </div>
  `,
    )
    .join('');

  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, typeof skills>,
  );

  const skillsHTML = Object.entries(skillsByCategory)
    .map(
      ([category, items]) => `
    <div class="skill-category">
      <h3>${category}</h3>
      ${items
        .map(
          (s) => `
        <div class="skill-item">
          <div class="skill-header">
            <span>${s.name}</span>
            <span class="skill-level-text">${['', 'Початківець', 'Базовий', 'Середній', 'Просунутий', 'Експерт'][s.level]}</span>
          </div>
          <div class="skill-bar">
            <div class="skill-fill" style="width: ${s.level * 20}%"></div>
          </div>
        </div>
      `,
        )
        .join('')}
    </div>
  `,
    )
    .join('');

  const educationHTML = education
    .map(
      (e) => `
    <div class="edu-item">
      <div class="edu-header">
        <div>
          <h3>${e.degree}</h3>
          <p class="edu-school">${e.school}</p>
        </div>
        ${e.year ? `<span class="edu-year">${e.year}</span>` : ''}
      </div>
      ${e.description ? `<p class="edu-desc">${e.description}</p>` : ''}
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
    ${personal.avatar ? `<img src="${personal.avatar}" alt="${personal.name}" class="avatar" />` : ''}
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

  ${
    skills.length > 0
      ? `
  <section class="skills">
    <h2>Навички</h2>
    ${skillsHTML}
  </section>`
      : ''
  }

  ${
    education.length > 0
      ? `
  <section class="education">
    <h2>Освіта</h2>
    ${educationHTML}
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
    header { border-bottom: 2px solid #222; padding-bottom: 24px; margin-bottom: 32px; text-align: left; }
    .avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 16px; }
    h1 { font-size: 2.5rem; font-weight: normal; }
    .title { font-size: 1.1rem; color: #666; margin-top: 8px; }
    .bio { margin-bottom: 48px; font-size: 1.05rem; }
    section { margin-bottom: 48px; }
    h2 { font-size: 1.5rem; font-weight: normal; margin-bottom: 24px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
    .projects-grid { display: grid; gap: 24px; }
    .project-card { border: 1px solid #ddd; padding: 24px; }
    .project-card h3 { font-size: 1.2rem; margin-bottom: 8px; }
    .project-card p { color: #444; margin-bottom: 12px; }
    .tags { margin-bottom: 12px; }
    .tag { background: #f0f0f0; padding: 2px 10px; font-size: 0.8rem; margin-right: 6px; }
    .project-card a { color: #222; font-size: 0.9rem; }
    .skill-category { margin-bottom: 24px; }
    .skill-category h3 { font-size: 1rem; font-weight: bold; margin-bottom: 12px; color: #444; }
    .skill-item { margin-bottom: 12px; }
    .skill-header { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.95rem; }
    .skill-level-text { color: #888; font-size: 0.85rem; }
    .skill-bar { background: #f0f0f0; height: 6px; border-radius: 3px; }
    .skill-fill { height: 100%; background: #222; border-radius: 3px; transition: width 0.3s; }
    .edu-item { border-left: 2px solid #222; padding-left: 16px; margin-bottom: 24px; }
    .edu-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
    .edu-item h3 { font-size: 1.1rem; }
    .edu-school { color: #666; font-size: 0.95rem; }
    .edu-year { background: #f0f0f0; padding: 2px 10px; font-size: 0.85rem; white-space: nowrap; }
    .edu-desc { color: #555; font-size: 0.9rem; margin-top: 8px; }
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
    .avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 16px; border: 2px solid #00ff88; }
    h1 { font-size: 2.5rem; color: #00ff88; }
    .title { font-size: 1rem; color: #888; margin-top: 8px; }
    .bio { margin-bottom: 48px; color: #ccc; }
    section { margin-bottom: 48px; }
    h2 { color: #00ff88; font-size: 1.3rem; margin-bottom: 24px; letter-spacing: 2px; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 8px; }
    .projects-grid { display: grid; gap: 20px; }
    .project-card { border: 1px solid #222; background: #111; padding: 24px; border-radius: 4px; }
    .project-card h3 { color: #fff; margin-bottom: 8px; }
    .project-card p { color: #999; margin-bottom: 12px; font-size: 0.95rem; }
    .tags { margin-bottom: 12px; }
    .tag { background: #1a1a1a; border: 1px solid #333; color: #00ff88; padding: 2px 10px; font-size: 0.75rem; margin-right: 6px; }
    .project-card a { color: #00ff88; font-size: 0.9rem; text-decoration: none; }
    .skill-category { margin-bottom: 24px; }
    .skill-category h3 { font-size: 0.9rem; color: #666; margin-bottom: 12px; letter-spacing: 1px; text-transform: uppercase; }
    .skill-item { margin-bottom: 12px; }
    .skill-header { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.95rem; }
    .skill-level-text { color: #00ff88; font-size: 0.85rem; }
    .skill-bar { background: #1a1a1a; height: 4px; border-radius: 2px; }
    .skill-fill { height: 100%; background: #00ff88; border-radius: 2px; }
    .edu-item { border-left: 2px solid #00ff88; padding-left: 16px; margin-bottom: 24px; }
    .edu-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
    .edu-item h3 { color: #fff; font-size: 1.1rem; }
    .edu-school { color: #888; font-size: 0.95rem; }
    .edu-year { border: 1px solid #333; color: #00ff88; padding: 2px 10px; font-size: 0.85rem; white-space: nowrap; }
    .edu-desc { color: #777; font-size: 0.9rem; margin-top: 8px; }
    footer { margin-top: 64px; border-top: 1px solid #222; padding-top: 24px; }
    .contacts a { color: #00ff88; text-decoration: none; margin-right: 8px; }
    .generated { font-size: 0.75rem; color: #444; margin-top: 12px; }
  `;
}

function creativeCSS(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; max-width: 900px; margin: 0 auto; color: #333; line-height: 1.6; }
    header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 40px; display: flex; align-items: center; gap: 32px; }
    .avatar { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid rgba(255,255,255,0.5); }
    h1 { font-size: 3rem; font-weight: 800; }
    .title { font-size: 1.2rem; opacity: 0.85; margin-top: 8px; }
    .bio { padding: 40px; background: #f9f9f9; font-size: 1.05rem; color: #555; }
    section { padding: 40px; }
    section:nth-child(even) { background: #fafafa; }
    h2 { font-size: 1.8rem; font-weight: 800; margin-bottom: 28px; color: #667eea; }
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .project-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .project-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
    .project-card p { color: #666; font-size: 0.95rem; margin-bottom: 16px; }
    .tags { margin-bottom: 12px; }
    .tag { background: #f0edff; color: #667eea; padding: 3px 12px; border-radius: 20px; font-size: 0.78rem; margin-right: 6px; }
    .project-card a { color: #667eea; font-weight: 600; font-size: 0.9rem; text-decoration: none; }
    .skill-category { margin-bottom: 28px; }
    .skill-category h3 { font-size: 0.9rem; font-weight: 700; color: #999; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .skill-item { margin-bottom: 14px; }
    .skill-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .skill-level-text { color: #667eea; font-size: 0.85rem; font-weight: 600; }
    .skill-bar { background: #f0edff; height: 8px; border-radius: 4px; }
    .skill-fill { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 4px; }
    .edu-item { background: white; border-radius: 12px; padding: 24px; margin-bottom: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .edu-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
    .edu-item h3 { font-size: 1.1rem; font-weight: 700; }
    .edu-school { color: #888; font-size: 0.95rem; margin-top: 2px; }
    .edu-year { background: #f0edff; color: #667eea; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; white-space: nowrap; }
    .edu-desc { color: #666; font-size: 0.9rem; margin-top: 8px; }
    footer { background: #1a1a2e; color: #aaa; padding: 32px 40px; }
    .contacts a { color: #667eea; text-decoration: none; margin-right: 12px; }
    .generated { font-size: 0.75rem; color: #555; margin-top: 12px; }
  `;
}
