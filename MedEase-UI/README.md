# MedEase UI

A modern React application built with Vite, React, and Tailwind CSS.

## Tech Stack

- **Vite** - Next generation frontend tooling
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - Automatic vendor prefixing

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
MedEase-UI/
├── src/
│   ├── assets/          # Static assets
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles with Tailwind directives
├── public/              # Public assets
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── vite.config.js       # Vite configuration
```

## Tailwind CSS

Tailwind CSS is configured and ready to use. You can customize the theme in `tailwind.config.js`.

### Usage

Simply use Tailwind utility classes in your components:

```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Hello, Tailwind!
</div>
```

## ESLint

This project includes ESLint for code quality. Run the linter:

```bash
npm run lint
```

## Learn More

- [Vite Documentation](https://vite.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
