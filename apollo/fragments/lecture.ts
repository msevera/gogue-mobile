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
    slug
    topic
    title    
    userId
    emoji
    creationEvent {
      name
      showNotification
    }   
    research {     
      title
      hasContent
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
    research {     
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
    source {
      id    
      title        
      image {
        url
        color
        width
        height
      }   
      overview
      topic   
      authors      
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