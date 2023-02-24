import './module-alias'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { createServer } from 'node:http'

const port = process.env.APP_PORT ?? '3000'

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  res.end('***  Hello World  ***')
})

server.listen(port).on('listening', () => {
  process.stdout.write(`Server running on http://localhost:${port}`)
})
