import { gql } from "@apollo/client";
import { NOTE_SHORT } from '../fragments/note';

export const GET_NOTES = gql`
  query GetNotes($pagination: PaginationInput) {
    notes(pagination: $pagination) {
      items {
        ...Note       
      }
    }    
  }
  ${NOTE_SHORT}
`;

export const GET_NOTE = gql`
  query GetNote($id: ID!) {
    note(id: $id) {
      ...Note
    }
  }
  ${NOTE_SHORT}
`;

export const GET_NOTE_AGENT = gql`
  query GetNoteAgent($id: ID!) {
    noteAgent(id: $id) {
      config
    }
  }
`;

export const NOTE_CREATED_SUBSCRIPTION = gql`
  subscription NoteCreated {
    noteCreated {
      ...Note
    }
  }
  ${NOTE_SHORT}
`;