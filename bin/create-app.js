#!/usr/bin/env node
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

if (process.argv.length < 3) {
  console.log('You have to provide a name to your app.')
  console.log('For example :')
  console.log('    npx create-app my-app')
  process.exit(1)
}

const projectName = process.argv[2]
const currentPath = process.cwd()
const projectPath = path.join(currentPath, projectName)
const gitRepo = 'https://github.com/Mist3rBru/ts-api-boilerplate.git'

try {
  fs.mkdirSync(projectPath)
} catch (error) {
  if (error.code === 'EEXIST') {
    console.log(`The folder ${projectName} already exist in the current directory, please give it another name.`)
  } else {
    console.log(error)
  }
  process.exit(1)
}

try {
  console.log('Downloading files...')
  execSync(`git clone --depth 1 ${gitRepo} ${projectPath}`)

  process.chdir(projectPath)

  console.log('Removing useless files')
  fs.rmdirSync(path.join(projectPath, '.git'), { recursive: true })
  fs.rmdirSync(path.join(projectPath, 'bin'), { recursive: true })
  fs.rmSync(path.join(projectPath, 'README.md'), { recursive: true })

  console.log('The installation is done, this is ready to use !')
} catch (error) {
  console.log(error)
}
