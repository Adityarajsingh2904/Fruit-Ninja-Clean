# Fruit Ninja Clean

This project contains a simplified web-based fruit slicing game that mimics the classic Fruit Ninja.
It uses HTML5 Canvas for rendering and Firebase for optional high-score storage.

## Table of Contents
- [Preview](#preview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the development server](#running-the-development-server)
- [Project structure](#project-structure)
- [Deployment](#deployment)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

## Preview

Open `index.html` in a browser or start the local server to try a very basic version of the game.
Fruits appear on screen and you can slice them by dragging the mouse across them.
Scores can be saved to Firebase when configured.

## Prerequisites

- [Node.js](https://nodejs.org/) 12+ (only needed for the Node server)
- Internet connection to load external libraries (jQuery, Firebase, etc.)
- A Firebase project if you want to enable online high scores

## Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd Fruit-Ninja-Clean
   ```

2. (Optional) Install dependencies if you plan to add any later

   ```bash
   npm install
   ```

## Running the development server

Launch the provided HTTP server with:

```bash
npm start
# or
npm run dev
```

This runs `node server.js` and serves the game at `http://localhost:8080/`.
Open that address in your browser to play.
You may also open `index.html` directly, though some browsers restrict certain features when loading a file from disk.

## Project structure

```
/
├── audio/          # Sound effects
├── images/         # Fruit sprites and background assets
├── jquery.js       # Main game logic
├── jquery.min.js   # Minified game script
├── styling.css     # Styles for the game
├── server.js       # Simple Node.js server for local play
└── firebase.js     # Firebase configuration
```

The heart of the game lives in `jquery.js` (or the minified `jquery.min.js`). This script handles fruit spawning, slicing detection, and score tracking.

## Deployment

For a static deployment, host all the files on any web server. Make sure
`firebase.js` points to your own Firebase project if you want to use the real-time database.

On a Node-capable host, copy the repository and run `node server.js`. Set the
`PORT` environment variable if you need the server to listen on a different port.

## Customization

Color variables and dark-mode styles are defined at the top of `styling.css`.
Adjust these values to tweak the appearance of the game.
You can also replace the images in `images/` with your own assets as long as the filenames match.

## Contributing

Contributions and feature requests are welcome. Feel free to open issues or submit a pull request.

## License

MIT
