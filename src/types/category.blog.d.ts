export {}

declare global {
  interface ICategoriesBlogs {
    _id: string
    name: string
    slug: string
    description: string
    avatar: string
    isPublic: boolean
  }
}