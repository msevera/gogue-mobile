import { gql } from "@apollo/client";

export const NOTE_SHORT = gql`
  fragment Note on Note {
    id
    title
    content 
    lecture {
      id
      title
      emoji
    }
  }
`;