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
};

export type ChatMessage = {
  __typename?: 'ChatMessage';
  content: Scalars['String']['output'];
  id: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type CollaboratorItem = {
  __typename?: 'CollaboratorItem';
  user: User;
  userId: Scalars['ID']['output'];
  workspace: Workspace;
  workspaceId: Scalars['ID']['output'];
};

export type CollaboratorsInvite = {
  __typename?: 'CollaboratorsInvite';
  code: Scalars['String']['output'];
};

export type CreateItemInput = {
  listId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type CreateLectureInput = {
  duration: Scalars['Float']['input'];
  input: Scalars['String']['input'];
};

export type CreateListInput = {
  name: Scalars['String']['input'];
};

export type FindItemsInput = {
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  listId?: InputMaybe<Scalars['ID']['input']>;
};

export type GetListByInviteInput = {
  code: Scalars['String']['input'];
};

export type Item = {
  __typename?: 'Item';
  collaborators: Array<CollaboratorItem>;
  completed: Scalars['Boolean']['output'];
  context?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  list: List;
  listId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  previewMessage?: Maybe<Scalars['String']['output']>;
  user: User;
  userId: Scalars['ID']['output'];
  workspace: Workspace;
  workspaceId: Scalars['ID']['output'];
};

export type ItemChat = {
  __typename?: 'ItemChat';
  actions: Array<ItemChatAction>;
  messages: Array<ChatMessage>;
};

export type ItemChatAction = {
  __typename?: 'ItemChatAction';
  emoji: Scalars['String']['output'];
  prompt: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type ItemChatEvent = {
  __typename?: 'ItemChatEvent';
  message?: Maybe<ItemChatMessage>;
  name: Scalars['String']['output'];
};

export type ItemChatInput = {
  date?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  messageId?: InputMaybe<Scalars['String']['input']>;
};

export type ItemChatMessage = {
  __typename?: 'ItemChatMessage';
  content?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type ItemsCursor = {
  __typename?: 'ItemsCursor';
  items: Array<Item>;
  pageInfo?: Maybe<PageInfo>;
};

export type JoinListByInviteInput = {
  code: Scalars['String']['input'];
};

export type Lecture = {
  __typename?: 'Lecture';
  checkpoint?: Maybe<Scalars['String']['output']>;
  creationEvent?: Maybe<LectureCreationEvent>;
  duration: Scalars['Float']['output'];
  emoji?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  input: Scalars['String']['output'];
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

export type List = {
  __typename?: 'List';
  collaborators: Array<CollaboratorItem>;
  collaboratorsInvite: CollaboratorsInvite;
  context?: Maybe<Scalars['String']['output']>;
  generateSuggestions: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isCollaborator: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  previewItems: Array<PreviewItem>;
  showCompleted: Scalars['Boolean']['output'];
  user: User;
  userId: Scalars['ID']['output'];
  workspace: Workspace;
  workspaceId: Scalars['ID']['output'];
};

export type ListChat = {
  __typename?: 'ListChat';
  messages: Array<ChatMessage>;
};

export type ListSuggestion = {
  __typename?: 'ListSuggestion';
  context: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ListsCursor = {
  __typename?: 'ListsCursor';
  items: Array<List>;
  pageInfo?: Maybe<PageInfo>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createItems?: Maybe<Array<Item>>;
  createLectureAsync: Scalars['Boolean']['output'];
  createList: List;
  deleteItem?: Maybe<Scalars['Boolean']['output']>;
  deleteLecture: Scalars['Boolean']['output'];
  deleteNote: Scalars['Boolean']['output'];
  generateCollaboratorsInvite: List;
  joinList: List;
  sendItemMessage?: Maybe<Scalars['String']['output']>;
  setProfile?: Maybe<User>;
  updateItem?: Maybe<Item>;
  updateList: List;
};


export type MutationCreateItemsArgs = {
  input: Array<CreateItemInput>;
};


export type MutationCreateLectureAsyncArgs = {
  input: CreateLectureInput;
};


export type MutationCreateListArgs = {
  input: CreateListInput;
};


export type MutationDeleteItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLectureArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNoteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationGenerateCollaboratorsInviteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationJoinListArgs = {
  id: Scalars['ID']['input'];
  input: JoinListByInviteInput;
};


export type MutationSendItemMessageArgs = {
  id: Scalars['ID']['input'];
  input: ItemChatInput;
};


export type MutationSetProfileArgs = {
  input: SetProfileInput;
};


export type MutationUpdateItemArgs = {
  id: Scalars['ID']['input'];
  input: UpdateItemInput;
};


export type MutationUpdateListArgs = {
  id: Scalars['ID']['input'];
  input: UpdateListInput;
};

export type Note = {
  __typename?: 'Note';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lecture: Lecture;
  lectureId: Scalars['ID']['output'];
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

export type PreviewItem = {
  __typename?: 'PreviewItem';
  item: Item;
  itemId: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  item?: Maybe<Item>;
  itemChat: ItemChat;
  items: ItemsCursor;
  lecture?: Maybe<Lecture>;
  lectureAgent: LectureAgent;
  lectures: LecturesCursor;
  list?: Maybe<List>;
  listByInvite?: Maybe<List>;
  listChat: ListChat;
  listSuggestions: Array<ListSuggestion>;
  lists: ListsCursor;
  note?: Maybe<Note>;
  noteAgent: NoteAgent;
  notes: NotesCursor;
  signIn?: Maybe<User>;
  user?: Maybe<User>;
};


export type QueryItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryItemChatArgs = {
  itemId: Scalars['ID']['input'];
};


export type QueryItemsArgs = {
  input?: InputMaybe<FindItemsInput>;
  pagination?: InputMaybe<PaginationInput>;
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


export type QueryListArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListByInviteArgs = {
  id: Scalars['ID']['input'];
  input: GetListByInviteInput;
};


export type QueryListChatArgs = {
  listId: Scalars['ID']['input'];
};


export type QueryListSuggestionsArgs = {
  listId: Scalars['ID']['input'];
};


export type QueryListsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryNoteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNoteAgentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNotesArgs = {
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
  itemChatMessageUpdated: ItemChatEvent;
  itemUpdated: Item;
  itemsAdded: Array<Item>;
  lectureCreating: Lecture;
  listUpdated: List;
  noteCreated: Note;
};


export type SubscriptionItemChatMessageUpdatedArgs = {
  itemId: Scalars['ID']['input'];
};


export type SubscriptionItemsAddedArgs = {
  listId: Scalars['ID']['input'];
};

export type UpdateItemInput = {
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateListInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  showCompleted?: InputMaybe<Scalars['Boolean']['input']>;
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

export type LectureShortFragment = { __typename?: 'Lecture', id: string, topic?: string | null, title?: string | null, userId: string, emoji?: string | null, checkpoint?: string | null, creationEvent?: { __typename?: 'LectureCreationEvent', name: string } | null, sections: Array<{ __typename?: 'LectureSection', title: string, hasContent: boolean }> } & { ' $fragmentName'?: 'LectureShortFragment' };

export type LectureFullFragment = (
  { __typename?: 'Lecture', sections: Array<{ __typename?: 'LectureSection', title: string, content?: string | null }> }
  & { ' $fragmentRefs'?: { 'LectureShortFragment': LectureShortFragment } }
) & { ' $fragmentName'?: 'LectureFullFragment' };

export type NoteFragment = { __typename?: 'Note', id: string, title: string, content: string, lecture: { __typename?: 'Lecture', id: string, title?: string | null, emoji?: string | null } } & { ' $fragmentName'?: 'NoteFragment' };

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

export type GetNotesQueryVariables = Exact<{
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

export type NoteCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NoteCreatedSubscription = { __typename?: 'Subscription', noteCreated: (
    { __typename?: 'Note' }
    & { ' $fragmentRefs'?: { 'NoteFragment': NoteFragment } }
  ) };

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

export const LectureShortFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureShort"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"checkpoint"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}}]}}]} as unknown as DocumentNode<LectureShortFragment, unknown>;
export const LectureFullFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureShort"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureShort"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"checkpoint"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}}]}}]} as unknown as DocumentNode<LectureFullFragment, unknown>;
export const NoteFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"lecture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}}]}}]}}]} as unknown as DocumentNode<NoteFragment, unknown>;
export const AuthUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}}]}}]}}]} as unknown as DocumentNode<AuthUserFragment, unknown>;
export const UserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}}]}}]} as unknown as DocumentNode<UserFragment, unknown>;
export const GetLecturesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLectures"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lectures"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureShort"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureShort"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"checkpoint"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}}]}}]} as unknown as DocumentNode<GetLecturesQuery, GetLecturesQueryVariables>;
export const GetLectureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLecture"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lecture"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureShort"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"checkpoint"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureShort"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]} as unknown as DocumentNode<GetLectureQuery, GetLectureQueryVariables>;
export const GetLectureAgentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLectureAgent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lectureAgent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"config"}}]}}]}}]} as unknown as DocumentNode<GetLectureAgentQuery, GetLectureAgentQueryVariables>;
export const LectureCreatingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"LectureCreating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lectureCreating"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureShort"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}},{"kind":"Field","name":{"kind":"Name","value":"checkpoint"}},{"kind":"Field","name":{"kind":"Name","value":"creationEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"hasContent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LectureFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lecture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LectureShort"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]} as unknown as DocumentNode<LectureCreatingSubscription, LectureCreatingSubscriptionVariables>;
export const CreateLectureAsyncDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLectureAsync"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLectureInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLectureAsync"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CreateLectureAsyncMutation, CreateLectureAsyncMutationVariables>;
export const GetNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Note"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"lecture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}}]}}]}}]} as unknown as DocumentNode<GetNotesQuery, GetNotesQueryVariables>;
export const GetNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"note"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Note"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"lecture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}}]}}]}}]} as unknown as DocumentNode<GetNoteQuery, GetNoteQueryVariables>;
export const GetNoteAgentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNoteAgent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noteAgent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"config"}}]}}]}}]} as unknown as DocumentNode<GetNoteAgentQuery, GetNoteAgentQueryVariables>;
export const NoteCreatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NoteCreated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noteCreated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Note"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"lecture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}}]}}]}}]} as unknown as DocumentNode<NoteCreatedSubscription, NoteCreatedSubscriptionVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"idToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}}]}}]}}]} as unknown as DocumentNode<SignInQuery, SignInQueryVariables>;
export const SetProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}}]}}]}}]} as unknown as DocumentNode<SetProfileMutation, SetProfileMutationVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"pfp"}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;