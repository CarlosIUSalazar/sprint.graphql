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
    PokeType(name:String!): [Pokemon]
    PokeByAttack(name:String!): [Pokemon]
  }

  type Mutation {
    addType(name:String!):[String]
    modifyPokeType(name:String!, newName:String):[String]
    modifyPokemonName(name:String!, newName:String):[Pokemon]
  }
`);

//PokeSingleAttack(name: String!): Attack

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
    } else if (request.type === "special") {
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

  PokeType: (request) => {
    const result = [];
    data.pokemon.forEach((poke) => {
      if (pokemon.types.includes(request.name)) {
        result.push(poke);
      }
    });
    console.log("Resuuuuult", poke);
    return result;
  },

  //PokeSingleAttack:(request) => {

  PokeByAttack: (request) => {
    let result = [];
    data.pokemon.forEach((pokemon) => {
      for (const obj of pokemon.attacks.fast) {
        if (obj.name === request.name) result.push(pokemon);
      }

      for (const obj of pokemon.attacks.special) {
        if (obj.name === request.name) result.push(pokemon);
      }
    });
    return result;
  },

  //////////MUTATIONS//////////

  addType: (request) => {
    data.types.push(request.name);
    console.log("NEW TYPEEEES", data.types);
    return data.types;
    // # mutation {
    //   #   addType(name:"PIZZZAA")
    //   # }
  },

  modifyPokeType: (request) => {
    console.log("request.nameeee", request.name);
    console.log("request.newNameee", request.newName);
    console.log("data.typesssss", data.types);
    // for(let item of data.types){
    //   if(data.types[item] === request.name){
    //     console.log("current item", data.types[item])
    //     data.types[item] = request.newName;
    //   }
    // }

    // data.types.forEach((typez) => {
    //   if(typez === request.name){
    //     typez = request.newName
    //   }
    // })

    for (let i = 0; i < data.types.length; i++) {
      if (data.types[i] === request.name) {
        data.types[i] = request.newName;
      }
    }
    return data.types;
    // mutation {
    //   modifyPokeType(name:"Dragon",newName:"FUUUUU")
    // }
  },

  modifyPokemonName: (request) => {
    //console.log("data.pokemonssss",data.pokemon)
    //console.log("request.nameeee",request.name)
    //console.log("request.newNameee",request.newName)
    data.pokemon.forEach((poke) => {
      //console.log("current nameee",poke.name)
      if (poke.name === request.name) {
        //console.log("TRUEEEE")
        poke.name = request.newName;
      }
    });
    //console.log(data.pokemon)
    return data.pokemon;
    // # mutation {
    //   #   modifyPokemonName(name:"Bulbasaur", newName:"ICECREAM!!") {
    //   #     id
    //   #     name
    //   #   }
    //   # }
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
