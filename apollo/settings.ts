import { HttpLink, ApolloLink } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { getAuth } from '@react-native-firebase/auth';
import { mergeReadObjectByPagination } from '@/apollo/cache';
import { ErrorLink } from "@apollo/client/link/error";
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
} from "@apollo/client/errors";

export const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Operation: ${operation.operationName}`
      )
    );
  } else if (CombinedProtocolErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) =>
      console.error(
        `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
          extensions
        )}`
      )
    );
  } else {
    console.error(`[Network error]: ${error}`);
  }
});

export const authLink = new SetContextLink(async (prevContext, operation) => {
  const headers = await getAuthHeaders()  
  return {
    headers: {
      ...prevContext.headers,
      ...headers
    }
  }
});

export const httpLink = authLink.concat(new HttpLink({
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

export const splitLink = ApolloLink.split(
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

export const typePolicies = {
  Query: {
    fields: {
      noteMessages: mergeReadObjectByPagination(['noteId']),
      lecturesAddedToLibrary: mergeReadObjectByPagination(),
      lectures: mergeReadObjectByPagination(['skipUserId']),
    },
  },
}

