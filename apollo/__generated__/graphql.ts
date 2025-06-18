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

export type CreateLectureInput = {
  duration: Scalars['Float']['input'];
  input: Scalars['String']['input'];
};

export type CreateNoteInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  lectureId: Scalars['ID']['input'];
  timestamp: Scalars['Float']['input'];
};

export type FindNoteMessagesInput = {
  noteId: Scalars['ID']['input'];
};

export type FindNotesInput = {
  lectureId: Scalars['ID']['input'];
};

export type Image = {
  __typename?: 'Image';
  folder?: Maybe<Scalars['String']['output']>;
  prompt?: Maybe<Scalars['String']['output']>;
  webp?: Maybe<Scalars['String']['output']>;
};

export type Lecture = {
  __typename?: 'Lecture';
  aligners?: Maybe<Aligners>;
  audio?: Maybe<Audio>;
  creationEvent?: Maybe<LectureCreationEvent>;
  duration: Scalars['Float']['output'];
  emoji?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Image>;
  input: Scalars['String']['output'];
  metadata?: Maybe<LectureMetadata>;
  sections: Array<LectureSection>;
  title?: Maybe<Scalars['String']['output']>;
  topic?: Maybe<Scalars['String']['output']>;
  user: User;
  userId: Scalars['ID']['output'];
  workspace: Workspace;
  workspaceId: Scalars['ID']['output'];
};

export type LectureAgent = {
  __typename?: 'LectureAgent';
  config: Scalars['String']['output'];
};

export type LectureCreationEvent = {
  __typename?: 'LectureCreationEvent';
  name: Scalars['String']['output'];
};

export type LectureMetadata = {
  __typename?: 'LectureMetadata';
  id: Scalars['ID']['output'];
  lectureId: Scalars['ID']['output'];
  notesCount: Scalars['Float']['output'];
  playbackTimestamp: Scalars['Float']['output'];
  userId: Scalars['ID']['output'];
  workspace: Workspace;
  workspaceId: Scalars['ID']['output'];
};

export type LectureSection = {
  __typename?: 'LectureSection';
  content?: Maybe<Scalars['String']['output']>;
  hasContent: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type LecturesCursor = {
  __typename?: 'LecturesCursor';
  items: Array<Lecture>;
  pageInfo?: Maybe<PageInfo>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createLectureAsync: Scalars['Boolean']['output'];
  createNote: Note;
  deleteLecture: Scalars['Boolean']['output'];
  deleteNote: Note;
  generateAudio: Scalars['Boolean']['output'];
  setProfile?: Maybe<User>;
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


export type MutationSetProfileArgs = {
  input: SetProfileInput;
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
  lecture?: Maybe<Lecture>;
  lectureAgent: LectureAgent;
  lectures: LecturesCursor;
  note?: Maybe<Note>;
  noteAgent: NoteAgent;
  noteMessages: NoteMessagesCursor;
  notes: NotesCursor;
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

export type SetProfileInput = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
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
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  pfp?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  role: Role;
  workspaces: Array<WorkspaceItem>;
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

export type LectureShortFragment = { __typename?: 'Lecture', id: string, topic?: string | null, title?: string | null, userId: string, emoji?: string | null, creationEvent?: { __typename?: 'LectureCreationEvent', name: string } | null, sections: Array<{ __typename?: 'LectureSection', title: string, hasContent: boolean }>, audio?: { __typename?: 'Audio', stream?: string | null, wav?: string | null, duration?: number | null } | null, metadata?: { __typename?: 'LectureMetadata', id: string, notesCount: number, playbackTimestamp: number } | null, image?: { __typename?: 'Image', webp?: string | null } | null } & { ' $fragmentName'?: 'LectureShortFragment' };

export type LectureFullFragment = (
  { __typename?: 'Lecture', sections: Array<{ __typename?: 'LectureSection', title: string, content?: string | null }>, aligners?: { __typename?: 'Aligners', mfa?: string | null } | null, audio?: { __typename?: 'Audio', stream?: string | null, wav?: string | null, duration?: number | null, bars?: Array<number> | null } | null }
  & { ' $fragmentRefs'?: { 'LectureShortFragment': LectureShortFragment } }
) & { ' $fragmentName'?: 'LectureFullFragment' };

export type NoteFragment = { __typename?: 'Note', id: string, title: string, timestamp: number } & { ' $fragmentName'?: 'NoteFragment' };

export type NoteMessageFragment = { __typename?: 'NoteMessage', id: string, role: string, content: string, timestamp: any } & { ' $fragmentName'?: 'NoteMessageFragment' };

export type AuthUserFragment = { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, pfp?: string | null, phone?: string | null, workspaces: Array<{ __typename?: 'WorkspaceItem', workspaceId: string }> } & { ' $fragmentName'?: 'AuthUserFragment' };

export type UserFragment = { __typename?: 'User', id: string, firstName: string, lastName: string, pfp?: string | null } & { ' $fragmentName'?: 'UserFragment' };

export type GetLecturesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetLecturesQuery = { __typename?: 'Query', lectures: { __typename?: 'LecturesCursor', items: Array<(
      { __typename?: 'Lecture' }
      & { ' $fragmentRefs'?: { 'LectureShortFragment': LectureShortFragment } }
    )> } };

export type GetLectureQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLectureQuery = { __typename?: 'Query', lecture?: (
    { __typename?: 'Lecture' }
    & { ' $fragmentRefs'?: { 'LectureFullFragment': LectureFullFragment } }
  ) | null };

export type GetLectureAgentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLectureAgentQuery = { __typename?: 'Query', lectureAgent: { __typename?: 'LectureAgent', config: string } };

export type LectureCreatingSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type LectureCreatingSubscription = { __typename?: 'Subscription', lectureCreating: (
    { __typename?: 'Lecture' }
    & { ' $fragmentRefs'?: { 'LectureFullFragment': LectureFullFragment } }
  ) };

export type CreateLectureAsyncMutationVariables = Exact<{
  input: CreateLectureInput;
}>;


export type CreateLectureAsyncMutation = { __typename?: 'Mutation', createLectureAsync: boolean };

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

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'UserFragment': UserFragment } }
  ) | null };

