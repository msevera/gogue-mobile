/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type Aligners = {
  __typename?: 'Aligners';
  mfa?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
};

export type Audio = {
  __typename?: 'Audio';
  bars?: Maybe<Array<Scalars['Float']['output']>>;
  duration?: Maybe<Scalars['Float']['output']>;
  folder?: Maybe<Scalars['String']['output']>;
  stream?: Maybe<Scalars['String']['output']>;
  wav?: Maybe<Scalars['String']['output']>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nameEmbeddings: Array<Scalars['Float']['output']>;
};

export type CreateLectureInput = {
  duration: Scalars['Float']['input'];
  input: Scalars['String']['input'];
};

export type CreateNoteInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  lectureId: Scalars['ID']['input'];
  timestamp: Scalars['Float']['input'];
};

export type FindLecturesInput = {
  skipUserId?: InputMaybe<Scalars['ID']['input']>;
};

export type FindNoteMessagesInput = {
  noteId: Scalars['ID']['input'];
};

export type FindNotesInput = {
  lectureId: Scalars['ID']['input'];
};

export type Glimpse = {
  __typename?: 'Glimpse';
  annotations?: Maybe<Array<GlimpseAnnotation>>;
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  query?: Maybe<Scalars['String']['output']>;
  topicId: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
  viewed: Scalars['Boolean']['output'];
  workspace: Workspace;
  workspaceId: Scalars['ID']['output'];
};

