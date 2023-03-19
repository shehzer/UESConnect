import { position } from '../public/interfaces/position.interface'
import { gql } from '@apollo/client'
import client from '../components/apollo-client'

export async function getApplications(position_id: string) {
  const query = gql`
    query Query($positionId: String) {
      getApplications(positionID: $positionId) {
        name
        email
        description
        qA {
          answer
          question
        }
      }
    }
  `
  const variables = {
    positionId: position_id,
  }

  return client
    .query({ query, variables })
    .then((response) => {
      return response['data']['getApplications']
    })
    .catch((e) => {
      console.log(e)
      return e
    })
}
