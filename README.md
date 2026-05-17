# Portfolio Generator

Веб-застосунок для автоматичної генерації персональних портфоліо-сайтів на основі введених користувачем даних.

## 🔗 Демо

[portfolio-generator-tau-seven.vercel.app](https://portfolio-generator-tau-seven.vercel.app/)

## 🚀 Функціонал

- **Multi-step форма** — покроковий збір даних (особисті дані, проєкти, контакти)
- **Live Preview** — миттєве відображення результату під час заповнення
- **3 теми оформлення** — Мінімальний, Темний, Креативний
- **Валідація даних** — підсвічування помилок в реальному часі
- **Індикатор прогресу** — показує відсоток заповнення форми
- **Автозбереження** — дані зберігаються в localStorage
- **Експорт HTML** — скачування готового портфоліо одним файлом

## 🛠 Технології

- **Next.js 15** — React фреймворк з App Router
- **TypeScript** — типізація даних
- **Tailwind CSS** — стилізація
- **LocalStorage API** — збереження стану
- **REST API** — серверна генерація HTML

## 📦 Встановлення

```bash
git clone https://github.com/holytimy4/portfolio-generator.git
cd portfolio-generator
npm install
npm run dev
```

Відкрий [http://localhost:3000](http://localhost:3000)

## 🏗 Архітектура

app/
├── api/generate/ ← REST endpoint генерації HTML
└── page.tsx ← головна сторінка
components/
├── steps/ ← кроки форми (Personal, Projects, Contacts)
├── FormWizard.tsx ← головний компонент з логікою
├── Preview.tsx ← live preview через iframe
└── ThemePicker.tsx ← вибір теми оформлення
lib/
├── types.ts ← TypeScript інтерфейси
├── templates.ts ← генератор HTML/CSS шаблонів
├── storage.ts ← робота з localStorage
└── validation.ts ← валідація форми

## 👨‍💻 Автор

[GitHub](https://github.com/holytimy4)
