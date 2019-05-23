import { ApolloLink } from 'apollo-link'
const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: window.localStorage.getItem('user_token') || ''
    }
  })
  return forward(operation)
})

export default middlewareLink
