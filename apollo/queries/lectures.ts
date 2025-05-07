import { gql } from "@apollo/client";
import { LECTURE_SHORT_FRAGMENT, LECTURE_FULL_FRAGMENT } from "../fragments/lecture";

export const GET_LECTURES = gql`
  query GetLectures($pagination: PaginationInput) {
    lectures(pagination: $pagination) {
      items {
        ...LectureShort       
      }
    }    
  }
  ${LECTURE_SHORT_FRAGMENT}
`;

export const GET_LECTURE = gql`
  query GetLecture($id: ID!) {
    lecture(id: $id) {
      ...LectureFull
    }
  }
  ${LECTURE_FULL_FRAGMENT}
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
      ...LectureFull
    }
  }
  ${LECTURE_FULL_FRAGMENT}
`;

export const CREATE_LECTURE_ASYNC = gql`
  mutation CreateLectureAsync($input: CreateLectureInput!) {
    createLectureAsync(input: $input)
  }
`;