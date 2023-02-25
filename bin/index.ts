#!/usr/bin/env node
import {
  cleanProject,
  cloneRepository,
  createMissingFiles,
  createProject,
  installDependencies,
  formatProject,
  rollback
} from './cmd'

async function main() {
  if (process.argv.length < 3) {
    console.log('You have to provide a name to your app.')
    console.log('For example :')
    console.log('    npx create-ts-api my-app')
    process.exit(1)
  }

  try {
    console.log('Creating project...')
    await createProject()

    console.log('Downloading files...')
    await cloneRepository()
    await createMissingFiles()

    console.log('Installing dependencies...')
    await installDependencies()

    console.log('Removing useless files...')
    await cleanProject()

    console.log('Formatting project ...')
    await formatProject()

    console.log('The installation is done, it is ready to use !!!')
  } catch (error) {
    await rollback(error)
  }
}

void main()
