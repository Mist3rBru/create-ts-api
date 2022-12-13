const path = require('node:path')
const utils = require('./utils')

const projectName = process.argv[2]
const currentPath = process.cwd()
const projectPath = path.join(currentPath, projectName)
const gitRepo = 'https://github.com/Mist3rBru/ts-api-boilerplate.git'

async function rollback(error) {
  console.error(error)
  await deleteItem(currentPath, projectName)
  process.exit(1)
}

async function deleteItem(folder, item) {
  const itemPath = path.join(folder, item)
  await utils.rm(itemPath, { recursive: true })
}

async function createProject() {
  try {
    await utils.mkdir(projectPath)
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log(
        `The folder ${projectName} already exist in the current directory, please give it another name.`
      )
      process.exit(1)
    } else {
      rollback(error)
    }
  }
}

async function cloneRepository() {
  try {
    await utils.exec(`git clone --depth 1 ${gitRepo} ${projectPath}`)
  } catch (error) {
    rollback(error)
  }
}

async function clearProject() {
  await deleteItem(projectPath, '.git')
  await deleteItem(projectPath, 'bin')
  await deleteItem(projectPath, 'README.md')
}

module.exports = {
  cloneRepository,
  createProject,
  clearProject
}
