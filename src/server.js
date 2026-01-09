import { createApp } from "./app.js"
import { env } from "./config/env.js"

/**
 * Start the Express server
 */
function startServer() {
  const app = createApp()
  const port = env.PORT

  app.listen(port, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  GitHub User Analytics API                                ║
║                                                           ║
║  Server running on: http://localhost:${port}                 ║
║  Environment: ${env.NODE_ENV}                                 ║
║                                                           ║
║                                                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `)
  })
}

// Start the server
startServer()
