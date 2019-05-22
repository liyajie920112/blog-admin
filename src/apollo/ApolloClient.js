import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { logout } from '../common/utils'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
})

const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: window.localStorage.getItem('user_token') || ''
    }
  })
  return forward(operation)
})
const errorLink = onError(({ graphQLErrors }) => {
  console.log(this)
  const err = graphQLErrors[0]
  if (err.code === 401 || err.status === 'UNAUTHENTICATED') {
    // 没有登录
    logout()
  }
})

const link = middlewareLink.concat(errorLink).concat(httpLink).concat(createUploadLink())

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link,
  cache
})

export default apolloClient
