# Fruit Ninja Clean

A lightweight take on the classic fruit slicing game. This project uses
HTML5 Canvas and vanilla JavaScript to render fruit that can be cut with a
mouse swipe. A small Node server is included for convenient local testing
and Firebase can optionally store high scores.

## Contents
- [Getting Started](#getting-started)
- [Running the Server](#running-the-server)
- [Project Layout](#project-layout)
- [Customizing](#customizing)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Fruit-Ninja-Clean
   ```
2. **(Optional) Install dependencies**
   The game currently has no third‑party packages but you may run:
   ```bash
   npm install
   ```
   if you plan on adding some later.

The game files can be opened directly in a browser, but using the provided
server avoids security restrictions that some browsers impose on local files.

## Running the Server

Start the development server with:
```bash
npm start
```
This executes `node server.js` and serves the game at
`http://localhost:8080/`. Visit that address in your browser to play.

## Project Layout
```
/
├── audio/          # Sound effects
├── images/         # Graphics
├── firebase.js     # Firebase setup
├── server.js       # Simple HTTP server
├── styling.css     # Game styles
└── index.html      # Main page
```
The core gameplay logic lives in `scripts/` (currently minimal).



Color variables and dark mode definitions are at the top of
`styling.css`. Adjust them to change the look and feel. You can also
replace images in `images/` with your own assets as long as the file names
match.

## Contributing

Pull requests and suggestions are welcome. Feel free to open an issue if
you find a bug or have an idea for improvement.

## License

This project is available under the MIT license.
