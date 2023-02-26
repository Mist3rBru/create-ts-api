export class InvalidFolderError extends Error {
  constructor(folder: string) {
    const msg = `The folder ${folder} already exist in the current directory, please give it another name.`
    super(msg)
    this.name = 'InvalidFolderError'
  }
}

export class InvalidCreateCommand extends Error {
  constructor() {
    const message = `
      You have to provide a name to your app.
      For example :
          > npx create-ts-api my-app;
    `
    super(message)
    this.name = 'InvalidCreateCommand'
  }
}
