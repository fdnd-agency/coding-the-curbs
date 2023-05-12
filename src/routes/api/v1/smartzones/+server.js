import { gql } from 'graphql-request'
import { hygraphOnSteroids } from '$lib/server/hygraph'
import { responseInit } from '$lib/server/responseInit'

export async function GET({ url }) {
  const first = Number(url.searchParams.get('first') ?? 5)
  const skip = Number(url.searchParams.get('skip') ?? 0)
  const direction = url.searchParams.get('direction') === 'ASC' ? 'ASC' : 'DESC'
  const orderBy = (url.searchParams.get('orderBy') ?? 'publishedAt') + '_' + direction

  // Smerigheid ahead! :) DO NOT DO THIS LIKE THIS
  let where = '{'
  if (url.searchParams.get('town')) {
    where += 'town:"' + url.searchParams.get('town') + '"'
  }
  if (url.searchParams.get('size')) {
    if (where != '{') {
      where += ','
    }
    where += 'size:' + Number(url.searchParams.get('size'))
  }
  where += '}'

  const query = gql`
    query getSmartzones($first: Int, $skip: Int, $orderBy: SmartzoneOrderByInput) {
      smartzones(first: $first, skip: $skip, orderBy: $orderBy, where: ${where}) {
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
      smartzonesConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
          pageSize
        }
      }
    }
  `
  const data = await hygraphOnSteroids.request(query, { first, skip, orderBy })

  return new Response(JSON.stringify(data), responseInit)
}