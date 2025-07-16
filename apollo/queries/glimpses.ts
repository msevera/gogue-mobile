import { gql } from "@apollo/client";

export const GET_GLIMPSES_LATEST = gql`
  query GetGlimpseLatest {
    glimpsesLatest {
      items {
        id
       content
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

