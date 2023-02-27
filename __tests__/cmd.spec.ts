import fs from 'node:fs/promises'
import child, { ChildProcess, ExecException } from 'node:child_process'
import { CMD } from '@/cmd'
import {
  InvalidCreateCommand,
  InvalidFolderError,
  jsonFiles,
  toDeleteList
} from '@/config'
import { faker } from '@faker-js/faker'
import { join } from 'node:path'

const makeSut = (props: Omit<CMD.Project, 'path'>): CMD => {
  return new CMD(props)
}

const mockProps = (): CMD.Project => ({
  name: 'my-app',
  path: join('~', 'my-app'),
  root: '~'
})

const stdoutSpy = jest.spyOn(process.stdout, 'write')
const exitSpy = jest.spyOn(process, 'exit')
const rmSpy = jest.spyOn(fs, 'rm')
const execSpy = jest.spyOn(child, 'exec')

describe('CMD', () => {
  beforeAll(() => {
    exitSpy.mockImplementation(() => ({} as never))
    stdoutSpy.mockImplementation(() => true)
    rmSpy.mockImplementation(async () => {})
    execSpy.mockImplementation(((
      command: string,
      callback: (
        error: ExecException | null,
        stdout: string,
        stderr: string
      ) => void
    ): ChildProcess => {
      if (callback) {
        callback(null, command, '')
      }
      return {} as any
    }) as any)
  })

  describe('constructor()', () => {
    it('should print error message', async () => {
      const sut = makeSut({ name: '', root: '~' })
      const error = new InvalidCreateCommand()

      expect(sut).toBeInstanceOf(CMD)
      expect(stdoutSpy).toHaveBeenCalledWith(`${error.name}: `)
      expect(stdoutSpy).toHaveBeenCalledWith(error.message)
      expect(exitSpy).toHaveBeenCalledWith(1)
    })

    it('should create CMD instance', async () => {
      const props = mockProps()
      const sut = makeSut(props)

      expect(sut).toBeInstanceOf(CMD)
      expect(stdoutSpy).toHaveBeenCalledTimes(0)
      expect(exitSpy).toHaveBeenCalledTimes(0)
    })
  })

  describe('errorHandler()', () => {
    it('should print error message', async () => {
      const props = mockProps()
      const sut = makeSut(props)
      const error = new Error('any-error')

      sut.errorHandler(error)

      expect(stdoutSpy).toHaveBeenCalledWith(`${error.name}: `)
      expect(stdoutSpy).toHaveBeenCalledWith(error.message)
      expect(exitSpy).toHaveBeenCalledWith(1)
    })
  })

  describe('print()', () => {
    it('should print cmd message', async () => {
      const props = mockProps()
      const sut = makeSut(props)

      const message = faker.lorem.paragraph()
      sut.print(message)

      expect(stdoutSpy).toHaveBeenCalledWith(`> ${message}\n`)
      expect(exitSpy).toHaveBeenCalledTimes(0)
    })
  })

  describe('rollback()', () => {
    it('should print an warn to user', async () => {
      const props = mockProps()
      const sut = makeSut(props)
      const printSpy = jest.spyOn(sut, 'print')

      const error = new Error('any-error')
      await sut.rollback(error)

      expect(printSpy).toHaveBeenCalledWith(
        'An error ocurred, rolling back process...'
      )
    })

    it('should delete project', async () => {
      const props = mockProps()
      const sut = makeSut(props)
      const deleteSpy = jest.spyOn(sut, 'deleteItem')

      const error = new Error('any-error')
      await sut.rollback(error)

      expect(deleteSpy).toHaveBeenCalledWith(props.root, props.name)
    })

    it('should handle error', async () => {
      const props = mockProps()
      const sut = makeSut(props)
      const errorHandlerSpy = jest.spyOn(sut, 'errorHandler')

      const error = new Error('any-error')
      await sut.rollback(error)

      expect(errorHandlerSpy).toHaveBeenCalledWith(error)
    })
  })

  describe('deleteItem()', () => {
    it('should delete item', async () => {
      const props = mockProps()
      const sut = makeSut(props)

      await sut.deleteItem('~', 'test')

      expect(rmSpy).toHaveBeenCalledWith(join('~', 'test'), { recursive: true })
    })
  })

  describe('createProject()', () => {
    const mkdirSpy = jest.spyOn(fs, 'mkdir')

    beforeAll(() => {
      mkdirSpy.mockImplementation(async () => '')
    })

    it('should create project folder', async () => {
      const props = mockProps()
      const sut = makeSut(props)

      await sut.createProject()

      expect(mkdirSpy).toHaveBeenCalledWith(props.path)
    })

    it('should handle InvalidFolderError', async () => {
      const props = mockProps()
      const sut = makeSut(props)
      const errorHandlerSpy = jest.spyOn(sut, 'errorHandler')
      mkdirSpy.mockImplementationOnce(async () => {
        throw { code: 'EEXIST' }
      })

      await sut.createProject()

      expect(errorHandlerSpy).toHaveBeenCalledTimes(1)
      expect(errorHandlerSpy).toHaveBeenCalledWith(
        new InvalidFolderError(props.name)
      )
    })

    it('should handle generic error', async () => {
      const props = mockProps()
      const sut = makeSut(props)

      const genericError = new Error('any-error')
      const errorHandlerSpy = jest.spyOn(sut, 'errorHandler')
      mkdirSpy.mockImplementationOnce(async () => {
        throw genericError
      })

      await sut.createProject()

      expect(errorHandlerSpy).toHaveBeenCalledTimes(1)
      expect(errorHandlerSpy).toHaveBeenCalledWith(genericError)
    })
  })

  describe('cloneRepository()', () => {
    it('should clone git repository', async () => {
      const props = mockProps()
      const sut = makeSut(props)

      await sut.cloneRepository()

      expect(execSpy).toHaveBeenCalledWith(
        `git clone --depth 1 ${sut.gitRepo} ${props.path}`,
        expect.anything()
      )
    })
  })

  describe('createMissingFiles()', () => {
    const writeSpy = jest.spyOn(fs, 'writeFile')

    beforeAll(() => {
      writeSpy.mockImplementation(async () => {})
    })

    it('should create a file for each json key', async () => {
      const props = mockProps()
      const sut = makeSut(props)

      await sut.createMissingFiles()

      const jsonEntries = Object.entries(jsonFiles)
      expect.assertions(jsonEntries.length)
      jsonEntries.forEach(([file, content]) => {
        expect(writeSpy).toHaveBeenCalledWith(
          join(props.path, file),
          JSON.stringify(content)
        )
      })
    })
  })

  describe('cleanProject()', () => {
    it('should create a file for each json key', async () => {
      const props = mockProps()
      const sut = makeSut(props)
      const deleteItemSpy = jest.spyOn(sut, 'deleteItem')

      await sut.cleanProject()

      expect.assertions(toDeleteList.length)
      toDeleteList.forEach(file => {
        expect(deleteItemSpy).toHaveBeenCalledWith(props.path, file)
      })
    })
  })

  describe('formatProject()', () => {
    it('should format project', async () => {
      const props = mockProps()
      const sut = makeSut(props)

      await sut.formatProject()

      expect(execSpy).toHaveBeenCalledWith(
        `npm install -g prettier@latest`,
        expect.anything()
      )
      expect(execSpy).toHaveBeenCalledWith(
        `cd ${props.path} && prettier --write .`,
        expect.anything()
      )
    })
  })
})
