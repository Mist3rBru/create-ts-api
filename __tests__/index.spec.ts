import { createApi } from '@/index'
import { CMD } from '@/cmd'

jest.mock('@/cmd')

describe('createApi()', () => {
  it('should create CMD instance with param name', async () => {
    process.argv[2] = 'any-project-name'

    await createApi()

    expect(CMD).toHaveBeenCalledTimes(1)
    expect(CMD).toHaveBeenCalledWith({
      name: 'any-project-name',
      root: process.cwd()
    })
  })

  it('should create CMD instance with given name', async () => {
    await createApi('any-project-name')

    expect(CMD).toHaveBeenCalledTimes(1)
    expect(CMD).toHaveBeenCalledWith({
      name: 'any-project-name',
      root: process.cwd()
    })
  })

  it('should create time counter', async () => {
    const timeSpy = jest.spyOn(console, 'time')
    const timeEndSpy = jest.spyOn(console, 'timeEnd')

    await createApi()

    expect(timeSpy).toHaveBeenCalledTimes(1)
    expect(timeSpy).toHaveBeenCalledWith(expect.any(String))
    expect(timeEndSpy).toHaveBeenCalledTimes(1)
    expect(timeEndSpy).toHaveBeenCalledWith(expect.any(String))
  })

  it('should call cmd required methods to create project', async () => {
    const requiredMethods: (keyof CMD)[] = [
      'print',
      'createProject',
      'cloneRepository',
      'createMissingFiles',
      'cleanProject',
      'formatProject'
    ]

    await createApi()

    expect.assertions(requiredMethods.length)
    requiredMethods.forEach(method => {
      expect(CMD.prototype[method]).toHaveBeenCalled()
    })
  })

  it('should call error handler on each error', async () => {
    const requiredMethods = [
      'createProject',
      'cloneRepository',
      'createMissingFiles',
      'cleanProject',
      'formatProject'
    ] as const

    for (const method of requiredMethods) {
      jest.spyOn(CMD.prototype, method).mockImplementationOnce(async () => {
        throw new Error()
      })
      await createApi()
    }

    expect(CMD.prototype.rollback).toHaveBeenCalledTimes(requiredMethods.length)
  })
})
