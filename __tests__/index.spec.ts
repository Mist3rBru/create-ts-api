import { main } from '@/index'
import { CMD } from '@/cmd'

jest.mock('@/cmd')

describe('main()', () => {
  it('should create CMD instance', async () => {
    await main()

    expect(CMD).toHaveBeenCalledTimes(1)
    expect(CMD).toHaveBeenCalledWith({
      name: process.argv[2],
      root: process.cwd()
    })
  })

  it('should create time counter', async () => {
    const timeSpy = jest.spyOn(console, 'time')
    const timeEndSpy = jest.spyOn(console, 'timeEnd')

    await main()

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

    await main()

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
      await main()
    }

    expect(CMD.prototype.rollback).toHaveBeenCalledTimes(requiredMethods.length)
  })
})
