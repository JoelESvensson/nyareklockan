# 🎿 NyÅreKlockan

A dramatic New Year's Eve countdown clock with a ski/Åre theme!

## Features

- ⏰ **Live Countdown** to New Year's Eve
- 🎿 **Ski/Åre Theme** with mountains, gondolas, and northern lights
- ❄️ **Animated Snowfall** with realistic snow effects
- 🔥 **Dramatic Effects** that intensify as midnight approaches:
  - 10 minutes before: Orange glow, pulsing effects
  - 1 minute before: Red intensity, shaking, heartbeat animations
  - Final 10 seconds: Giant countdown numbers
- 🎆 **Celebration Mode** with fireworks and "GOTT NYTT ÅR!"
- 🔧 **Dev Mode** for testing different countdown stages

## Live Demo

Visit: [https://yourusername.github.io/nyarsklockan](https://yourusername.github.io/nyarsklockan)

## Development

### Prerequisites

- Node.js 18 or higher
- npm

### Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Locally

```bash
# Start development server
npm run dev

# Or use serve directly
npm run serve
```

Open http://localhost:3000 in your browser.

### Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with visible browser
npm run test:headed
```

### Test Coverage

The test suite includes:

- **DOM Elements** - Verifies all required elements exist
- **Countdown Logic** - Tests time calculation and display
- **Dramatic Modes** - Tests 10min, 1min, and final countdown effects
- **Celebration** - Tests fireworks and celebration display
- **Dev Mode** - Tests the developer panel and presets

## Deployment

### GitHub Pages

This project is configured to automatically deploy to GitHub Pages:

1. Push to the `main` branch
2. GitHub Actions will run tests
3. If tests pass, the site is deployed automatically

### Manual Setup

To enable GitHub Pages:

1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. The workflow will handle the rest

## Project Structure

```
nyarsklockan/
├── index.html          # Main countdown page
├── tests.html          # Browser-based test suite
├── package.json        # NPM configuration
├── playwright.config.ts # Playwright test config
├── tests/              # Playwright test files
│   ├── dom-elements.spec.ts
│   ├── countdown.spec.ts
│   ├── dramatic-modes.spec.ts
│   ├── celebration.spec.ts
│   └── dev-mode.spec.ts
└── .github/
    └── workflows/
        └── test-and-deploy.yml
```

## Using Dev Mode

Click the 🔧 button in the bottom-left corner to access the developer panel:

- **11 minutes** - Normal mode (> 10 min remaining)
- **5 minutes** - Dramatic 10-minute mode
- **30 seconds** - Intense 1-minute mode
- **10 seconds** - Final countdown with giant numbers
- **Celebration** - New Year celebration mode
- **Reset** - Return to real-time countdown

## Technologies

- Pure HTML, CSS, JavaScript (no build step)
- [Fireworks.js](https://fireworks.js.org/) for celebration effects
- [Playwright](https://playwright.dev/) for E2E testing
- GitHub Actions for CI/CD
- GitHub Pages for hosting

## License

MIT

---

Made with ❤️ for Åre ski enthusiasts! 🎿⛷️
