export enum SortType {
  ascending = 'asc',
  descending = 'desc',
}

interface MangaOptions {
  limit: number,
  index: number,
  sort: SortType,
}

export const mangas: MangaOptions = {
  limit: 5,
  index: 1,
  sort: SortType.ascending
}