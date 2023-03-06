#!/usr/bin/env node
import { CMD } from './cmd'

export async function createApi(name?: string): Promise<void> {
  const cmd = new CMD({
    name: name ?? process.argv[2],
    root: process.cwd()
  })

  const timeLabel = '🚀 Built in'
  console.time(timeLabel)

  try {
    cmd.print('Creating project...')
    await cmd.createProject()

    cmd.print('Creating files...')
    await cmd.cloneRepository()
    await cmd.createMissingFiles()
    await cmd.cleanProject()

    cmd.print('Formatting files...')
    await cmd.formatProject()

    cmd.print('The installation is done, it is ready to use !!!')
    process.stdout.write('\n')
  } catch (error) {
    await cmd.rollback(error)
  }

  console.timeEnd(timeLabel)
}

void createApi()
