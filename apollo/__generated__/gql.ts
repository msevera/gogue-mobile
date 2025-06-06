/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment LectureShort on Lecture {\n    id\n    topic\n    title    \n    userId\n    emoji\n    checkpoint\n    creationEvent {\n      name\n    }\n    sections {     \n      title\n      hasContent\n    }\n    audioPaths {\n      stream\n      wav\n    }\n  }\n": typeof types.LectureShortFragmentDoc,
    "\n  fragment LectureFull on Lecture {\n    ...LectureShort\n    sections {\n      title\n      content\n    }\n    aligners {\n      mfa\n    }\n  }\n  \n": typeof types.LectureFullFragmentDoc,
    "\n  fragment Note on Note {\n    id\n    title\n    timestamp    \n  }\n": typeof types.NoteFragmentDoc,
    "\n  fragment AuthUser on User {\n    id\n    firstName\n    lastName\n    email\n    pfp\n    phone\n    workspaces {\n      workspaceId\n    }\n  }\n": typeof types.AuthUserFragmentDoc,
    "\n  fragment User on User {\n    id\n    firstName\n    lastName    \n    pfp   \n  }\n": typeof types.UserFragmentDoc,
    "\n  query GetLectures($pagination: PaginationInput) {\n    lectures(pagination: $pagination) {\n      items {\n        ...LectureShort       \n      }\n    }    \n  }\n  \n": typeof types.GetLecturesDocument,
    "\n  query GetLecture($id: ID!) {\n    lecture(id: $id) {\n      ...LectureFull\n    }\n  }\n  \n": typeof types.GetLectureDocument,
    "\n  query GetLectureAgent($id: ID!) {\n    lectureAgent(id: $id) {\n      config\n    }\n  }\n": typeof types.GetLectureAgentDocument,
    "\n  subscription LectureCreating {\n    lectureCreating {\n      ...LectureFull\n    }\n  }\n  \n": typeof types.LectureCreatingDocument,
    "\n  mutation CreateLectureAsync($input: CreateLectureInput!) {\n    createLectureAsync(input: $input)\n  }\n": typeof types.CreateLectureAsyncDocument,
    "\n  query GetNotes($lectureId: ID!, $pagination: PaginationInput) {\n    notes(input: { lectureId: $lectureId }, pagination: $pagination) {\n      items {\n        ...Note       \n      }\n    }    \n  }\n  \n": typeof types.GetNotesDocument,
    "\n  query GetNote($id: ID!) {\n    note(id: $id) {\n      ...Note\n    }\n  }\n  \n": typeof types.GetNoteDocument,
    "\n  query GetNoteAgent($id: ID!) {\n    noteAgent(id: $id) {\n      config\n    }\n  }\n": typeof types.GetNoteAgentDocument,
    "\n  subscription NoteCreated($lectureId: ID!) {\n    noteCreated(lectureId: $lectureId) {\n      ...Note\n    }\n  }\n  \n": typeof types.NoteCreatedDocument,
    "\n  query SignIn($idToken: String!) {\n    signIn(input: { idToken: $idToken }) {\n      ...AuthUser\n    }\n  }\n  \n": typeof types.SignInDocument,
    "\n  mutation SetProfile($firstName: String!, $lastName: String!) {\n    setProfile(input: { firstName: $firstName, lastName: $lastName }) {\n      ...AuthUser\n    }\n  }\n  \n": typeof types.SetProfileDocument,
    "\n  query GetUser($id: ID!) {\n    user(id: $id) {\n      ...User\n    }\n  }\n  \n": typeof types.GetUserDocument,
};
const documents: Documents = {
    "\n  fragment LectureShort on Lecture {\n    id\n    topic\n    title    \n    userId\n    emoji\n    checkpoint\n    creationEvent {\n      name\n    }\n    sections {     \n      title\n      hasContent\n    }\n    audioPaths {\n      stream\n      wav\n    }\n  }\n": types.LectureShortFragmentDoc,
    "\n  fragment LectureFull on Lecture {\n    ...LectureShort\n    sections {\n      title\n      content\n    }\n    aligners {\n      mfa\n    }\n  }\n  \n": types.LectureFullFragmentDoc,
    "\n  fragment Note on Note {\n    id\n    title\n    timestamp    \n  }\n": types.NoteFragmentDoc,
    "\n  fragment AuthUser on User {\n    id\n    firstName\n    lastName\n    email\n    pfp\n    phone\n    workspaces {\n      workspaceId\n    }\n  }\n": types.AuthUserFragmentDoc,
    "\n  fragment User on User {\n    id\n    firstName\n    lastName    \n    pfp   \n  }\n": types.UserFragmentDoc,
    "\n  query GetLectures($pagination: PaginationInput) {\n    lectures(pagination: $pagination) {\n      items {\n        ...LectureShort       \n      }\n    }    \n  }\n  \n": types.GetLecturesDocument,
    "\n  query GetLecture($id: ID!) {\n    lecture(id: $id) {\n      ...LectureFull\n    }\n  }\n  \n": types.GetLectureDocument,
    "\n  query GetLectureAgent($id: ID!) {\n    lectureAgent(id: $id) {\n      config\n    }\n  }\n": types.GetLectureAgentDocument,
    "\n  subscription LectureCreating {\n    lectureCreating {\n      ...LectureFull\n    }\n  }\n  \n": types.LectureCreatingDocument,
    "\n  mutation CreateLectureAsync($input: CreateLectureInput!) {\n    createLectureAsync(input: $input)\n  }\n": types.CreateLectureAsyncDocument,
    "\n  query GetNotes($lectureId: ID!, $pagination: PaginationInput) {\n    notes(input: { lectureId: $lectureId }, pagination: $pagination) {\n      items {\n        ...Note       \n      }\n    }    \n  }\n  \n": types.GetNotesDocument,
    "\n  query GetNote($id: ID!) {\n    note(id: $id) {\n      ...Note\n    }\n  }\n  \n": types.GetNoteDocument,
    "\n  query GetNoteAgent($id: ID!) {\n    noteAgent(id: $id) {\n      config\n    }\n  }\n": types.GetNoteAgentDocument,
    "\n  subscription NoteCreated($lectureId: ID!) {\n    noteCreated(lectureId: $lectureId) {\n      ...Note\n    }\n  }\n  \n": types.NoteCreatedDocument,
    "\n  query SignIn($idToken: String!) {\n    signIn(input: { idToken: $idToken }) {\n      ...AuthUser\n    }\n  }\n  \n": types.SignInDocument,
    "\n  mutation SetProfile($firstName: String!, $lastName: String!) {\n    setProfile(input: { firstName: $firstName, lastName: $lastName }) {\n      ...AuthUser\n    }\n  }\n  \n": types.SetProfileDocument,
    "\n  query GetUser($id: ID!) {\n    user(id: $id) {\n      ...User\n    }\n  }\n  \n": types.GetUserDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment LectureShort on Lecture {\n    id\n    topic\n    title    \n    userId\n    emoji\n    checkpoint\n    creationEvent {\n      name\n    }\n    sections {     \n      title\n      hasContent\n    }\n    audioPaths {\n      stream\n      wav\n    }\n  }\n"): (typeof documents)["\n  fragment LectureShort on Lecture {\n    id\n    topic\n    title    \n    userId\n    emoji\n    checkpoint\n    creationEvent {\n      name\n    }\n    sections {     \n      title\n      hasContent\n    }\n    audioPaths {\n      stream\n      wav\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment LectureFull on Lecture {\n    ...LectureShort\n    sections {\n      title\n      content\n    }\n    aligners {\n      mfa\n    }\n  }\n  \n"): (typeof documents)["\n  fragment LectureFull on Lecture {\n    ...LectureShort\n    sections {\n      title\n      content\n    }\n    aligners {\n      mfa\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment Note on Note {\n    id\n    title\n    timestamp    \n  }\n"): (typeof documents)["\n  fragment Note on Note {\n    id\n    title\n    timestamp    \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment AuthUser on User {\n    id\n    firstName\n    lastName\n    email\n    pfp\n    phone\n    workspaces {\n      workspaceId\n    }\n  }\n"): (typeof documents)["\n  fragment AuthUser on User {\n    id\n    firstName\n    lastName\n    email\n    pfp\n    phone\n    workspaces {\n      workspaceId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment User on User {\n    id\n    firstName\n    lastName    \n    pfp   \n  }\n"): (typeof documents)["\n  fragment User on User {\n    id\n    firstName\n    lastName    \n    pfp   \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLectures($pagination: PaginationInput) {\n    lectures(pagination: $pagination) {\n      items {\n        ...LectureShort       \n      }\n    }    \n  }\n  \n"): (typeof documents)["\n  query GetLectures($pagination: PaginationInput) {\n    lectures(pagination: $pagination) {\n      items {\n        ...LectureShort       \n      }\n    }    \n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLecture($id: ID!) {\n    lecture(id: $id) {\n      ...LectureFull\n    }\n  }\n  \n"): (typeof documents)["\n  query GetLecture($id: ID!) {\n    lecture(id: $id) {\n      ...LectureFull\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLectureAgent($id: ID!) {\n    lectureAgent(id: $id) {\n      config\n    }\n  }\n"): (typeof documents)["\n  query GetLectureAgent($id: ID!) {\n    lectureAgent(id: $id) {\n      config\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription LectureCreating {\n    lectureCreating {\n      ...LectureFull\n    }\n  }\n  \n"): (typeof documents)["\n  subscription LectureCreating {\n    lectureCreating {\n      ...LectureFull\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateLectureAsync($input: CreateLectureInput!) {\n    createLectureAsync(input: $input)\n  }\n"): (typeof documents)["\n  mutation CreateLectureAsync($input: CreateLectureInput!) {\n    createLectureAsync(input: $input)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetNotes($lectureId: ID!, $pagination: PaginationInput) {\n    notes(input: { lectureId: $lectureId }, pagination: $pagination) {\n      items {\n        ...Note       \n      }\n    }    \n  }\n  \n"): (typeof documents)["\n  query GetNotes($lectureId: ID!, $pagination: PaginationInput) {\n    notes(input: { lectureId: $lectureId }, pagination: $pagination) {\n      items {\n        ...Note       \n      }\n    }    \n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetNote($id: ID!) {\n    note(id: $id) {\n      ...Note\n    }\n  }\n  \n"): (typeof documents)["\n  query GetNote($id: ID!) {\n    note(id: $id) {\n      ...Note\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetNoteAgent($id: ID!) {\n    noteAgent(id: $id) {\n      config\n    }\n  }\n"): (typeof documents)["\n  query GetNoteAgent($id: ID!) {\n    noteAgent(id: $id) {\n      config\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription NoteCreated($lectureId: ID!) {\n    noteCreated(lectureId: $lectureId) {\n      ...Note\n    }\n  }\n  \n"): (typeof documents)["\n  subscription NoteCreated($lectureId: ID!) {\n    noteCreated(lectureId: $lectureId) {\n      ...Note\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query SignIn($idToken: String!) {\n    signIn(input: { idToken: $idToken }) {\n      ...AuthUser\n    }\n  }\n  \n"): (typeof documents)["\n  query SignIn($idToken: String!) {\n    signIn(input: { idToken: $idToken }) {\n      ...AuthUser\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SetProfile($firstName: String!, $lastName: String!) {\n    setProfile(input: { firstName: $firstName, lastName: $lastName }) {\n      ...AuthUser\n    }\n  }\n  \n"): (typeof documents)["\n  mutation SetProfile($firstName: String!, $lastName: String!) {\n    setProfile(input: { firstName: $firstName, lastName: $lastName }) {\n      ...AuthUser\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUser($id: ID!) {\n    user(id: $id) {\n      ...User\n    }\n  }\n  \n"): (typeof documents)["\n  query GetUser($id: ID!) {\n    user(id: $id) {\n      ...User\n    }\n  }\n  \n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;