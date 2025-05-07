import { GetNotesQuery, GetNotesQueryVariables, Note } from '@/apollo/__generated__/graphql';
import { SortOrder } from '@/apollo/__generated__/graphql';
import { GET_NOTES } from '@/apollo/queries/notes';
import { useApolloClient, useQuery } from "@apollo/client";

export const useGetNotes = ({ skip }: { skip?: boolean } = {}) => {
  const apolloClient = useApolloClient();

  const { data: { notes: { items = [] } = { items: [] } } = {}, loading: isLoading } = useQuery<GetNotesQuery, GetNotesQueryVariables>(GET_NOTES, {
    variables: {
      pagination: {
        sort: [{
          by: 'createdAt',
          order: SortOrder.Desc
        }]
      }
    },
    skip,
    onError: (error) => {
      console.error('Error fetching notes', error);
    }
  });

  const handleCache = (newNote: Note) => {
    const buildQueryParams = (params?: any) => {
      return {
        ...params,
        pagination: {
          sort: [{
            by: 'createdAt',
            order: SortOrder.Desc
          }]
        }
      }
    }

    const updateFn = (data: any) => {
      return {
        ...data,
        notes: {
          ...data?.notes,
          items: [newNote, ...data?.notes?.items].filter(Boolean)
        }
      }
    }

    apolloClient.cache.updateQuery<GetNotesQuery, GetNotesQueryVariables>(
      {
        query: GET_NOTES,
        variables: buildQueryParams()
      },
      (data) => updateFn(data)
    );
  }

  return {
    items,
    isLoading,
    updateCreateNoteCache: handleCache
  };
};
