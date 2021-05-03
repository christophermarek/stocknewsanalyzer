var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
 
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);
 
// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};
//USED THIS TUTORIAL HERE FOR TEMPLATE
//https://graphql.org/graphql-js/running-an-express-graphql-server/

//THIS LOOKS LIKE A GOOD WAY TO LEARN TO SETUP THE SERVER
//https://www.howtographql.com/graphql-js/0-introduction/
//https://www.youtube.com/watch?v=ed8SzALpx1Q ok this looks better

//https://httptoolkit.tech/blog/simple-graphql-server-without-apollo/ this looks the best cause no extra tech on the stack
//https://github.com/aichbauer/express-graphql-boilerplate
//https://github.com/graphql/graphql-js

//***************** */ */
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');