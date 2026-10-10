export interface PaginationParams {
  limit?: number
  skip?: number
}

export interface Paginated<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

export interface Readable<T> {
  getAll(params?: PaginationParams): Promise<Paginated<T>>
  getById(id: number): Promise<T>
}

export interface Searchable<T> {
  search(query: string, params?: PaginationParams): Promise<Paginated<T>>
}

export interface Creatable<T, TCreate> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate> {
  update(id: number, data: TUpdate): Promise<T>
}

export interface Deletable {
  delete(id: number): Promise<void>
}
