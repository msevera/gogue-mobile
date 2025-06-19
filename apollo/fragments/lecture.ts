import { gql } from "@apollo/client";

export const LECTURE_SHORT_FRAGMENT = gql`
  fragment LectureShort on Lecture {
    id
    topic
    title    
    userId
    emoji
    creationEvent {
      name
    }    
    sections {     
      title
      hasContent
    }
    audio {
      stream
      wav
      duration      
    }
    metadata {
      id
      notesCount
      playbackTimestamp
    }
    image {
      webp
      color
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
    audio {
      stream
      wav
      duration  
      bars
    }
  }
  ${LECTURE_SHORT_FRAGMENT}
`;