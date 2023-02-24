#!/usr/bin/env node
import {
  cleanProject,
  cloneRepository,
  createProject,
  installDependencies
} from './cmd'

async function main() {
  if (process.argv.length < 3) {
    console.log('You have to provide a name to your app.')
    console.log('For example :')
    console.log('    npx create-ts-api my-app')
    process.exit(1)
  }

  console.log('Creating project...')
  await createProject()

  console.log('Downloading files...')
  await cloneRepository()

  console.log('Installing dependencies...')
  await installDependencies()

  console.log('Removing useless files...')
  await cleanProject()

  console.log('The installation is done, it is ready to use !!!')
}

void main()
