import { gql } from 'graphql-request'
import { hygraphOnSteroids } from '$lib/server/hygraph'
import { responseInit } from '$lib/server/responseInit'

export async function GET({ params: {slug} }) {
  const query = queryGetSmartzone()
  const data = await hygraphOnSteroids.request(query, {slug})
  
  return new Response(JSON.stringify(data), responseInit)
}

function queryGetSmartzone () {
  return gql`
  query getSmartzone($slug: String!){
    smartzone(where: {slug: $slug}) {
      id
      slug
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
      reservations {
        dateStart
        dateEnd
        timeStart
        timeEnd
        recurrence
        weekday
      }
    }
  }
`
}
