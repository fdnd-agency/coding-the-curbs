import { gql } from 'graphql-request'
import { hygraph, hygraphOnSteroids } from '$lib/server/hygraph'
import { responseInit } from '$lib/server/responseInit'
import { validateField, handleErrors } from '$lib/helpers/errorHandling'

// todo: save errors in store
const errors = []

// Get Reservations
export async function GET({ url }) {
  const id = url.searchParams.get('id') ?? ''
  const query = reservationsQuery()
  const data = await hygraphOnSteroids.request(query, { id })
  
  return new Response(JSON.stringify(data), responseInit)
}

function reservationsQuery () {
  return gql`
    query getReservations($id: ID!) {
      reservations(where: { smartzone: { id: $id } }) {
        id
        author
        dateStart
        dateEnd
        timeStart
        timeEnd
        smartzone {
          id
        }
      }
    }
  `
}

// Insert Reservation
export async function POST({ request }) {
  const requestData = await request.json()
  const mutation = prepareMutation()
  const publication = preparePublication()

  const fields = [
    { name: 'author', type: 'string' },
    { name: 'dateStart', type: 'string' },
    { name: 'dateEnd', type: 'string' },
    { name: 'timeStart', type: 'string' },
    { name: 'timeEnd', type: 'string' },
    { name: 'smartzoneId', type: 'string' }
  ]
  
  fields.forEach(field => { validateField(requestData, field.name, field.type, errors) })

  if (errors.length > 0) return handleErrors(errors)

  const responseData = await insertReservation(requestData, mutation, publication)
  
  if (errors.length > 0) return handleErrors(errors)
  
  return new Response(
    JSON.stringify({ data: responseData && responseData.publishReservation }),
    responseInit
  )
}

function prepareMutation () {
  return gql`
  mutation createReservation($author: String!, $dateStart: Date!, $dateEnd: Date!, $timeStart: Date!, $timeEnd: Date!, $smartzoneId: ID!) {
    createReservation(data: { author: $author, dateStart: $dateStart, dateEnd: $dateEnd, timeStart: $timeStart, timeEnd: $timeEnd, smartzone: { connect: { id: $smartzoneId } } }) {
      id
    }
  }
  `
}

function preparePublication () {
  return gql`
  mutation publishReservation($id: ID!) {
    publishReservation(where: { id: $id }, to: PUBLISHED) {
      id
    }
  }`
}

async function insertReservation (requestData, mutation, publication) {
  const data = await hygraph
    .request(mutation, { ...requestData })
    .then((data) => {
      return (
        hygraph
          .request(publication, { id: data.createReservation.id ?? null })
          .catch((error) => {
            errors.push({ field: 'HyGraph', message: error })
          })
      )
    })
    .catch((error) => {
      errors.push({ field: 'HyGraph', message: error })
    })

    return data
}
