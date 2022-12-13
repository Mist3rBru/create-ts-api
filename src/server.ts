if (process.env.NODE_ENV === 'production') {
  require('module-alias/register')
}
import 'dotenv/config'
import { createServer, IncomingMessage, ServerResponse } from 'http'

const port = process.env.APP_PORT || '3000'

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  res.end('***  Hello World  ***')
})

server.listen(port).on('listening', () => {
  process.stdout.write(`Server running on http://localhost:${port}`)
})
