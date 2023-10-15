import {ApolloServer} from "apollo-server"
import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core"
import typeDefs from "./schemaGql.js"
import mongoose from "mongoose"
import {JWT_SECRET, MONGO_URL} from './config.js'
import jwt from "jsonwebtoken"

mongoose.connect(MONGO_URL,{
	useNewUrlParser:true,
	useUnifiedTopology:true
})

mongoose.connection.on("connected",()=>{
	console.log("connected to mongodb")
})
mongoose.connection.on("error",(error)=>{
	console.log("Error", error)
})

//import Model
import "./models/User.js"
import "./models/Quotes.js"
import resolvers from "./resolvers.js"

//this is middleware
const context = ({req})=>{
	const {authorization} = req.headers;
	if(authorization){
		const {userId} = jwt.verify(authorization,JWT_SECRET)
		return {userId}
	}
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context,
	plugins:[
		ApolloServerPluginLandingPageGraphQLPlayground()
	]
})

server.listen().then(({url})=>{
	console.log(`Server ready a ${url}`)
});
