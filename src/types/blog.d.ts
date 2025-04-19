export {}

declare global {

  interface IBlogFormData {
    title: string
    content: string
    excerpt: string
    tags: string[]
    categories: string[];
    isPublic: boolean
    coverImage?: string
  }

  interface IBlog {
    _id: string
    title: string
    slug: string
    content: string
    excerpt: string
    tags: {
      _id: string
      name: string
    }[]
    categories: {
      _id: string
      name: string
    }[]
    author: {
      _id: string
      fullname: string
    }
    coverImage?: string
    isPublic: string
    views: number
    createdAt: string
  }
}
