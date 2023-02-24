import child from 'node:child_process'
import { mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'

const exec = promisify(child.exec)

const projectName = process.argv[2]
const currentPath = process.cwd()
const projectPath = join(currentPath, projectName)
const gitRepo = 'https://github.com/Mist3rBru/create-ts-api.git'

async function rollback(error: Error): Promise<never> {
  console.error(error)
  await deleteItem(currentPath, projectName)
  process.exit(1)
}

async function deleteItem(folder: string, item: string) {
  const itemPath = join(folder, item)
  await rm(itemPath, { recursive: true })
}

export async function createProject() {
  try {
    await mkdir(projectPath)
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log(
        `The folder ${projectName} already exist in the current directory, please give it another name.`
      )
      process.exit(1)
    } else {
      await rollback(error)
    }
  }
}

export async function cloneRepository() {
  try {
    await exec(`git clone --depth 1 ${gitRepo} ${projectPath}`)
  } catch (error) {
    await rollback(error)
  }
}

export async function cleanProject() {
  const toDeleteList = ['.git', '.github', 'dist', 'bin', 'README.md']
  for (const toDelete of toDeleteList) {
    await deleteItem(projectPath, toDelete)
  }
}
