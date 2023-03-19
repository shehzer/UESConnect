const clubResolvers = require('./club')
const userResolvers = require('./user')
const positionResolvers = require('./position')
const applicationResolvers = require('./application')
const objectResolvers = require('./object')

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...clubResolvers.Query,
    ...positionResolvers.Query,
    ...applicationResolvers.Query,
    ...objectResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...clubResolvers.Mutation,
    ...positionResolvers.Mutation,
    ...applicationResolvers.Mutation,
    ...objectResolvers.Mutation,
  },
}
