import { gql } from "@apollo/client";
import { NOTE_MESSAGE } from '../fragments/noteMessages';

export const GET_NOTE_MESSAGES = gql`
  query GetNoteMessages($noteId: ID!, $pagination: PaginationInput) {
    noteMessages(input: { noteId: $noteId }, pagination: $pagination) {
      items {
        ...NoteMessage       
      },
      pageInfo {
        next
      }
    }    
  }
  ${NOTE_MESSAGE}
`;
