#!/usr/bin/env node
import { CMD } from './cmd'

async function main() {
  const cmd = new CMD({
    name: process.argv[2],
    root: process.cwd()
  })

  const timeLabel = '🚀 Built in'
  console.time(timeLabel)

  try {
    cmd.print('Creating project...')
    await cmd.createProject()

    cmd.print('Downloading files...')
    await cmd.cloneRepository()
    await cmd.createMissingFiles()

    cmd.print('Removing useless files...')
    await cmd.cleanProject()

    cmd.print('Formatting project ...')
    await cmd.formatProject()

    cmd.print('The installation is done, it is ready to use !!!')
    process.stdout.write('\n')
  } catch (error) {
    await cmd.rollback(error)
  }

  console.timeEnd(timeLabel)
}

void main()
