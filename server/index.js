/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
// The data below is mocked.
const data = require("./data");

// The schema should model the full data object available.
const schema = buildSchema(`
  type Pokemon {
    id: String
    name: String!
    classification: String
    types: [String]
    resistant: [String]
    weaknesses: [String]
    weight: Weight
    height: Height
    fleeRate: Float
    evolutionsRequirements: EvolutionsRequirements
    evolutions: [Evolutions]
    maxCP: Int
    maxHP: Int
    attacks: Attacks
  }

  type Weight {
    minimum: String
    maximum: String
  }

  type Height {
    minimum: String
    maximum: String
  }

  type Evolutions {
    id: Int
    name: String
  }

  type EvolutionsRequirements {
    amount: Int
    name: String
  }

  type Attacks {
    fast: [Attack]
    special: [Attack]
  }

  type Attack {
    name: String!
    type: String!
    damage: Int
  }

  type Query {
    Pokemons: [Pokemon]
    Pokemon(name: String!): Pokemon
    PokemonById(id: String): Pokemon
    PokeAttacks(type: String) : [Attack]
    
  }
`);

//    PokemonsByAttack(attack: String): Attacks
// type Mutation {
//   createMessage(input: MessageInput): Message
//   updateMessage(id: ID!, input: MessageInput): Message
// }

// The root provides the resolver functions for each type of query or mutation.
const root = {
  Pokemons: () => {
    return data.pokemon;
  },

  Pokemon: (request) => {
    const result = data.pokemon.find(
      (pokemon) => pokemon.name === request.name
    );
    //console.log("POKEEEEEEEE",result)
    return result;
  },

  PokemonById: (request) => {
    return data.pokemon.filter((pokemon) => pokemon.id === request.id);
  },

  PokeAttacks: (request) => {
    let res;
    if (request.type === "fast") {
      res = data.attacks.fast;
    }
    if (request.type === "special") {
      res = data.attacks.special;
    }
    console.log("ATAAAAACK", res);
    return res;
    //console.log(request);
    //console.log("data.attacks.fast", data.attacks.special);
    //const result = data.attack
    //const result = data.attacks.filter((att) => attacks.Attacks === request.type);
    //return result;
  },

  PokemonsByAttack: (request) => {
    const result = data.pokemon.filter(
      (pokemon) => pokemon.attacks.fast === request.attack
    );
    // [...pokemon.attacks.fast, ...pokemon.attacks.special]
    //console.log("RESSSUUUUUUULT", result);
    return result;
  },
};

// Start your express server!
const app = express();

/*
  The only endpoint for your server is `/graphql`- if you are fetching a resource, 

  The only endpoint for your server is `/graphql`- if you are fetching a resource, 
  you will need to POST your query to that endpoint. Suggestion: check out Apollo-Fetch
  or Apollo-Client. Note below where the schema and resolvers are connected. Setting graphiql
  The only endpoint for your server is `/graphql`- if you are fetching a resource, 
  you will need to POST your query to that endpoint. Suggestion: check out Apollo-Fetch
  or Apollo-Client. Note below where the schema and resolvers are connected. Setting graphiql
  The only endpoint for your server is `/graphql`- if you are fetching a resource, 
  you will need to POST your query to that endpoint. Suggestion: check out Apollo-Fetch
  or Apollo-Client. Note below where the schema and resolvers are connected. Setting graphiql
  to 'true' gives you an in-browser explorer to test your queries.
*/
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);
});
