import { gql } from "@apollo/client";

export const NOTE_MESSAGE = gql`
  fragment NoteMessage on NoteMessage {
    id
    role
    content
    timestamp
  }
`;