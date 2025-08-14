import { gql } from "@apollo/client";


export const MATCHED_SOURCE_FRAGMENT = gql`
  fragment MatchedSource on Source {
    id    
    title   
    topic 
    overview    
    image {
      url
      color
      width
      height
    }
    sections {
      title
      overview
    }
    authors
    keyInsights
    keyTakeaways
  }  
`;