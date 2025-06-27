import { gql } from "@apollo/client";
import { LECTURE_DETAILS_FRAGMENT, LECTURE_LIST_ITEM_FRAGMENT, LECTURE_METADATA_FRAGMENT, LECTURE_PREVIEW_FRAGMENT } from "../fragments/lecture";

export const GET_LECTURES = gql`
  query GetLectures($input: FindLecturesInput, $pagination: PaginationInput) {
    lectures(input: $input, pagination: $pagination) {
      items {
        ...LectureListItem       
      }
    }    
  }
  ${LECTURE_LIST_ITEM_FRAGMENT}
`;

export const GET_LECTURES_ADDED_TO_LIBRARY = gql`
  query GetLecturesAddedToLibrary($pagination: PaginationInput) {
    lecturesAddedToLibrary(pagination: $pagination) {
      items {
        ...LectureListItem       
      }
      pageInfo {
        next
      }
    }    
  }
  ${LECTURE_LIST_ITEM_FRAGMENT}
`;

export const GET_LECTURES_RECENTLY_PLAYED = gql`
  query GetLecturesRecentlyPlayed($pagination: PaginationInput) {
    lecturesRecentlyPlayed(pagination: $pagination) {
      items {
        ...LectureListItem       
      }
    }    
  }
  ${LECTURE_LIST_ITEM_FRAGMENT}
`;

export const GET_LECTURE_DETAILS = gql`
  query GetLectureDetails($id: ID!) {
    lecture(id: $id) {
      ...LectureDetails
    }
  }
  ${LECTURE_DETAILS_FRAGMENT}
`;

export const GET_LECTURE_PREVIEW = gql`
  query GetLecturePreview($id: ID!) {
    lecture(id: $id) {
      ...LecturePreview
    }
  }
  ${LECTURE_PREVIEW_FRAGMENT}
`;

export const GET_PENDING_LECTURE = gql`
  query GetPendingLecture {
    pendingLecture {
      ...LectureListItem
    }
  }
  ${LECTURE_LIST_ITEM_FRAGMENT}
`;

export const LECTURE_CREATING_SUBSCRIPTION = gql`
  subscription LectureCreating {
    lectureCreating {
      ...LectureListItem
    }
  }
  ${LECTURE_LIST_ITEM_FRAGMENT}
`;

export const CREATE_LECTURE_ASYNC = gql`
  mutation CreateLectureAsync($input: CreateLectureInput!) {
    createLectureAsync(input: $input)
  }
`;

export const SET_PLAYBACK_TIMESTAMP = gql`
  mutation SetPlaybackTimestamp($id: ID!, $timestamp: Float!) {
    setPlaybackTimestamp(id: $id, timestamp: $timestamp) {
      ...LectureMetadata
    }
  }
  ${LECTURE_METADATA_FRAGMENT}
`;


export const SET_STATUS = gql`
  mutation SetStatus($id: ID!, $status: LectureMetadataStatus!) {
    setStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const ADD_TO_LIBRARY = gql`
  mutation AddToLibrary($id: ID!) {
    addToLibrary(id: $id) {
      ...LectureMetadata
      lecture {
        id
        metadata {
          id
        }
      }
    }
  }
  ${LECTURE_METADATA_FRAGMENT}
`;

export const REMOVE_FROM_LIBRARY = gql`
  mutation RemoveFromLibrary($id: ID!) {
    removeFromLibrary(id: $id) {
      ...LectureMetadata
      lecture {
        id
        metadata {
          id
        }
      }
    }
  }
  ${LECTURE_METADATA_FRAGMENT}
`;


