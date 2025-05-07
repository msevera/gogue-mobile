import { createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { getAuth } from '@react-native-firebase/auth';

export const authLink = setContext(async (_, { headers }) => {
  return {
    headers: {
      ...headers,
      ...(await getAuthHeaders())
    }
  }
});

export const httpLink = authLink.concat(createHttpLink({
  uri: `${process.env.EXPO_PUBLIC_API_ENDPOINT}/graphql`,
}));

export const wsLink = new GraphQLWsLink(createClient({
  shouldRetry: () => true,
  url: `${process.env.EXPO_PUBLIC_API_ENDPOINT}/subscriptions`,
  connectionParams: async () => {
    const token = await getAuth()?.currentUser?.getIdToken(true);
    const workspaceId = await AsyncStorage.getItem('workspaceId');

    return {
      authToken: token || "",
      tenantId: workspaceId || ""
    }
  },
}));

export const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const getAuthHeaders = async () => {
  const token = await getAuth()?.currentUser?.getIdToken(true);
  const workspaceId = await AsyncStorage.getItem('workspaceId');

  return {
    authorization: token ? `Bearer ${token}` : "",
    'x-tenant-id': workspaceId || ""
  }
}

