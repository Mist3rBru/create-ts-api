import { exec as execCallback } from 'node:child_process'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'
import {
  toDeleteList,
  jsonFiles,
  InvalidFolderError,
  InvalidCreateCommandError
} from './config'

export class CMD {
  readonly exec = promisify(execCallback)
  readonly gitRepo = 'https://github.com/Mist3rBru/create-ts-api.git'
  readonly project: CMD.Project

  constructor(project: Omit<CMD.Project, 'path'>) {
    if (!project.name) {
      this.errorHandler(new InvalidCreateCommandError())
    }

    this.project = {
      name: project.name,
      root: project.root,
      path: join(project.root, project.name)
    }
  }

  errorHandler(error: Error): never {
    process.stdout.write(`${error.name}: `)
    process.stdout.write(error.message)
    process.stdout.write('\n')
    process.exit(1)
  }

  print(msg: string): void {
    process.stdout.write(`> ${msg}\n`)
  }

  async rollback(error: Error): Promise<never> {
    this.print('An error ocurred, rolling back process...')
    await this.deleteItem(this.project.root, this.project.name)
    this.errorHandler(error)
  }

  async deleteItem(folder: string, item: string): Promise<void> {
    await rm(join(folder, item), { recursive: true })
  }

  async createProject(): Promise<void> {
    mkdir(this.project.path).catch(error => {
      error.code === 'EEXIST'
        ? this.errorHandler(new InvalidFolderError(this.project.name))
        : this.errorHandler(error)
    })
  }

  async cloneRepository(): Promise<void> {
    await this.exec(`git clone --depth 1 ${this.gitRepo} ${this.project.path}`)
  }

  async createMissingFiles() {
    const jsonEntries = Object.entries(jsonFiles)
    for (const [file, content] of jsonEntries) {
      await writeFile(join(this.project.path, file), JSON.stringify(content))
    }
  }

  async cleanProject(): Promise<void> {
    for (const toDelete of toDeleteList) {
      await this.deleteItem(this.project.path, toDelete)
    }
  }

  async formatProject(): Promise<void> {
    await this.exec(`npm install -g prettier@latest`)
    await this.exec(`cd ${this.project.path} && prettier --write .`)
  }
}

export namespace CMD {
  export interface Project {
    name: string
    root: string
    path: string
  }
}
