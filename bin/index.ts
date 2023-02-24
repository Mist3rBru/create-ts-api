#!/usr/bin/env node
import { createProject, cloneRepository, cleanProject } from './cmd'

void (async () => {
  if (process.argv.length < 3) {
    console.log('You have to provide a name to your app.')
    console.log('For example :')
    console.log('    npx create-app my-app')
    process.exit(1)
  }

  console.log('Creating project...')
  await createProject()

  console.log('Downloading files...')
  await cloneRepository()

  console.log('Removing useless files...')
  await cleanProject()

  console.log('The installation is done, it is ready to use !!!')
})()
