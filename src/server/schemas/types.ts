import { type UserPokemonStructure } from "../types";

export interface LoginUserBodyRequest {
  body: {
    username: string;
    password: string;
  };
}

export interface RegisterUserBodyRequest {
  body: {
    email: string;
    username: string;
    password: string;
  };
}

export interface CreateUserPokemonBodyRequest {
  body: UserPokemonStructure;
}
