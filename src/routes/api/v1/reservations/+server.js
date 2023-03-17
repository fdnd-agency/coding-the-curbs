import { gql } from 'graphql-request'
import { hygraph } from '$lib/server/hygraph'
import { responseInit } from '$lib/server/responseInit'

export async function GET({ url }) {
  let id = url.searchParams.get('id') ?? ''

  const query = gql`
    query getReservations($id: ID!) {
      reservations(where: { smartzone: { id: $id } }) {
        id
        author
        dateStart
        dateEnd
        timeStart
        timeEnd
        recurrence
        weekday
        smartzone {
          id
        }
      }
    }
  `

  const data = await hygraph.request(query, { id })
  return new Response(JSON.stringify(data), responseInit)
}

export async function POST({ request }) {
  const requestData = await request.json()
  let errors = []

  // Controleer de request data op juistheid
  if (!requestData.author || typeof requestData.author !== 'string') {
    errors.push({ field: 'author', message: 'author should exist and have a string value' })
  }
  if (!requestData.dateStart || typeof requestData.dateStart !== 'string') {
    errors.push({ field: 'dateStart', message: 'dateStart should exist and have a string value' })
  }
  if (!requestData.dateEnd || typeof requestData.dateEnd !== 'string') {
    errors.push({ field: 'dateEnd', message: 'dateEnd should exist and have a string value' })
  }
  if (!requestData.timeStart || typeof requestData.timeStart !== 'string') {
    errors.push({ field: 'timeStart', message: 'timeStart should exist and have a string value' })
  }
  if (!requestData.timeEnd || typeof requestData.timeEnd !== 'string') {
    errors.push({ field: 'timeEnd', message: 'timeEnd should exist and have a string value' })
  }
  if (!requestData.smartzoneId) {
    errors.push({ field: 'smartzoneId', message: 'smartzoneId should exist' })
  }


  // Als we hier al errors hebben in de form data sturen we die terug
  if (errors.length > 0) {
    return new Response(
      JSON.stringify({
        method: 'POST',
        working: 'yes',
        succes: false,
        errors: errors,
      })
    )

    // Geen errors, voeg de reservation toe
  } else {
    // Bereid de mutatie voor
    const mutation = gql`
      mutation createReservation($author: String!, $dateStart: Date!, $dateEnd: Date!, $timeStart: DateTime!, $timeEnd: DateTime!, $smartzoneId: ID!) {
        createReservation(data: { author: $author, dateStart: $dateStart, dateEnd: $dateEnd, timeStart: $timeStart, timeEnd: $timeEnd, smartzone: { connect: { id: $smartzoneId } } }) {
          id
        }
      }
    `
    // Bereid publiceren voor
    const publication = gql`
      mutation publishReservation($id: ID!) {
        publishReservation(where: { id: $id }, to: PUBLISHED) {
          id
        }
      }
    `

    // Voer de mutatie uit
    const data = await hygraph
      .request(mutation, { ...requestData })
      // Stuur de response met created id door
      .then((data) => {
        console.log(data)
        return (
          hygraph
            // Voer de publicatie uit met created id
            .request(publication, { id: data.createReservation.id ?? null })
            // Vang fouten af bij het publiceren
            .catch((error) => {
              errors.push({ field: 'HyGraph', message: error })
            })
        )
      })
      // Vang fouten af bij de mutatie
      .catch((error) => {
        errors.push({ field: 'HyGraph', message: error })
      })

    return new Response(
      JSON.stringify({
        method: 'POST',
        working: 'yes',
        success: data && data.publishReservation ? true : false,
        data: data && data.publishReservation,
        errors: errors,
      }),
      responseInit
    )
  }
}
