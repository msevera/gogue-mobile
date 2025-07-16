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
    "\n  fragment LectureMetadata on LectureMetadata {\n    id\n    notesCount\n    playbackTimestamp\n    status\n    addedToLibrary\n    addedToLibraryAt\n  }\n": typeof types.LectureMetadataFragmentDoc,
    "\n  fragment LectureListItem on Lecture {\n    id\n    topic\n    title    \n    userId\n    emoji\n    creationEvent {\n      name\n    }    \n    sections {     \n      title\n      hasContent\n    }\n    audio {\n      stream\n      wav\n      duration      \n      bars\n    }\n    metadata {\n      ...LectureMetadata\n    }\n    image {\n      webp\n      color\n    }\n    audio {\n      duration\n    }\n  }\n  \n": typeof types.LectureListItemFragmentDoc,
    "\n  fragment LecturePreview on Lecture {\n    ...LectureListItem\n    overview     \n    sections {     \n      title\n      overview\n      annotations {\n        title\n        url\n      }\n    }       \n    categories {\n      category {\n        id\n        name\n      }\n    }\n  }\n  \n": typeof types.LecturePreviewFragmentDoc,
    "\n  fragment LectureDetails on Lecture {\n    ...LectureListItem\n    sections {\n      title\n      content\n      annotations {\n        title\n        url\n        startIndex\n        endIndex\n      }\n    }\n    aligners {\n      mfa\n    }\n    audio {\n      stream\n      wav\n      duration  \n      bars\n    }\n  }\n  \n": typeof types.LectureDetailsFragmentDoc,
    "\n  fragment Note on Note {\n    id\n    title\n    timestamp    \n  }\n": typeof types.NoteFragmentDoc,
    "\n  fragment NoteMessage on NoteMessage {\n    id\n    role\n    content\n    timestamp\n  }\n": typeof types.NoteMessageFragmentDoc,
    "\n  fragment AuthUser on User {\n    id\n    firstName\n    lastName\n    email\n    pfp\n    phone\n    workspaces {\n      workspaceId\n    }\n    topics {\n      id\n      name\n    }\n  }\n": typeof types.AuthUserFragmentDoc,
    "\n  fragment User on User {\n    id\n    firstName\n    lastName    \n    pfp   \n  }\n": typeof types.UserFragmentDoc,
    "\n  query GetGlimpseLatest {\n    glimpsesLatest {\n      items {\n       id\n       topicId\n       content\n       query\n       viewed      \n       annotations {\n        title\n        url\n        startIndex\n        endIndex\n       }\n      }\n      pageInfo {\n        next\n      }\n    }    \n  }\n": typeof types.GetGlimpseLatestDocument,
    "\n  query CheckGlimpsesStatus {\n    checkGlimpsesStatus {\n      id\n      status\n    }    \n  }\n": typeof types.CheckGlimpsesStatusDocument,
    "\n  subscription GlimpseStatusUpdated {\n    glimpseStatusUpdated {\n      id\n      status\n    }\n  }\n": typeof types.GlimpseStatusUpdatedDocument,
    "\n  mutation SetGlimpseViewed($id: ID!) {\n    setGlimpseViewed(input: { id: $id }) {\n      id\n      viewed\n    }\n  }\n": typeof types.SetGlimpseViewedDocument,
    "\n  query GetLectures($input: FindLecturesInput, $pagination: PaginationInput) {\n    lectures(input: $input, pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n      pageInfo {\n        next\n      }\n    }    \n  }\n  \n": typeof types.GetLecturesDocument,
    "\n  query GetLecturesSearch($input: SearchLecturesInput) {\n    lecturesSearch(input: $input) {\n      items {\n        ...LectureListItem       \n      }      \n    }    \n  }\n  \n": typeof types.GetLecturesSearchDocument,
    "\n  query GetLecturesAddedToLibrary($pagination: PaginationInput) {\n    lecturesAddedToLibrary(pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n      pageInfo {\n        next\n      }\n    }    \n  }\n  \n": typeof types.GetLecturesAddedToLibraryDocument,
    "\n  query GetLecturesRecentlyPlayed($pagination: PaginationInput) {\n    lecturesRecentlyPlayed(pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n    }    \n  }\n  \n": typeof types.GetLecturesRecentlyPlayedDocument,
    "\n  query GetLecturesRecommended($pagination: PaginationInput) {\n    lecturesRecommended(pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n    }    \n  }\n  \n": typeof types.GetLecturesRecommendedDocument,
    "\n  query GetLectureDetails($id: ID!) {\n    lecture(id: $id) {\n      ...LectureDetails\n    }\n  }\n  \n": typeof types.GetLectureDetailsDocument,
    "\n  query GetLecturePreview($id: ID!) {\n    lecture(id: $id) {\n      ...LecturePreview\n    }\n  }\n  \n": typeof types.GetLecturePreviewDocument,
    "\n  query GetPendingLecture {\n    pendingLecture {\n      ...LectureListItem\n    }\n  }\n  \n": typeof types.GetPendingLectureDocument,
    "\n  subscription LectureCreating {\n    lectureCreating {\n      ...LectureListItem\n    }\n  }\n  \n": typeof types.LectureCreatingDocument,
    "\n  mutation CreateLectureAsync($input: CreateLectureInput!) {\n    createLectureAsync(input: $input)\n  }\n": typeof types.CreateLectureAsyncDocument,
    "\n  mutation SetPlaybackTimestamp($id: ID!, $timestamp: Float!) {\n    setPlaybackTimestamp(id: $id, timestamp: $timestamp) {\n      ...LectureMetadata\n    }\n  }\n  \n": typeof types.SetPlaybackTimestampDocument,
    "\n  mutation SetStatus($id: ID!, $status: LectureMetadataStatus!) {\n    setStatus(id: $id, status: $status) {\n      id\n      status\n    }\n  }\n": typeof types.SetStatusDocument,
    "\n  mutation AddToLibrary($id: ID!) {\n    addToLibrary(id: $id) {\n      ...LectureMetadata\n      lecture {\n        id\n        metadata {\n          id\n        }\n      }\n    }\n  }\n  \n": typeof types.AddToLibraryDocument,
    "\n  mutation RemoveFromLibrary($id: ID!) {\n    removeFromLibrary(id: $id) {\n      ...LectureMetadata\n      lecture {\n        id\n        metadata {\n          id\n        }\n      }\n    }\n  }\n  \n": typeof types.RemoveFromLibraryDocument,
    "\n  query GetNoteMessages($noteId: ID!, $pagination: PaginationInput) {\n    noteMessages(input: { noteId: $noteId }, pagination: $pagination) {\n      items {\n        ...NoteMessage       \n      },\n      pageInfo {\n        next\n      }\n    }    \n  }\n  \n": typeof types.GetNoteMessagesDocument,
    "\n  query GetNotes($lectureId: ID!, $pagination: PaginationInput) {\n    notes(input: { lectureId: $lectureId }, pagination: $pagination) {\n      items {\n        ...Note       \n      }\n    }    \n  }\n  \n": typeof types.GetNotesDocument,
    "\n  query GetNote($id: ID!) {\n    note(id: $id) {\n      ...Note\n    }\n  }\n  \n": typeof types.GetNoteDocument,
    "\n  query GetNoteAgent($id: ID!) {\n    noteAgent(id: $id) {\n      config\n    }\n  }\n": typeof types.GetNoteAgentDocument,
    "\n  mutation CreateNote($lectureId: ID!, $timestamp: Float!) {\n    createNote(input: { lectureId: $lectureId, timestamp: $timestamp }) {\n      ...Note\n      lecture {\n        id\n        metadata {\n          id\n          notesCount\n        }\n      }\n    }\n  }\n  \n": typeof types.CreateNoteDocument,
    "\n  subscription NoteCreated($lectureId: ID!) {\n    noteCreated(lectureId: $lectureId) {\n      ...Note\n      lecture {\n        id\n        metadata {\n          id\n          notesCount\n        }\n      }\n    }\n  }\n  \n": typeof types.NoteCreatedDocument,
    "\n  mutation DeleteNote($id: ID!) {\n    deleteNote(id: $id) {\n      id\n      lecture {\n        id\n        metadata {\n          id\n          notesCount\n        }\n      }\n    }\n  }\n": typeof types.DeleteNoteDocument,
    "\n  query SignIn($idToken: String!) {\n    signIn(input: { idToken: $idToken }) {\n      ...AuthUser\n    }\n  }\n  \n": typeof types.SignInDocument,
    "\n  mutation SetProfile($firstName: String!, $lastName: String!) {\n    setProfile(input: { firstName: $firstName, lastName: $lastName }) {\n      ...AuthUser\n    }\n  }\n  \n": typeof types.SetProfileDocument,
    "\n  mutation SetTimezone($timezone: String!) {\n    setTimezone(input: { timezone: $timezone }) {\n      ...AuthUser\n    }\n  }\n  \n": typeof types.SetTimezoneDocument,
    "\n  query GetUser($id: ID!) {\n    user(id: $id) {\n      ...AuthUser\n    }\n  }\n  \n": typeof types.GetUserDocument,
};
const documents: Documents = {
    "\n  fragment LectureMetadata on LectureMetadata {\n    id\n    notesCount\n    playbackTimestamp\n    status\n    addedToLibrary\n    addedToLibraryAt\n  }\n": types.LectureMetadataFragmentDoc,
    "\n  fragment LectureListItem on Lecture {\n    id\n    topic\n    title    \n    userId\n    emoji\n    creationEvent {\n      name\n    }    \n    sections {     \n      title\n      hasContent\n    }\n    audio {\n      stream\n      wav\n      duration      \n      bars\n    }\n    metadata {\n      ...LectureMetadata\n    }\n    image {\n      webp\n      color\n    }\n    audio {\n      duration\n    }\n  }\n  \n": types.LectureListItemFragmentDoc,
    "\n  fragment LecturePreview on Lecture {\n    ...LectureListItem\n    overview     \n    sections {     \n      title\n      overview\n      annotations {\n        title\n        url\n      }\n    }       \n    categories {\n      category {\n        id\n        name\n      }\n    }\n  }\n  \n": types.LecturePreviewFragmentDoc,
    "\n  fragment LectureDetails on Lecture {\n    ...LectureListItem\n    sections {\n      title\n      content\n      annotations {\n        title\n        url\n        startIndex\n        endIndex\n      }\n    }\n    aligners {\n      mfa\n    }\n    audio {\n      stream\n      wav\n      duration  \n      bars\n    }\n  }\n  \n": types.LectureDetailsFragmentDoc,
    "\n  fragment Note on Note {\n    id\n    title\n    timestamp    \n  }\n": types.NoteFragmentDoc,
    "\n  fragment NoteMessage on NoteMessage {\n    id\n    role\n    content\n    timestamp\n  }\n": types.NoteMessageFragmentDoc,
    "\n  fragment AuthUser on User {\n    id\n    firstName\n    lastName\n    email\n    pfp\n    phone\n    workspaces {\n      workspaceId\n    }\n    topics {\n      id\n      name\n    }\n  }\n": types.AuthUserFragmentDoc,
    "\n  fragment User on User {\n    id\n    firstName\n    lastName    \n    pfp   \n  }\n": types.UserFragmentDoc,
    "\n  query GetGlimpseLatest {\n    glimpsesLatest {\n      items {\n       id\n       topicId\n       content\n       query\n       viewed      \n       annotations {\n        title\n        url\n        startIndex\n        endIndex\n       }\n      }\n      pageInfo {\n        next\n      }\n    }    \n  }\n": types.GetGlimpseLatestDocument,
    "\n  query CheckGlimpsesStatus {\n    checkGlimpsesStatus {\n      id\n      status\n    }    \n  }\n": types.CheckGlimpsesStatusDocument,
    "\n  subscription GlimpseStatusUpdated {\n    glimpseStatusUpdated {\n      id\n      status\n    }\n  }\n": types.GlimpseStatusUpdatedDocument,
    "\n  mutation SetGlimpseViewed($id: ID!) {\n    setGlimpseViewed(input: { id: $id }) {\n      id\n      viewed\n    }\n  }\n": types.SetGlimpseViewedDocument,
    "\n  query GetLectures($input: FindLecturesInput, $pagination: PaginationInput) {\n    lectures(input: $input, pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n      pageInfo {\n        next\n      }\n    }    \n  }\n  \n": types.GetLecturesDocument,
    "\n  query GetLecturesSearch($input: SearchLecturesInput) {\n    lecturesSearch(input: $input) {\n      items {\n        ...LectureListItem       \n      }      \n    }    \n  }\n  \n": types.GetLecturesSearchDocument,
    "\n  query GetLecturesAddedToLibrary($pagination: PaginationInput) {\n    lecturesAddedToLibrary(pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n      pageInfo {\n        next\n      }\n    }    \n  }\n  \n": types.GetLecturesAddedToLibraryDocument,
    "\n  query GetLecturesRecentlyPlayed($pagination: PaginationInput) {\n    lecturesRecentlyPlayed(pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n    }    \n  }\n  \n": types.GetLecturesRecentlyPlayedDocument,
    "\n  query GetLecturesRecommended($pagination: PaginationInput) {\n    lecturesRecommended(pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n    }    \n  }\n  \n": types.GetLecturesRecommendedDocument,
    "\n  query GetLectureDetails($id: ID!) {\n    lecture(id: $id) {\n      ...LectureDetails\n    }\n  }\n  \n": types.GetLectureDetailsDocument,
    "\n  query GetLecturePreview($id: ID!) {\n    lecture(id: $id) {\n      ...LecturePreview\n    }\n  }\n  \n": types.GetLecturePreviewDocument,
    "\n  query GetPendingLecture {\n    pendingLecture {\n      ...LectureListItem\n    }\n  }\n  \n": types.GetPendingLectureDocument,
    "\n  subscription LectureCreating {\n    lectureCreating {\n      ...LectureListItem\n    }\n  }\n  \n": types.LectureCreatingDocument,
    "\n  mutation CreateLectureAsync($input: CreateLectureInput!) {\n    createLectureAsync(input: $input)\n  }\n": types.CreateLectureAsyncDocument,
    "\n  mutation SetPlaybackTimestamp($id: ID!, $timestamp: Float!) {\n    setPlaybackTimestamp(id: $id, timestamp: $timestamp) {\n      ...LectureMetadata\n    }\n  }\n  \n": types.SetPlaybackTimestampDocument,
    "\n  mutation SetStatus($id: ID!, $status: LectureMetadataStatus!) {\n    setStatus(id: $id, status: $status) {\n      id\n      status\n    }\n  }\n": types.SetStatusDocument,
    "\n  mutation AddToLibrary($id: ID!) {\n    addToLibrary(id: $id) {\n      ...LectureMetadata\n      lecture {\n        id\n        metadata {\n          id\n        }\n      }\n    }\n  }\n  \n": types.AddToLibraryDocument,
    "\n  mutation RemoveFromLibrary($id: ID!) {\n    removeFromLibrary(id: $id) {\n      ...LectureMetadata\n      lecture {\n        id\n        metadata {\n          id\n        }\n      }\n    }\n  }\n  \n": types.RemoveFromLibraryDocument,
    "\n  query GetNoteMessages($noteId: ID!, $pagination: PaginationInput) {\n    noteMessages(input: { noteId: $noteId }, pagination: $pagination) {\n      items {\n        ...NoteMessage       \n      },\n      pageInfo {\n        next\n      }\n    }    \n  }\n  \n": types.GetNoteMessagesDocument,
    "\n  query GetNotes($lectureId: ID!, $pagination: PaginationInput) {\n    notes(input: { lectureId: $lectureId }, pagination: $pagination) {\n      items {\n        ...Note       \n      }\n    }    \n  }\n  \n": types.GetNotesDocument,
    "\n  query GetNote($id: ID!) {\n    note(id: $id) {\n      ...Note\n    }\n  }\n  \n": types.GetNoteDocument,
    "\n  query GetNoteAgent($id: ID!) {\n    noteAgent(id: $id) {\n      config\n    }\n  }\n": types.GetNoteAgentDocument,
    "\n  mutation CreateNote($lectureId: ID!, $timestamp: Float!) {\n    createNote(input: { lectureId: $lectureId, timestamp: $timestamp }) {\n      ...Note\n      lecture {\n        id\n        metadata {\n          id\n          notesCount\n        }\n      }\n    }\n  }\n  \n": types.CreateNoteDocument,
    "\n  subscription NoteCreated($lectureId: ID!) {\n    noteCreated(lectureId: $lectureId) {\n      ...Note\n      lecture {\n        id\n        metadata {\n          id\n          notesCount\n        }\n      }\n    }\n  }\n  \n": types.NoteCreatedDocument,
    "\n  mutation DeleteNote($id: ID!) {\n    deleteNote(id: $id) {\n      id\n      lecture {\n        id\n        metadata {\n          id\n          notesCount\n        }\n      }\n    }\n  }\n": types.DeleteNoteDocument,
    "\n  query SignIn($idToken: String!) {\n    signIn(input: { idToken: $idToken }) {\n      ...AuthUser\n    }\n  }\n  \n": types.SignInDocument,
    "\n  mutation SetProfile($firstName: String!, $lastName: String!) {\n    setProfile(input: { firstName: $firstName, lastName: $lastName }) {\n      ...AuthUser\n    }\n  }\n  \n": types.SetProfileDocument,
    "\n  mutation SetTimezone($timezone: String!) {\n    setTimezone(input: { timezone: $timezone }) {\n      ...AuthUser\n    }\n  }\n  \n": types.SetTimezoneDocument,
    "\n  query GetUser($id: ID!) {\n    user(id: $id) {\n      ...AuthUser\n    }\n  }\n  \n": types.GetUserDocument,
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
export function gql(source: "\n  fragment LectureMetadata on LectureMetadata {\n    id\n    notesCount\n    playbackTimestamp\n    status\n    addedToLibrary\n    addedToLibraryAt\n  }\n"): (typeof documents)["\n  fragment LectureMetadata on LectureMetadata {\n    id\n    notesCount\n    playbackTimestamp\n    status\n    addedToLibrary\n    addedToLibraryAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment LectureListItem on Lecture {\n    id\n    topic\n    title    \n    userId\n    emoji\n    creationEvent {\n      name\n    }    \n    sections {     \n      title\n      hasContent\n    }\n    audio {\n      stream\n      wav\n      duration      \n      bars\n    }\n    metadata {\n      ...LectureMetadata\n    }\n    image {\n      webp\n      color\n    }\n    audio {\n      duration\n    }\n  }\n  \n"): (typeof documents)["\n  fragment LectureListItem on Lecture {\n    id\n    topic\n    title    \n    userId\n    emoji\n    creationEvent {\n      name\n    }    \n    sections {     \n      title\n      hasContent\n    }\n    audio {\n      stream\n      wav\n      duration      \n      bars\n    }\n    metadata {\n      ...LectureMetadata\n    }\n    image {\n      webp\n      color\n    }\n    audio {\n      duration\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment LecturePreview on Lecture {\n    ...LectureListItem\n    overview     \n    sections {     \n      title\n      overview\n      annotations {\n        title\n        url\n      }\n    }       \n    categories {\n      category {\n        id\n        name\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  fragment LecturePreview on Lecture {\n    ...LectureListItem\n    overview     \n    sections {     \n      title\n      overview\n      annotations {\n        title\n        url\n      }\n    }       \n    categories {\n      category {\n        id\n        name\n      }\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment LectureDetails on Lecture {\n    ...LectureListItem\n    sections {\n      title\n      content\n      annotations {\n        title\n        url\n        startIndex\n        endIndex\n      }\n    }\n    aligners {\n      mfa\n    }\n    audio {\n      stream\n      wav\n      duration  \n      bars\n    }\n  }\n  \n"): (typeof documents)["\n  fragment LectureDetails on Lecture {\n    ...LectureListItem\n    sections {\n      title\n      content\n      annotations {\n        title\n        url\n        startIndex\n        endIndex\n      }\n    }\n    aligners {\n      mfa\n    }\n    audio {\n      stream\n      wav\n      duration  \n      bars\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment Note on Note {\n    id\n    title\n    timestamp    \n  }\n"): (typeof documents)["\n  fragment Note on Note {\n    id\n    title\n    timestamp    \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment NoteMessage on NoteMessage {\n    id\n    role\n    content\n    timestamp\n  }\n"): (typeof documents)["\n  fragment NoteMessage on NoteMessage {\n    id\n    role\n    content\n    timestamp\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment AuthUser on User {\n    id\n    firstName\n    lastName\n    email\n    pfp\n    phone\n    workspaces {\n      workspaceId\n    }\n    topics {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment AuthUser on User {\n    id\n    firstName\n    lastName\n    email\n    pfp\n    phone\n    workspaces {\n      workspaceId\n    }\n    topics {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment User on User {\n    id\n    firstName\n    lastName    \n    pfp   \n  }\n"): (typeof documents)["\n  fragment User on User {\n    id\n    firstName\n    lastName    \n    pfp   \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetGlimpseLatest {\n    glimpsesLatest {\n      items {\n       id\n       topicId\n       content\n       query\n       viewed      \n       annotations {\n        title\n        url\n        startIndex\n        endIndex\n       }\n      }\n      pageInfo {\n        next\n      }\n    }    \n  }\n"): (typeof documents)["\n  query GetGlimpseLatest {\n    glimpsesLatest {\n      items {\n       id\n       topicId\n       content\n       query\n       viewed      \n       annotations {\n        title\n        url\n        startIndex\n        endIndex\n       }\n      }\n      pageInfo {\n        next\n      }\n    }    \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query CheckGlimpsesStatus {\n    checkGlimpsesStatus {\n      id\n      status\n    }    \n  }\n"): (typeof documents)["\n  query CheckGlimpsesStatus {\n    checkGlimpsesStatus {\n      id\n      status\n    }    \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription GlimpseStatusUpdated {\n    glimpseStatusUpdated {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  subscription GlimpseStatusUpdated {\n    glimpseStatusUpdated {\n      id\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SetGlimpseViewed($id: ID!) {\n    setGlimpseViewed(input: { id: $id }) {\n      id\n      viewed\n    }\n  }\n"): (typeof documents)["\n  mutation SetGlimpseViewed($id: ID!) {\n    setGlimpseViewed(input: { id: $id }) {\n      id\n      viewed\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLectures($input: FindLecturesInput, $pagination: PaginationInput) {\n    lectures(input: $input, pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n      pageInfo {\n        next\n      }\n    }    \n  }\n  \n"): (typeof documents)["\n  query GetLectures($input: FindLecturesInput, $pagination: PaginationInput) {\n    lectures(input: $input, pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n      pageInfo {\n        next\n      }\n    }    \n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLecturesSearch($input: SearchLecturesInput) {\n    lecturesSearch(input: $input) {\n      items {\n        ...LectureListItem       \n      }      \n    }    \n  }\n  \n"): (typeof documents)["\n  query GetLecturesSearch($input: SearchLecturesInput) {\n    lecturesSearch(input: $input) {\n      items {\n        ...LectureListItem       \n      }      \n    }    \n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLecturesAddedToLibrary($pagination: PaginationInput) {\n    lecturesAddedToLibrary(pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n      pageInfo {\n        next\n      }\n    }    \n  }\n  \n"): (typeof documents)["\n  query GetLecturesAddedToLibrary($pagination: PaginationInput) {\n    lecturesAddedToLibrary(pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n      pageInfo {\n        next\n      }\n    }    \n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLecturesRecentlyPlayed($pagination: PaginationInput) {\n    lecturesRecentlyPlayed(pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n    }    \n  }\n  \n"): (typeof documents)["\n  query GetLecturesRecentlyPlayed($pagination: PaginationInput) {\n    lecturesRecentlyPlayed(pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n    }    \n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLecturesRecommended($pagination: PaginationInput) {\n    lecturesRecommended(pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n    }    \n  }\n  \n"): (typeof documents)["\n  query GetLecturesRecommended($pagination: PaginationInput) {\n    lecturesRecommended(pagination: $pagination) {\n      items {\n        ...LectureListItem       \n      }\n    }    \n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLectureDetails($id: ID!) {\n    lecture(id: $id) {\n      ...LectureDetails\n    }\n  }\n  \n"): (typeof documents)["\n  query GetLectureDetails($id: ID!) {\n    lecture(id: $id) {\n      ...LectureDetails\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetLecturePreview($id: ID!) {\n    lecture(id: $id) {\n      ...LecturePreview\n    }\n  }\n  \n"): (typeof documents)["\n  query GetLecturePreview($id: ID!) {\n    lecture(id: $id) {\n      ...LecturePreview\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPendingLecture {\n    pendingLecture {\n      ...LectureListItem\n    }\n  }\n  \n"): (typeof documents)["\n  query GetPendingLecture {\n    pendingLecture {\n      ...LectureListItem\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription LectureCreating {\n    lectureCreating {\n      ...LectureListItem\n    }\n  }\n  \n"): (typeof documents)["\n  subscription LectureCreating {\n    lectureCreating {\n      ...LectureListItem\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateLectureAsync($input: CreateLectureInput!) {\n    createLectureAsync(input: $input)\n  }\n"): (typeof documents)["\n  mutation CreateLectureAsync($input: CreateLectureInput!) {\n    createLectureAsync(input: $input)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SetPlaybackTimestamp($id: ID!, $timestamp: Float!) {\n    setPlaybackTimestamp(id: $id, timestamp: $timestamp) {\n      ...LectureMetadata\n    }\n  }\n  \n"): (typeof documents)["\n  mutation SetPlaybackTimestamp($id: ID!, $timestamp: Float!) {\n    setPlaybackTimestamp(id: $id, timestamp: $timestamp) {\n      ...LectureMetadata\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SetStatus($id: ID!, $status: LectureMetadataStatus!) {\n    setStatus(id: $id, status: $status) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation SetStatus($id: ID!, $status: LectureMetadataStatus!) {\n    setStatus(id: $id, status: $status) {\n      id\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddToLibrary($id: ID!) {\n    addToLibrary(id: $id) {\n      ...LectureMetadata\n      lecture {\n        id\n        metadata {\n          id\n        }\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation AddToLibrary($id: ID!) {\n    addToLibrary(id: $id) {\n      ...LectureMetadata\n      lecture {\n        id\n        metadata {\n          id\n        }\n      }\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveFromLibrary($id: ID!) {\n    removeFromLibrary(id: $id) {\n      ...LectureMetadata\n      lecture {\n        id\n        metadata {\n          id\n        }\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation RemoveFromLibrary($id: ID!) {\n    removeFromLibrary(id: $id) {\n      ...LectureMetadata\n      lecture {\n        id\n        metadata {\n          id\n        }\n      }\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetNoteMessages($noteId: ID!, $pagination: PaginationInput) {\n    noteMessages(input: { noteId: $noteId }, pagination: $pagination) {\n      items {\n        ...NoteMessage       \n      },\n      pageInfo {\n        next\n      }\n    }    \n  }\n  \n"): (typeof documents)["\n  query GetNoteMessages($noteId: ID!, $pagination: PaginationInput) {\n    noteMessages(input: { noteId: $noteId }, pagination: $pagination) {\n      items {\n        ...NoteMessage       \n      },\n      pageInfo {\n        next\n      }\n    }    \n  }\n  \n"];
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
export function gql(source: "\n  mutation CreateNote($lectureId: ID!, $timestamp: Float!) {\n    createNote(input: { lectureId: $lectureId, timestamp: $timestamp }) {\n      ...Note\n      lecture {\n        id\n        metadata {\n          id\n          notesCount\n        }\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation CreateNote($lectureId: ID!, $timestamp: Float!) {\n    createNote(input: { lectureId: $lectureId, timestamp: $timestamp }) {\n      ...Note\n      lecture {\n        id\n        metadata {\n          id\n          notesCount\n        }\n      }\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription NoteCreated($lectureId: ID!) {\n    noteCreated(lectureId: $lectureId) {\n      ...Note\n      lecture {\n        id\n        metadata {\n          id\n          notesCount\n        }\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  subscription NoteCreated($lectureId: ID!) {\n    noteCreated(lectureId: $lectureId) {\n      ...Note\n      lecture {\n        id\n        metadata {\n          id\n          notesCount\n        }\n      }\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteNote($id: ID!) {\n    deleteNote(id: $id) {\n      id\n      lecture {\n        id\n        metadata {\n          id\n          notesCount\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteNote($id: ID!) {\n    deleteNote(id: $id) {\n      id\n      lecture {\n        id\n        metadata {\n          id\n          notesCount\n        }\n      }\n    }\n  }\n"];
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
export function gql(source: "\n  mutation SetTimezone($timezone: String!) {\n    setTimezone(input: { timezone: $timezone }) {\n      ...AuthUser\n    }\n  }\n  \n"): (typeof documents)["\n  mutation SetTimezone($timezone: String!) {\n    setTimezone(input: { timezone: $timezone }) {\n      ...AuthUser\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUser($id: ID!) {\n    user(id: $id) {\n      ...AuthUser\n    }\n  }\n  \n"): (typeof documents)["\n  query GetUser($id: ID!) {\n    user(id: $id) {\n      ...AuthUser\n    }\n  }\n  \n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;