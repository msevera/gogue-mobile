import { gql } from '@apollo/client';

export const AUTH_USER_FRAGMENT = gql`
  fragment AuthUser on User {
    id
    firstName
    lastName
    email
    pfp
    phone
    workspaces {
      workspaceId
    }
  }
`;

export const USER_FRAGMENT = gql`
  fragment User on User {
    id
    firstName
    lastName    
    pfp   
  }
`;