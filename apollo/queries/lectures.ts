import { gql } from "@apollo/client";
import { LECTURE_DETAILS_FRAGMENT, LECTURE_LIST_ITEM_FRAGMENT, LECTURE_PREVIEW_FRAGMENT } from "../fragments/lecture";

export const GET_LECTURES = gql`
  query GetLectures($pagination: PaginationInput) {
    lectures(pagination: $pagination) {
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

export const GET_LECTURE_AGENT = gql`
  query GetLectureAgent($id: ID!) {
    lectureAgent(id: $id) {
      config
    }
  }
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