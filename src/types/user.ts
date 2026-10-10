export type Gender = 'male' | 'female'

export interface UserAddress {
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface UserCompany {
  name: string
  department: string
  title: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  maidenName?: string
  age: number
  gender: Gender
  email: string
  phone: string
  username: string
  password: string
  birthDate?: string
  image?: string
  bloodGroup?: string
  height?: number
  weight?: number
  eyeColor?: string
  university?: string
  role?: string
  address?: UserAddress
  company?: UserCompany
}

export type CreateUserDto = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'username' | 'password' | 'age' | 'gender' | 'phone'
>

export type UpdateUserDto = Partial<CreateUserDto>
