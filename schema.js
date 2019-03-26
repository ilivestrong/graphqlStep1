const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList } = graphql
const axios = require('axios')


const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () =>  ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users : {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                        .then(res => res.data)
            }
        }
    })
})


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            async resolve(parentValue, args) {
                const companyData = await axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                return companyData.data
            }
        }
    }
})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve: (parentValue, args) => {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(res => res.data)
            }
        },
        company: {
            type: CompanyType,
            args: { id: {type : GraphQLString}},
            resolve(parentValue, args) {
                return  axios.get(`http://localhost:3000/companies/${args.id}`)
                        .then(res => res.data)
            }
        }
    }

})

module.exports = new GraphQLSchema({
    query: RootQuery
})