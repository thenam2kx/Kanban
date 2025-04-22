export {}

declare global {
  interface ICategoryBlogsForm {
    name: string
    slug: string
    description: string
    avatar: string
    isPublic: boolean
  }

  interface ICategoriesBlogs {
    _id: string
    name: string
    slug: string
    description: string
    avatar: string
    isPublic: boolean
  }
}