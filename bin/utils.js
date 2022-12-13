const util = require('node:util')
const fs = require('node:fs')
const child = require('node:child_process')

module.exports = {
  exec: util.promisify(child.exec),
  mkdir: util.promisify(fs.mkdir),
  rm: util.promisify(fs.rm)
}