export type GlimpseAnnotation = {
  __typename?: 'GlimpseAnnotation';
  endIndex: Scalars['Float']['output'];
  startIndex: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type GlimpseStatus = {
  __typename?: 'GlimpseStatus';
  id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
  workspace: Workspace;
  workspaceId: Scalars['ID']['output'];
};

export type GlimpsesCursor = {
  __typename?: 'GlimpsesCursor';
  items: Array<Glimpse>;
  pageInfo?: Maybe<PageInfo>;
};

export type Image = {
  __typename?: 'Image';
  color?: Maybe<Scalars['String']['output']>;
  folder?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  prompt?: Maybe<Scalars['String']['output']>;
  webp?: Maybe<Scalars['String']['output']>;
  width?: Maybe<Scalars['Float']['output']>;
};

export type Lecture = {
  __typename?: 'Lecture';
  aligners?: Maybe<Aligners>;
  audio?: Maybe<Audio>;
  categories?: Maybe<Array<LectureCategory>>;
  creationEvent?: Maybe<LectureCreationEvent>;
  duration: Scalars['Float']['output'];
  emoji?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Image>;
  input: Scalars['String']['output'];
  isPublic: Scalars['Boolean']['output'];
  languageCode?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<LectureMetadata>;
  overview?: Maybe<Scalars['String']['output']>;
  sections: Array<LectureSection>;
  title?: Maybe<Scalars['String']['output']>;
  topic?: Maybe<Scalars['String']['output']>;
  topicEmbeddings?: Maybe<Array<Scalars['Float']['output']>>;
  user: User;
  userId: Scalars['ID']['output'];
  workspace: Workspace;
  workspaceId: Scalars['ID']['output'];
};

export type LectureAgent = {
  __typename?: 'LectureAgent';
  config: Scalars['String']['output'];
};

export type LectureCategory = {
  __typename?: 'LectureCategory';
  category: Category;
  categoryId: Scalars['ID']['output'];
};

export type LectureCreationEvent = {
  __typename?: 'LectureCreationEvent';
  name: Scalars['String']['output'];
};

export type LectureMetadata = {
  __typename?: 'LectureMetadata';
  addedToLibrary: Scalars['Boolean']['output'];
  addedToLibraryAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  lastPlaybackAt?: Maybe<Scalars['DateTime']['output']>;
  lecture: Lecture;
  lectureId: Scalars['ID']['output'];
  notesCount: Scalars['Float']['output'];
  playbackTimestamp: Scalars['Float']['output'];
  status: LectureMetadataStatus;
  userId: Scalars['ID']['output'];
  workspace: Workspace;
  workspaceId: Scalars['ID']['output'];
};

export enum LectureMetadataStatus {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  NotStarted = 'NOT_STARTED'
}

export type LectureSection = {
  __typename?: 'LectureSection';
  annotations?: Maybe<Array<LectureSectionAnnotation>>;
  content?: Maybe<Scalars['String']['output']>;
  hasContent: Scalars['Boolean']['output'];
  overview?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type LectureSectionAnnotation = {
  __typename?: 'LectureSectionAnnotation';
  endIndex: Scalars['Float']['output'];
  startIndex: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type LecturesCursor = {
  __typename?: 'LecturesCursor';
  items: Array<Lecture>;
  pageInfo?: Maybe<PageInfo>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addToLibrary: LectureMetadata;
  createLectureAsync: Scalars['Boolean']['output'];
  createNote: Note;
  deleteLecture: Scalars['Boolean']['output'];
  deleteNote: Note;
  generateAudio: Scalars['Boolean']['output'];
  generateGlimpses: Scalars['Boolean']['output'];
  removeFromLibrary: LectureMetadata;
  removeTopic?: Maybe<User>;
  setGlimpseViewed: Glimpse;
  setPlaybackTimestamp: LectureMetadata;
  setProfile?: Maybe<User>;
  setStatus: LectureMetadata;
  setTimezone?: Maybe<User>;
};


export type MutationAddToLibraryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateLectureAsyncArgs = {
  input: CreateLectureInput;
};


export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};


export type MutationDeleteLectureArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNoteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationGenerateAudioArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveFromLibraryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveTopicArgs = {
  input: SetProfileInput;
};


export type MutationSetGlimpseViewedArgs = {
  input: SetGlimpseViewedInput;
};


export type MutationSetPlaybackTimestampArgs = {
  id: Scalars['ID']['input'];
  timestamp: Scalars['Float']['input'];
};


export type MutationSetProfileArgs = {
  input: SetProfileInput;
};


export type MutationSetStatusArgs = {
  id: Scalars['ID']['input'];
  status: LectureMetadataStatus;
};


export type MutationSetTimezoneArgs = {
  input: SetTimezone;
};

export type Note = {
  __typename?: 'Note';
  id: Scalars['ID']['output'];
  lecture: Lecture;
  lectureId: Scalars['ID']['output'];
  timestamp: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  user: User;
  userId: Scalars['ID']['output'];
  workspace: Workspace;
  workspaceId: Scalars['ID']['output'];
};

export type NoteAgent = {
  __typename?: 'NoteAgent';
  config: Scalars['String']['output'];
};

export type NoteMessage = {
  __typename?: 'NoteMessage';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lecture: Lecture;
  lectureId: Scalars['ID']['output'];
  note: Note;
  noteId: Scalars['ID']['output'];
  role: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['ID']['output'];
  workspace: Workspace;
  workspaceId: Scalars['ID']['output'];
};

export type NoteMessagesCursor = {
  __typename?: 'NoteMessagesCursor';
  items: Array<NoteMessage>;
  pageInfo?: Maybe<PageInfo>;
};

export type NotesCursor = {
  __typename?: 'NotesCursor';
  items: Array<Note>;
  pageInfo?: Maybe<PageInfo>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNext: Scalars['Boolean']['output'];
  hasPrev: Scalars['Boolean']['output'];
  next?: Maybe<Scalars['Float']['output']>;
  prev?: Maybe<Scalars['Float']['output']>;
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  next?: InputMaybe<Scalars['Float']['input']>;
  prev?: InputMaybe<Scalars['Float']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};

export type Query = {
  __typename?: 'Query';
  checkGlimpsesStatus: GlimpseStatus;
  glimpsesLatest: GlimpsesCursor;
  lecture?: Maybe<Lecture>;
  lectureAgent: LectureAgent;
  lectures: LecturesCursor;
  lecturesAddedToLibrary: LecturesCursor;
  lecturesRecentlyPlayed: LecturesCursor;
  lecturesRecommended: LecturesCursor;
  lecturesSearch: LecturesCursor;
  note?: Maybe<Note>;
  noteAgent: NoteAgent;
  noteMessages: NoteMessagesCursor;
  notes: NotesCursor;
  pendingLecture?: Maybe<Lecture>;
  signIn?: Maybe<User>;
  user?: Maybe<User>;
};


export type QueryLectureArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLectureAgentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLecturesArgs = {
  input?: InputMaybe<FindLecturesInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryLecturesAddedToLibraryArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryLecturesRecentlyPlayedArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryLecturesRecommendedArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryLecturesSearchArgs = {
  input?: InputMaybe<SearchLecturesInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryNoteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNoteAgentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNoteMessagesArgs = {
  input: FindNoteMessagesInput;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryNotesArgs = {
  input: FindNotesInput;
  pagination?: InputMaybe<PaginationInput>;
};


export type QuerySignInArgs = {
  input: SignInInput;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export enum Role {
  Admin = 'ADMIN',
  Consumer = 'CONSUMER'
}

export type SearchLecturesInput = {
  query?: InputMaybe<Scalars['String']['input']>;
};

export type SetGlimpseViewedInput = {
  id: Scalars['ID']['input'];
};

export type SetProfileInput = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
};

export type SetTimezone = {
  timezone: Scalars['String']['input'];
};

export type SignInInput = {
  idToken: Scalars['String']['input'];
};

export type SortInput = {
  by: Scalars['String']['input'];
  order: SortOrder;
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Subscription = {
  __typename?: 'Subscription';
  glimpseStatusUpdated: GlimpseStatus;
  lectureCreating: Lecture;
  noteCreated: Note;
};


export type SubscriptionNoteCreatedArgs = {
  lectureId: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  glimpsesJobId?: Maybe<Scalars['String']['output']>;
  glimpsesJobPattern?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  pfp?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  role: Role;
  timezone?: Maybe<Scalars['String']['output']>;
  topics: Array<UserTopic>;
  topicsEmbeddings: Array<Scalars['Float']['output']>;
  workspaces: Array<WorkspaceItem>;
};

export type UserTopic = {
  __typename?: 'UserTopic';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nameId: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type Workspace = {
  __typename?: 'Workspace';
  id: Scalars['ID']['output'];
  name: Scalars['ID']['output'];
  user: User;
  userId: Scalars['ID']['output'];
};

export type WorkspaceItem = {
  __typename?: 'WorkspaceItem';
  workspace: Workspace;
  workspaceId: Scalars['ID']['output'];
};

export type LectureMetadataFragment = { __typename?: 'LectureMetadata', id: string, notesCount: number, playbackTimestamp: number, status: LectureMetadataStatus, addedToLibrary: boolean, addedToLibraryAt?: any | null } & { ' $fragmentName'?: 'LectureMetadataFragment' };

export type LectureListItemFragment = { __typename?: 'Lecture', id: string, topic?: string | null, title?: string | null, userId: string, emoji?: string | null, creationEvent?: { __typename?: 'LectureCreationEvent', name: string } | null, sections: Array<{ __typename?: 'LectureSection', title: string, hasContent: boolean }>, audio?: { __typename?: 'Audio', stream?: string | null, wav?: string | null, duration?: number | null, bars?: Array<number> | null } | null, metadata?: (
    { __typename?: 'LectureMetadata' }
    & { ' $fragmentRefs'?: { 'LectureMetadataFragment': LectureMetadataFragment } }
  ) | null, image?: { __typename?: 'Image', webp?: string | null, color?: string | null } | null } & { ' $fragmentName'?: 'LectureListItemFragment' };

export type LecturePreviewFragment = (
  { __typename?: 'Lecture', overview?: string | null, sections: Array<{ __typename?: 'LectureSection', title: string, overview?: string | null, annotations?: Array<{ __typename?: 'LectureSectionAnnotation', title: string, url: string }> | null }>, categories?: Array<{ __typename?: 'LectureCategory', category: { __typename?: 'Category', id: string, name: string } }> | null }
  & { ' $fragmentRefs'?: { 'LectureListItemFragment': LectureListItemFragment } }
) & { ' $fragmentName'?: 'LecturePreviewFragment' };

export type LectureDetailsFragment = (
  { __typename?: 'Lecture', sections: Array<{ __typename?: 'LectureSection', title: string, content?: string | null, annotations?: Array<{ __typename?: 'LectureSectionAnnotation', title: string, url: string, startIndex: number, endIndex: number }> | null }>, aligners?: { __typename?: 'Aligners', mfa?: string | null } | null, audio?: { __typename?: 'Audio', stream?: string | null, wav?: string | null, duration?: number | null, bars?: Array<number> | null } | null }
  & { ' $fragmentRefs'?: { 'LectureListItemFragment': LectureListItemFragment } }
) & { ' $fragmentName'?: 'LectureDetailsFragment' };

export type NoteFragment = { __typename?: 'Note', id: string, title: string, timestamp: number } & { ' $fragmentName'?: 'NoteFragment' };

export type NoteMessageFragment = { __typename?: 'NoteMessage', id: string, role: string, content: string, timestamp: any } & { ' $fragmentName'?: 'NoteMessageFragment' };

export type AuthUserFragment = { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, pfp?: string | null, phone?: string | null, workspaces: Array<{ __typename?: 'WorkspaceItem', workspaceId: string }>, topics: Array<{ __typename?: 'UserTopic', id: string, name: string }> } & { ' $fragmentName'?: 'AuthUserFragment' };

export type UserFragment = { __typename?: 'User', id: string, firstName: string, lastName: string, pfp?: string | null } & { ' $fragmentName'?: 'UserFragment' };

export type GetGlimpseLatestQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlimpseLatestQuery = { __typename?: 'Query', glimpsesLatest: { __typename?: 'GlimpsesCursor', items: Array<{ __typename?: 'Glimpse', id: string, topicId: string, content: string, query?: string | null, viewed: boolean, annotations?: Array<{ __typename?: 'GlimpseAnnotation', title: string, url: string, startIndex: number, endIndex: number }> | null }>, pageInfo?: { __typename?: 'PageInfo', next?: number | null } | null } };

export type CheckGlimpsesStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckGlimpsesStatusQuery = { __typename?: 'Query', checkGlimpsesStatus: { __typename?: 'GlimpseStatus', id: string, status: string } };

export type GlimpseStatusUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GlimpseStatusUpdatedSubscription = { __typename?: 'Subscription', glimpseStatusUpdated: { __typename?: 'GlimpseStatus', id: string, status: string } };

export type SetGlimpseViewedMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SetGlimpseViewedMutation = { __typename?: 'Mutation', setGlimpseViewed: { __typename?: 'Glimpse', id: string, viewed: boolean } };

export type GetLecturesQueryVariables = Exact<{
  input?: InputMaybe<FindLecturesInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetLecturesQuery = { __typename?: 'Query', lectures: { __typename?: 'LecturesCursor', items: Array<(
      { __typename?: 'Lecture' }
      & { ' $fragmentRefs'?: { 'LectureListItemFragment': LectureListItemFragment } }
    )>, pageInfo?: { __typename?: 'PageInfo', next?: number | null } | null } };

export type GetLecturesSearchQueryVariables = Exact<{
  input?: InputMaybe<SearchLecturesInput>;
}>;


export type GetLecturesSearchQuery = { __typename?: 'Query', lecturesSearch: { __typename?: 'LecturesCursor', items: Array<(
      { __typename?: 'Lecture' }
      & { ' $fragmentRefs'?: { 'LectureListItemFragment': LectureListItemFragment } }
    )> } };

export type GetLecturesAddedToLibraryQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetLecturesAddedToLibraryQuery = { __typename?: 'Query', lecturesAddedToLibrary: { __typename?: 'LecturesCursor', items: Array<(
      { __typename?: 'Lecture' }
      & { ' $fragmentRefs'?: { 'LectureListItemFragment': LectureListItemFragment } }
    )>, pageInfo?: { __typename?: 'PageInfo', next?: number | null } | null } };

export type GetLecturesRecentlyPlayedQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetLecturesRecentlyPlayedQuery = { __typename?: 'Query', lecturesRecentlyPlayed: { __typename?: 'LecturesCursor', items: Array<(
      { __typename?: 'Lecture' }
      & { ' $fragmentRefs'?: { 'LectureListItemFragment': LectureListItemFragment } }
    )> } };

export type GetLecturesRecommendedQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetLecturesRecommendedQuery = { __typename?: 'Query', lecturesRecommended: { __typename?: 'LecturesCursor', items: Array<(
      { __typename?: 'Lecture' }
      & { ' $fragmentRefs'?: { 'LectureListItemFragment': LectureListItemFragment } }
    )> } };

export type GetLectureDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLectureDetailsQuery = { __typename?: 'Query', lecture?: (
    { __typename?: 'Lecture' }
    & { ' $fragmentRefs'?: { 'LectureDetailsFragment': LectureDetailsFragment } }
  ) | null };

export type GetLecturePreviewQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLecturePreviewQuery = { __typename?: 'Query', lecture?: (
    { __typename?: 'Lecture' }
    & { ' $fragmentRefs'?: { 'LecturePreviewFragment': LecturePreviewFragment } }
  ) | null };

export type GetPendingLectureQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPendingLectureQuery = { __typename?: 'Query', pendingLecture?: (
    { __typename?: 'Lecture' }
    & { ' $fragmentRefs'?: { 'LectureListItemFragment': LectureListItemFragment } }
  ) | null };

export type LectureCreatingSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type LectureCreatingSubscription = { __typename?: 'Subscription', lectureCreating: (
    { __typename?: 'Lecture' }
    & { ' $fragmentRefs'?: { 'LectureListItemFragment': LectureListItemFragment } }
  ) };

export type CreateLectureAsyncMutationVariables = Exact<{
  input: CreateLectureInput;
}>;


export type CreateLectureAsyncMutation = { __typename?: 'Mutation', createLectureAsync: boolean };

export type SetPlaybackTimestampMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  timestamp: Scalars['Float']['input'];
}>;


export type SetPlaybackTimestampMutation = { __typename?: 'Mutation', setPlaybackTimestamp: (
    { __typename?: 'LectureMetadata' }
    & { ' $fragmentRefs'?: { 'LectureMetadataFragment': LectureMetadataFragment } }
  ) };

export type SetStatusMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  status: LectureMetadataStatus;
}>;


export type SetStatusMutation = { __typename?: 'Mutation', setStatus: { __typename?: 'LectureMetadata', id: string, status: LectureMetadataStatus } };

export type AddToLibraryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AddToLibraryMutation = { __typename?: 'Mutation', addToLibrary: (
    { __typename?: 'LectureMetadata', lecture: { __typename?: 'Lecture', id: string, metadata?: { __typename?: 'LectureMetadata', id: string } | null } }
    & { ' $fragmentRefs'?: { 'LectureMetadataFragment': LectureMetadataFragment } }
  ) };

export type RemoveFromLibraryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveFromLibraryMutation = { __typename?: 'Mutation', removeFromLibrary: (
    { __typename?: 'LectureMetadata', lecture: { __typename?: 'Lecture', id: string, metadata?: { __typename?: 'LectureMetadata', id: string } | null } }
    & { ' $fragmentRefs'?: { 'LectureMetadataFragment': LectureMetadataFragment } }
  ) };

export type GetNoteMessagesQueryVariables = Exact<{
  noteId: Scalars['ID']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetNoteMessagesQuery = { __typename?: 'Query', noteMessages: { __typename?: 'NoteMessagesCursor', items: Array<(
      { __typename?: 'NoteMessage' }
      & { ' $fragmentRefs'?: { 'NoteMessageFragment': NoteMessageFragment } }
    )>, pageInfo?: { __typename?: 'PageInfo', next?: number | null } | null } };

export type GetNotesQueryVariables = Exact<{
  lectureId: Scalars['ID']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetNotesQuery = { __typename?: 'Query', notes: { __typename?: 'NotesCursor', items: Array<(
      { __typename?: 'Note' }
      & { ' $fragmentRefs'?: { 'NoteFragment': NoteFragment } }
    )> } };

export type GetNoteQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetNoteQuery = { __typename?: 'Query', note?: (
    { __typename?: 'Note' }
    & { ' $fragmentRefs'?: { 'NoteFragment': NoteFragment } }
  ) | null };

export type GetNoteAgentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetNoteAgentQuery = { __typename?: 'Query', noteAgent: { __typename?: 'NoteAgent', config: string } };

export type CreateNoteMutationVariables = Exact<{
  lectureId: Scalars['ID']['input'];
  timestamp: Scalars['Float']['input'];
}>;


export type CreateNoteMutation = { __typename?: 'Mutation', createNote: (
    { __typename?: 'Note', lecture: { __typename?: 'Lecture', id: string, metadata?: { __typename?: 'LectureMetadata', id: string, notesCount: number } | null } }
    & { ' $fragmentRefs'?: { 'NoteFragment': NoteFragment } }
  ) };

export type NoteCreatedSubscriptionVariables = Exact<{
  lectureId: Scalars['ID']['input'];
}>;


export type NoteCreatedSubscription = { __typename?: 'Subscription', noteCreated: (
    { __typename?: 'Note', lecture: { __typename?: 'Lecture', id: string, metadata?: { __typename?: 'LectureMetadata', id: string, notesCount: number } | null } }
    & { ' $fragmentRefs'?: { 'NoteFragment': NoteFragment } }
  ) };

export type DeleteNoteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteNoteMutation = { __typename?: 'Mutation', deleteNote: { __typename?: 'Note', id: string, lecture: { __typename?: 'Lecture', id: string, metadata?: { __typename?: 'LectureMetadata', id: string, notesCount: number } | null } } };

export type SignInQueryVariables = Exact<{
  idToken: Scalars['String']['input'];
}>;


export type SignInQuery = { __typename?: 'Query', signIn?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'AuthUserFragment': AuthUserFragment } }
  ) | null };

export type SetProfileMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
}>;


export type SetProfileMutation = { __typename?: 'Mutation', setProfile?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'AuthUserFragment': AuthUserFragment } }
  ) | null };

export type SetTimezoneMutationVariables = Exact<{
  timezone: Scalars['String']['input'];
}>;


export type SetTimezoneMutation = { __typename?: 'Mutation', setTimezone?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'AuthUserFragment': AuthUserFragment } }
  ) | null };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'AuthUserFragment': AuthUserFragment } }
  ) | null };

