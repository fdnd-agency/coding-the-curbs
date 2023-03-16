import { GraphQLClient, gql } from 'graphql-request'
import { HYGRAPH_KEY, HYGRAPH_URL_HIGH_PERFORMANCE } from '$env/static/private'

import { responseInit } from '$lib/server/responseInit'

const hygraph = new GraphQLClient(HYGRAPH_URL_HIGH_PERFORMANCE, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_KEY}`,
  },
})

export async function GET({ params: {slug} }) {
  const query = gql`
    query getSmartzone($slug: String!){
      smartzone(where: {slug: $slug}) {
        name
        description {
          html
        }
        town
        address
        country
        geolocation {
          latitude
          longitude
        }
        size
        utilization
      }
    }
  `
  const data = await hygraph.request(query, {slug})
  return new Response(JSON.stringify(data), responseInit)
}
