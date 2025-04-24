export {}

declare global {

  interface ITags {
    _id: string
    name: string
    slug: string
    isPublic: boolean
  }

  interface IFormTags {
    name: string
    isPublic: boolean
  }
}
