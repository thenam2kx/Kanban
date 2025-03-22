export {}

declare global {
  interface ICategory {
    _id: string;
    name: string;
    slug?: string;
    image?: string;
    description: string;
    isPublished: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ICategoryFormData extends Omit<ICategory, '_id'> {}
}
