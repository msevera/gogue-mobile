import { gql } from "@apollo/client";

export const LECTURE_SHORT_FRAGMENT = gql`
  fragment LectureShort on Lecture {
    id
    topic
    title    
    userId
    emoji
    checkpoint
    creationEvent {
      name
    }
    sections {     
      title
      hasContent
    }
  }
`;

export const LECTURE_FULL_FRAGMENT = gql`
  fragment LectureFull on Lecture {
    ...LectureShort
    sections {
      title
      content
    }
  }
  ${LECTURE_SHORT_FRAGMENT}
`;