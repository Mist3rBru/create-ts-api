#!/usr/bin/env node
const { createProject, cloneRepository, clearProject,  } = require('./cmd')

;(async () => {
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

  console.log('Removing useless files')
  await clearProject()

  console.log('The installation is done, it is ready to use !!!')
})()
