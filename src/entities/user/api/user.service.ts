import { http } from '@/shared/api'
import type { CreateUserDto, UpdateUserDto, User } from '../model/types'
import type {
  Creatable,
  Deletable,
  Editable,
  Paginated,
  PaginationParams,
  Readable,
  Searchable,
} from '@/shared/api'

interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

function toPaginated(data: UsersResponse): Paginated<User> {
  return {
    items: data.users,
    total: data.total,
    skip: data.skip,
    limit: data.limit,
  }
}

export class UserService
  implements
    Readable<User>,
    Searchable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable
{
  async getAll({ limit = 10, skip = 0 }: PaginationParams = {}): Promise<Paginated<User>> {
    const data = await http<UsersResponse>(`/users?limit=${limit}&skip=${skip}`)
    return toPaginated(data)
  }

  async search(
    query: string,
    { limit = 10, skip = 0 }: PaginationParams = {},
  ): Promise<Paginated<User>> {
    const params = new URLSearchParams({
      q: query,
      limit: String(limit),
      skip: String(skip),
    })
    const data = await http<UsersResponse>(`/users/search?${params.toString()}`)
    return toPaginated(data)
  }

  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`)
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete(id: number): Promise<void> {
    await http(`/users/${id}`, { method: 'DELETE' })
  }
}
