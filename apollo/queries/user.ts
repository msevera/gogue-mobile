import { gql } from '@apollo/client';
import { USER_FRAGMENT, AUTH_USER_FRAGMENT } from '../fragments/user';

export const SIGN_IN = gql`
  query SignIn($idToken: String!) {
    signIn(input: { idToken: $idToken }) {
      ...AuthUser
    }
  }
  ${AUTH_USER_FRAGMENT}
`;

export const SET_PROFILE = gql`
  mutation SetProfile($firstName: String!, $lastName: String!) {
    setProfile(input: { firstName: $firstName, lastName: $lastName }) {
      ...AuthUser
    }
  }
  ${AUTH_USER_FRAGMENT}
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...User
    }
  }
  ${USER_FRAGMENT}
`;