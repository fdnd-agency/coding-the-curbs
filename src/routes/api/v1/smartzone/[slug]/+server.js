import { gql } from 'graphql-request'
import { hygraphOnSteroids } from '$lib/server/hygraph'
import { responseInit } from '$lib/server/responseInit'

export async function GET({ params: { slug } }) {
  const query = queryGetSmartzone()
  const data = await hygraphOnSteroids.request(query, { slug })

  return new Response(JSON.stringify(data), responseInit)
}

function queryGetSmartzone() {
  return gql`
    query getSmartzone($slug: String!) {
      smartzone(where: { slug: $slug }) {
        id
        slug
        name
        description {
          html
        }
        image {
          url
          height
          width
          original: url
          small: url(transformation: { image: { resize: { width: 500, fit: clip } } })
          originalAsWebP: url(transformation: { document: { output: { format: webp } } })
          smallAsWebP: url(
            transformation: { image: { resize: { width: 500, fit: clip } }, document: { output: { format: webp } } }
          )
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
