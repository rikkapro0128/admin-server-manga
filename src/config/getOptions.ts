export enum SortType {
  ascending = 'asc',
  descending = 'desc',
}

interface MangaOptions {
  limit: number,
  index: number,
  sort: SortType,
}
interface ChapterOptions {
  limit: number,
  index: number,
  sort: SortType,
}
export const mangas: MangaOptions = {
  limit: 5,
  index: 1,
  sort: SortType.ascending
}


export const chapters: ChapterOptions = {
  limit: 5,
  index: 1,
  sort: SortType.ascending
}