export const LectureShortFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureShort"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}}]}}]}}]} as unknown as DocumentNode<LectureShortFragment, unknown>;
export const LectureFullFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureShort"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aligners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfa"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureShort"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}}]}}]}}]} as unknown as DocumentNode<LectureFullFragment, unknown>;
export const NoteFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]} as unknown as DocumentNode<NoteFragment, unknown>;
export const NoteMessageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NoteMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]} as unknown as DocumentNode<NoteMessageFragment, unknown>;
export const AuthUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}}]}}]}}]} as unknown as DocumentNode<AuthUserFragment, unknown>;
export const UserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}}]}}]} as unknown as DocumentNode<UserFragment, unknown>;
export const GetLecturesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLectures"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lectures"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureShort"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureShort"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}}]}}]}}]} as unknown as DocumentNode<GetLecturesQuery, GetLecturesQueryVariables>;
export const GetLectureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLecture"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lecture"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureShort"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureShort"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aligners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfa"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}}]}}]} as unknown as DocumentNode<GetLectureQuery, GetLectureQueryVariables>;
export const GetLectureAgentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLectureAgent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lectureAgent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"config"}}]}}]}}]} as unknown as DocumentNode<GetLectureAgentQuery, GetLectureAgentQueryVariables>;
export const LectureCreatingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"LectureCreating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lectureCreating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureShort"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}},{"kind":"Field","name":{"kind":"Name","value":"playbackTimestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webp"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureShort"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aligners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfa"}}]}},{"kind":"Field","name":{"kind":"Name","value":"audio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stream"}},{"kind":"Field","name":{"kind":"Name","value":"wav"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"bars"}}]}}]}}]} as unknown as DocumentNode<LectureCreatingSubscription, LectureCreatingSubscriptionVariables>;
export const CreateLectureAsyncDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLectureAsync"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLectureInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLectureAsync"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CreateLectureAsyncMutation, CreateLectureAsyncMutationVariables>;
export const GetNoteMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNoteMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noteMessages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"noteId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NoteMessage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NoteMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NoteMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]} as unknown as DocumentNode<GetNoteMessagesQuery, GetNoteMessagesQueryVariables>;
export const GetNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lectureId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"lectureId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lectureId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Note"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]} as unknown as DocumentNode<GetNotesQuery, GetNotesQueryVariables>;
export const GetNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"note"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Note"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]} as unknown as DocumentNode<GetNoteQuery, GetNoteQueryVariables>;
export const GetNoteAgentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNoteAgent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noteAgent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"config"}}]}}]}}]} as unknown as DocumentNode<GetNoteAgentQuery, GetNoteAgentQueryVariables>;
export const CreateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lectureId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"lectureId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lectureId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"timestamp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timestamp"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Note"}},{"kind":"Field","name":{"kind":"Name","value":"lecture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]} as unknown as DocumentNode<CreateNoteMutation, CreateNoteMutationVariables>;
export const NoteCreatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NoteCreated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lectureId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noteCreated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lectureId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lectureId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Note"}},{"kind":"Field","name":{"kind":"Name","value":"lecture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]} as unknown as DocumentNode<NoteCreatedSubscription, NoteCreatedSubscriptionVariables>;
export const DeleteNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lecture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notesCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteNoteMutation, DeleteNoteMutationVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"idToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}}]}}]}}]} as unknown as DocumentNode<SignInQuery, SignInQueryVariables>;
export const SetProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}}]}}]}}]} as unknown as DocumentNode<SetProfileMutation, SetProfileMutationVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;