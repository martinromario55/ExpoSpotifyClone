import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { PropsWithChildren } from 'react'

const client = new ApolloClient({
  uri: 'https://marvdasht.stepzen.net/api/idle-zebu/__graphql',
  headers: {
    Authorization:
      'apikey marvdasht::stepzen.net+1000::469389fd8fe6ef7d7a69ad67b4cba23d0929145abb3e5ab9e7b4e0a3ed7d4cdf',
  },
  cache: new InMemoryCache(),
})

const ApolloClientProvider = ({ children }: PropsWithChildren) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default ApolloClientProvider
