import http from 'http'

const server = http.createServer()
const port = process.env.APP_PORT || '3000'

server.listen(port).on('listening', () => {
  process.stdout.write(`Server running on http://localhost:${port}`)
})
