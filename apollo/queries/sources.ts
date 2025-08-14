import { gql } from "@apollo/client";
import { MATCHED_SOURCE_FRAGMENT } from "../fragments/source";

export const GET_MATCHED_SOURCES = gql`
  query GetMatchedSources($input: MatchedSourcesInput, $pagination: PaginationInput) {
    sourcesMatched(input: $input, pagination: $pagination) {
      items {
        ...MatchedSource       
      }
      pageInfo {
        next
      }
    }    
  }
  ${MATCHED_SOURCE_FRAGMENT}
`;
