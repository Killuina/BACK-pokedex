import type mongoose from "mongoose";

export enum PokemonTypes {
  fire = "Fire",
  water = "Water",
  ice = "Ice",
  poison = "Poison",
  fairy = "Fairy",
  grass = "Grass",
  ground = "Ground",
  dragon = "Dragon",
  electric = "Electric",
  bug = "Bug",
  dark = "Dark",
  fighting = "Fighting",
  flying = "Flying",
  ghost = "Ghost",
  psychic = "Psychic",
  rock = "Rock",
  steel = "Steel",
  normal = "Normal",
}

export interface UserPokemonListQuery {
  createdBy: mongoose.Types.ObjectId;
  types?: string;
}
