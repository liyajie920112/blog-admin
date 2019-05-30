import { ApolloLink } from 'apollo-link'
const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: window.localStorage.getItem('user_token') || ''
    }
  })
  // 过滤掉__typename
  if (operation.variables && operation.operationName !== 'uploadimg') {
    operation.variables = JSON.parse(JSON.stringify(operation.variables), (key, value) => {
      return key === '__typename' ? undefined : value
    })
  }
  return forward(operation)
})

export default middlewareLink
