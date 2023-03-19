import  {  ApolloServer  }  from  "apollo-server-micro";
import Cors from 'micro-cors';
import connectDb from './config/connectionDB'
// import processRequest from "graphql-upload/processRequest.js";
console.log(ApolloServer)

const cors = Cors()
const typeDefs = require("./schemas/typdefs")
const resolvers = require("./resolvers/index")
connectDb();


const  apolloServer  =  new  ApolloServer({  typeDefs,  resolvers, cache: "bounded", context: ({req}) =>{},introspection:true, playground:true, });
const startServer = apolloServer.start()

export default cors( async (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://studio.apollographql.com"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Accept, Content-Type, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Headers"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, GET, PUT, PATCH, DELETE, OPTIONS, HEAD"
    );
    if (req.method === "OPTIONS") {
        res.end();
        return false;
    }

  const contentType = req.headers['content-type']



  
  
  // if (contentType && contentType.startsWith('multipart/form-data')) {

  //   req.filePayload = await processRequest(req, res)
  // }

  await startServer

  return apolloServer.createHandler({ path: '/api/graphql' })(req, res)
})

export const config = {
  api: { bodyParser: false }
}