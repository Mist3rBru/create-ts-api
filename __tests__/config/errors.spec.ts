import * as Errors from '@/config/errors'

type ConstructorCall<T> = T extends new (arg: infer P) => any
  ? unknown extends P
    ? undefined
    : P
  : never

type TError = typeof Errors

type Mock = UnionToTuple<
  {
    [K in keyof TError]: [
      K extends `${string}Error` ? K : never,
      ConstructorCall<TError[K]>
    ]
  }[keyof TError]
>

describe('CustomError', () => {
  const mock: Mock = [
    ['InvalidFolderError', 'folder'],
    ['InvalidCreateCommandError', undefined]
  ]

  mock.forEach(([errorName, param]) => {
    it(`${errorName} should be instance of Error`, async () => {
      const sut = new Errors[errorName](param as any)
      expect(sut).toBeInstanceOf(Error)
      expect(sut.name).toBe(errorName)
      expect(errorName).toMatch(/Error$/)
      expect(sut.message).toBeDefined()
      expect(sut.stack).toBeDefined()
    })
  })
})
