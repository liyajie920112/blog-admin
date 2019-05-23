import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
import middlewareLink from './MiddleWareLink';

const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql'
})
const link = middlewareLink.concat(uploadLink)
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
})
export default client
