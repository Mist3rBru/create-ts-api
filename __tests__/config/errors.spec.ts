import * as Errors from '@/config/errors'

type ConstructorCall<T> = T extends new (arg: infer P) => any
  ? unknown extends P
    ? undefined
    : P
  : never

type TError = typeof Errors

type Mock = UnionToTuple<
  {
    [K in keyof TError]: [K, ConstructorCall<TError[K]>]
  }[keyof TError]
>

describe('CustomError', () => {
  const mock: Mock = [
    ['InvalidFolderError', 'folder'],
    ['InvalidCreateCommand', undefined]
  ]

  mock.forEach(([err, param]) => {
    it(`${err} should be instance of Error`, async () => {
      const sut = new Errors[err](param as any)
      expect(sut).toBeInstanceOf(Error)
      expect(sut.name).toBe(err)
      expect(sut.message).toBeDefined()
      expect(sut.stack).toBeDefined()
    })
  })
})
