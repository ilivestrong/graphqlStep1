const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = graphql
const axios = require('axios')


const BASE_URL_JSON_SERVER = 'http://localhost:3000'

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`${BASE_URL_JSON_SERVER}/companies/${parentValue.id}/users`)
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
        const companyData = await axios.get(`${BASE_URL_JSON_SERVER}/companies/${parentValue.companyId}`)
        return companyData.data
      }
    }
  }
})

const mutations = new GraphQLObjectType({
  name: 'mutationType',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { name, age }) {
        return axios.post(`${BASE_URL_JSON_SERVER}/users`, { name, age })
          .then(res => res.data)
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios.delete(`${BASE_URL_JSON_SERVER}/users/${id}`)
          .then(res => res.data)
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { id, name, age, companyId }) {
        return axios.patch(`${BASE_URL_JSON_SERVER}/users/${id}`, { name, age, companyId })
          .then(res => res.data)
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
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(res => res.data)
      }
    }
  }

})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutations
})