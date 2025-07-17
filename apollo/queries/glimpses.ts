import { gql } from "@apollo/client";

export const GET_GLIMPSES_LATEST = gql`
  query GetGlimpseLatest {
    glimpsesLatest {
      items {
       id
       topicId
       content
       query
       viewed      
       annotations {
        title
        url
        startIndex
        endIndex
       }
      }
      pageInfo {
        next
      }
    }    
  }
`;


export const CHECK_GLIMPSES_STATUS = gql`
  query CheckGlimpsesStatus {
    checkGlimpsesStatus {
      id
      status
    }    
  }
`;

export const GLIMPSE_STATUS_UPDATED_SUBSCRIPTION = gql`
  subscription GlimpseStatusUpdated {
    glimpseStatusUpdated {
      id
      status
    }
  }
`;

export const SET_GLIMPSE_VIEWED = gql`
  mutation SetGlimpseViewed($id: ID!) {
    setGlimpseViewed(input: { id: $id }) {
      id
      viewed
    }
  }
`;
