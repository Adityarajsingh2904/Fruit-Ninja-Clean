# Fruit-Ninja

This demo now supports a basic dark mode and improved responsiveness.
Use the **Toggle Dark Mode** button in the menu or add the `dark` class to the
`<body>` element to enable dark styling.

## Predictive Replay

The game now records slice velocity and direction and trains a lightweight
TensorFlow.js model after each session. This generates console analytics
showing how your swipe patterns compare across the replayed slices.

## Running locally

Run the bundled Node server to serve the static files:

```bash
npm start
```

The app will be available at [http://localhost:8080](http://localhost:8080).
