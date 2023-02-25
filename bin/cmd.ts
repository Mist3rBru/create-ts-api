import child from 'node:child_process'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'

const exec = promisify(child.exec)

const projectName = process.argv[2]
const currentPath = process.cwd()
const projectPath = join(currentPath, projectName)
const gitRepo = 'https://github.com/Mist3rBru/create-ts-api.git'

export async function rollback(error: Error): Promise<never> {
  console.error('An error ocurred, rolling back process...')
  console.error(error)
  await deleteItem(currentPath, projectName)
  process.exit(1)
}

async function deleteItem(folder: string, item: string): Promise<void> {
  const itemPath = join(folder, item)
  await rm(itemPath, { recursive: true })
}

export async function createProject(): Promise<void> {
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

export async function cloneRepository(): Promise<void> {
  await exec(`git clone --depth 1 ${gitRepo} ${projectPath}`)
}

export async function createMissingFiles() {
  const missingFiles: Record<string, Record<string, string>> = require(join(
    projectPath,
    'missing-files.json'
  ))
  const config = Object.entries(missingFiles)
  for (const [file, content] of config) {
    await writeFile(join(projectPath, file), JSON.stringify(content), {
      encoding: 'utf8'
    })
  }
}

export async function cleanProject(): Promise<void> {
  const toDeleteList = [
    '.git',
    '.changeset',
    '.github',
    'bin',
    'CHANGELOG.md',
    'README.md',
    'missing-files.json'
  ]
  for (const toDelete of toDeleteList) {
    await deleteItem(projectPath, toDelete)
  }
}

export async function formatProject(): Promise<void> {
  await exec(`npm install -g prettier@latest`)
  await exec(`cd ${projectPath} && prettier --write .`)
}
