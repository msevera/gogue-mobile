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
    audioPaths {
      stream
      wav
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
    aligners {
      mfa
    }
  }
  ${LECTURE_SHORT_FRAGMENT}
`;