import { Router } from "express";
import {
  createUserPokemon,
  deleteUserPokemonById,
  getPokemonById,
  getUserPokemonList,
} from "../../controllers/pokemonControllers/pokemonControllers.js";
import auth from "../../middlewares/auth/auth.js";
import {
  backupImage,
  optimizeImage,
  uploadImage,
} from "../../middlewares/imageMiddlewares/imageMiddlewares.js";
import { paths } from "../../utils/paths.js";
import createUserPokemonValidation from "../../schemas/createUserPokemon.js";

const {
  pokemon: {
    endpoints: { deleteUserPokemon, createPokemon, getOnePokemon },
  },
} = paths;

const pokemonRouter = Router();

pokemonRouter.get("/", getUserPokemonList);
pokemonRouter.delete(deleteUserPokemon, auth, deleteUserPokemonById);
pokemonRouter.post(
  createPokemon,
  auth,
  uploadImage,
  createUserPokemonValidation,
  optimizeImage,
  backupImage,
  createUserPokemon
);
pokemonRouter.get(getOnePokemon, getPokemonById);

export default pokemonRouter;