export const LectureMetadataFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}}]} as unknown as DocumentNode<LectureMetadataFragment, unknown>;
export const LectureListItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureMetadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}}]} as unknown as DocumentNode<LectureListItemFragment, unknown>;
export const LecturePreviewFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LecturePreview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureListItem"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"annotations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureMetadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<LecturePreviewFragment, unknown>;
export const LectureDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureListItem"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"annotations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"aligners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfa"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureMetadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<LectureDetailsFragment, unknown>;
export const NoteFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]} as unknown as DocumentNode<NoteFragment, unknown>;
export const NoteMessageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NoteMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]} as unknown as DocumentNode<NoteMessageFragment, unknown>;
export const AuthUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AuthUserFragment, unknown>;
export const UserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}}]}}]} as unknown as DocumentNode<UserFragment, unknown>;
export const GetGlimpseLatestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGlimpseLatest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"glimpsesLatest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topicId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"query"}},{"kind":"Field","name":{"kind":"Name","value":"viewed"}},{"kind":"Field","name":{"kind":"Name","value":"annotations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}}]}}]}}]}}]} as unknown as DocumentNode<GetGlimpseLatestQuery, GetGlimpseLatestQueryVariables>;
export const CheckGlimpsesStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckGlimpsesStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkGlimpsesStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CheckGlimpsesStatusQuery, CheckGlimpsesStatusQueryVariables>;
export const GlimpseStatusUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"GlimpseStatusUpdated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"glimpseStatusUpdated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GlimpseStatusUpdatedSubscription, GlimpseStatusUpdatedSubscriptionVariables>;
export const SetGlimpseViewedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetGlimpseViewed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setGlimpseViewed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"viewed"}}]}}]}}]} as unknown as DocumentNode<SetGlimpseViewedMutation, SetGlimpseViewedMutationVariables>;
export const GetLecturesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLectures"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FindLecturesInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lectures"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureListItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureMetadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<GetLecturesQuery, GetLecturesQueryVariables>;
export const GetLecturesSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLecturesSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchLecturesInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lecturesSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureListItem"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureMetadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<GetLecturesSearchQuery, GetLecturesSearchQueryVariables>;
export const GetLecturesAddedToLibraryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLecturesAddedToLibrary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lecturesAddedToLibrary"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureListItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureMetadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<GetLecturesAddedToLibraryQuery, GetLecturesAddedToLibraryQueryVariables>;
export const GetLecturesRecentlyPlayedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLecturesRecentlyPlayed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lecturesRecentlyPlayed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureListItem"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureMetadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<GetLecturesRecentlyPlayedQuery, GetLecturesRecentlyPlayedQueryVariables>;
export const GetLecturesRecommendedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLecturesRecommended"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lecturesRecommended"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureListItem"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureMetadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<GetLecturesRecommendedQuery, GetLecturesRecommendedQueryVariables>;
export const GetLectureDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLectureDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lecture"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureDetails"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureMetadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureListItem"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"annotations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"aligners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfa"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}}]}}]} as unknown as DocumentNode<GetLectureDetailsQuery, GetLectureDetailsQueryVariables>;
export const GetLecturePreviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLecturePreview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lecture"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LecturePreview"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureMetadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LecturePreview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureListItem"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"annotations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetLecturePreviewQuery, GetLecturePreviewQueryVariables>;
export const GetPendingLectureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPendingLecture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pendingLecture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureMetadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<GetPendingLectureQuery, GetPendingLectureQueryVariables>;
export const LectureCreatingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"LectureCreating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lectureCreating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureListItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureListItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureMetadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<LectureCreatingSubscription, LectureCreatingSubscriptionVariables>;
export const CreateLectureAsyncDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLectureAsync"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLectureInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLectureAsync"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CreateLectureAsyncMutation, CreateLectureAsyncMutationVariables>;
export const SetPlaybackTimestampDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetPlaybackTimestamp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setPlaybackTimestamp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"timestamp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timestamp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureMetadata"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}}]} as unknown as DocumentNode<SetPlaybackTimestampMutation, SetPlaybackTimestampMutationVariables>;
export const SetStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadataStatus"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<SetStatusMutation, SetStatusMutationVariables>;
export const AddToLibraryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddToLibrary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addToLibrary"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureMetadata"}},{"kind":"Field","name":{"kind":"Name","value":"lecture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}}]} as unknown as DocumentNode<AddToLibraryMutation, AddToLibraryMutationVariables>;
export const RemoveFromLibraryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveFromLibrary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeFromLibrary"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureMetadata"}},{"kind":"Field","name":{"kind":"Name","value":"lecture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureMetadata"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LectureMetadata"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibrary"}},{"kind":"Field","name":{"kind":"Name","value":"addedToLibraryAt"}}]}}]} as unknown as DocumentNode<RemoveFromLibraryMutation, RemoveFromLibraryMutationVariables>;
export const GetNoteMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNoteMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noteMessages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"noteId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteMessage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NoteMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]} as unknown as DocumentNode<GetNoteMessagesQuery, GetNoteMessagesQueryVariables>;
export const GetNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lectureId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"lectureId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lectureId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Note"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]} as unknown as DocumentNode<GetNotesQuery, GetNotesQueryVariables>;
export const GetNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"note"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Note"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]} as unknown as DocumentNode<GetNoteQuery, GetNoteQueryVariables>;
export const GetNoteAgentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNoteAgent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noteAgent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"config"}}]}}]}}]} as unknown as DocumentNode<GetNoteAgentQuery, GetNoteAgentQueryVariables>;
export const CreateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lectureId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"lectureId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lectureId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"timestamp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timestamp"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Note"}},{"kind":"Field","name":{"kind":"Name","value":"lecture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]} as unknown as DocumentNode<CreateNoteMutation, CreateNoteMutationVariables>;
export const NoteCreatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NoteCreated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lectureId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noteCreated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lectureId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lectureId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Note"}},{"kind":"Field","name":{"kind":"Name","value":"lecture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]} as unknown as DocumentNode<NoteCreatedSubscription, NoteCreatedSubscriptionVariables>;
export const DeleteNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lecture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteNoteMutation, DeleteNoteMutationVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"idToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SignInQuery, SignInQueryVariables>;
export const SetProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SetProfileMutation, SetProfileMutationVariables>;
export const SetTimezoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetTimezone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timezone"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setTimezone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"timezone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timezone"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SetTimezoneMutation, SetTimezoneMutationVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;