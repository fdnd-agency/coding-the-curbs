import { gql } from 'graphql-request'
import { hygraphOnSteroids } from '$lib/server/hygraph'
import { responseInit } from '$lib/server/responseInit'

export async function GET({ url }) {
	const id = url.searchParams.get('id') || '123'
	const query = queryGetSmartzone()
  const data = await hygraphOnSteroids.request(query, { id });
	
  return new Response(JSON.stringify(data), responseInit);
}

function queryGetSmartzone () {
  return gql`
  query getSmartzone($id: ID!){
      smartzone(where: {id: $id}) {
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