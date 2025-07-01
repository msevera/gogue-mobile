import { gql } from "@apollo/client";

export const LECTURE_METADATA_FRAGMENT = gql`
  fragment LectureMetadata on LectureMetadata {
    id
    notesCount
    playbackTimestamp
    status
    addedToLibrary
    addedToLibraryAt
  }
`;

export const LECTURE_LIST_ITEM_FRAGMENT = gql`
  fragment LectureListItem on Lecture {
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
      bars
    }
    metadata {
      ...LectureMetadata
    }
    image {
      webp
      color
    }
    audio {
      duration
    }
  }
  ${LECTURE_METADATA_FRAGMENT}
`;

export const LECTURE_PREVIEW_FRAGMENT = gql`
  fragment LecturePreview on Lecture {
    ...LectureListItem
    overview     
    sections {     
      title
      overview
      annotations {
        title
        url
      }
    }       
    categories {
      category {
        id
        name
      }
    }
  }
  ${LECTURE_LIST_ITEM_FRAGMENT}
`;

export const LECTURE_DETAILS_FRAGMENT = gql`
  fragment LectureDetails on Lecture {
    ...LectureListItem
    sections {
      title
      content
      annotations {
        title
        url
        startIndex
        endIndex
      }
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
  ${LECTURE_LIST_ITEM_FRAGMENT}
`;