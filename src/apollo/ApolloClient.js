import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { logout } from '../common/utils'
import MiddleWareLink from './MiddleWareLink'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
})

const errorLink = onError(({ graphQLErrors }) => {
  const err = graphQLErrors[0]
  console.log(graphQLErrors)
  if (err.code === 401 || err.status === 'UNAUTHENTICATED') {
    // 没有登录
    logout()
  }
})

const link = MiddleWareLink.concat(errorLink).concat(httpLink)

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link,
  cache
})

export default apolloClient
