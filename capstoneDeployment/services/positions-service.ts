import { position } from '../public/interfaces/position.interface'
import { gql } from '@apollo/client'
import client from '../components/apollo-client'

type positionReturn = {
  clubId: string
  description: string
  name: string
  numberOfOpenings: number
  q: Array<{ question: string }>
  skills: Array<{ skill: string }>
}
// const link = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors)
//     graphQLErrors.forEach(({ message, locations, path }) =>
//       console.log(
//         `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
//       )
//     );
//   if (networkError) console.log(`[Network error]: ${networkError}`);
// });

// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: ApolloLink.from([link, new HttpLink({uri: 'http://localhost:3000/api/graphql'})])
// });

export async function getPosition(filters: {
  position_id: string
}): Promise<positionReturn> {
  const query = gql`
    query Query($id: ID!) {
      position(ID: $id) {
        clubId
        description
        name
        numberOfOpenings
        q {
          question
        }
        skills {
          skill
        }
      }
    }
  `
  const variables = {
    id: filters.position_id,
  }
  return client
    .query({ query, variables, fetchPolicy: "network-only" })
    .then((response) => {
      console.log(response['data']['position'])
      return response['data']['position']
    })
    .catch((e) => {
      console.log(e)
      return e
    })
}

export async function getPositions(filters: {
  clubId: string
}): Promise<Array<position>> {
  const query = gql`
    query GetPositions($clubId: String) {
      getPositions(clubId: $clubId) {
        _id
        name
        description
      }
    }
  `
  const variables = {
    clubId: filters['clubId'],
  }
  return await client
    .query({ query, variables, fetchPolicy: "network-only" })
    .then((response) => {
      console.log('got positions')
      console.log(response['data']['getPositions'])
      return response['data']['getPositions']
    })
    .catch((e) => {
      console.log(e)
      return e
    })
}

export async function createPosition(position: position): Promise<any> {
  const mutation = gql`
    mutation Mutation($positionInput: PositionInput) {
      createPosition(positionInput: $positionInput) {
        _id
      }
    }
  `
  const formattedQuestions = position.q.map((question) => {
    return {
      question: question,
    }
  })
  const formattedSkills = position.skills.map((skill) => {
    return {
      skill: skill,
    }
  })
  const variables = {
    positionInput: {
      description: position.description,
      name: position.name,
      clubId: position.clubId,
      numberOfOpenings: position.numberOfOpenings,
      q: formattedQuestions,
      skills: formattedSkills,
    },
  }

  console.log('clubID', position.clubId)
  return client
    .mutate({ mutation, variables })
    .then((response) => {
      console.log(response)
      return response
    })
    .catch((e) => {
      console.log(e)
      return e
    })
}

export async function deletePosition(position_id: string) {
  const mutation = gql`
    mutation Mutation($id: ID!) {
      deletePosition(ID: $id)
    }
  `
  const variables = {
    id: position_id,
  }
  return client
    .mutate({ mutation, variables })
    .then((response) => {
      console.log(response)
      return response
    })
    .catch((e) => {
      console.log(e)
      return e
    })
}

export async function updatePosition(
  position_id: any,
  position_input: position,
): Promise<any> {
  const mutation = gql`
    mutation Mutation($id: ID!, $positionInput: PositionInput) {
      editPosition(ID: $id, positionInput: $positionInput)
    }
  `

  const formattedQuestions = position_input.q.map((question) => {
    return {
      question: question,
    }
  })
  const formattedSkills = position_input.skills.map((skill) => {
    return {
      skill: skill,
    }
  })
  const variables = {
    id: position_id,
    positionInput: {
      clubId: position_input.clubId,
      description: position_input.description,
      name: position_input.name,
      numberOfOpenings: position_input.numberOfOpenings,
      q: formattedQuestions,
      skills: formattedSkills,
    },
  }
  return client
    .mutate({ mutation, variables })
    .then((response) => {
      console.log(response)
      return response
    })
    .catch((e) => {
      console.log(e)
      return e
    })
}
