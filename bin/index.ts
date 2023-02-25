#!/usr/bin/env node
import {
  cleanProject,
  cloneRepository,
  createMissingFiles,
  createProject,
  formatProject,
  rollback,
  print
} from './cmd'

async function main() {
  const timeLabel = '🚀 Built in'
  console.time(timeLabel)
  if (process.argv.length < 3) {
    print('You have to provide a name to your app.')
    print('For example :')
    print('    npx create-ts-api my-app')
    process.exit(1)
  }

  try {
    print('Creating project...')
    await createProject()

    print('Downloading files...')
    await cloneRepository()
    await createMissingFiles()

    print('Removing useless files...')
    await cleanProject()

    print('Formatting project ...')
    await formatProject()

    print('The installation is done, it is ready to use !!!')
    console.timeEnd(timeLabel)
    process.stdout.write('\n')
  } catch (error) {
    await rollback(error)
  }
}

void main()
