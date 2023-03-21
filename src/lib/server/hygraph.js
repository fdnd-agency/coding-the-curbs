import { HYGRAPH_KEY, HYGRAPH_URL, HYGRAPH_URL_HIGH_PERFORMANCE } from '$env/static/private'
import { GraphQLClient } from 'graphql-request'

const headers = {
  headers: {
    Authorization: `Bearer ${HYGRAPH_KEY}`,
  },
}

export const hygraph = new GraphQLClient(HYGRAPH_URL, headers)
export const hygraphOnSteroids = new GraphQLClient(HYGRAPH_URL_HIGH_PERFORMANCE, headers)