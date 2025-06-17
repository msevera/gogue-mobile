import { GetNotesQuery, GetNotesQueryVariables, Note } from '@/apollo/__generated__/graphql';
import { SortOrder } from '@/apollo/__generated__/graphql';
import { GET_NOTES } from '@/apollo/queries/notes';
import { useApolloClient, useQuery } from "@apollo/client";

export const useGetNotes = ({ lectureId }: { lectureId: string }) => {
  const apolloClient = useApolloClient();

  const pagination = {
    sort: [{
      by: 'timestamp',
      order: SortOrder.Asc
    }]
  }

  const { data: { notes: { items = [] } = { items: [] } } = {}, loading: isLoading } = useQuery<GetNotesQuery, GetNotesQueryVariables>(GET_NOTES, {
    variables: {
      lectureId,
      pagination
    },
    skip: !lectureId,
    onError: (error) => {
      console.error('Error fetching notes', error);
    }
  });

  const handleAddCache = (newNote: Note) => {
    const buildQueryParams = (params?: any) => {
      return {
        ...params,
        lectureId,
        pagination
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

  const handleDeleteCache = (id: string) => {
    const buildQueryParams = (params?: any) => {
      return {
        ...params,
        lectureId,
        pagination
      }
    }

    const updateFn = (data: any) => {
      return {
        ...data,
        notes: {
          ...data?.notes,
          items: data?.notes?.items?.filter((item: Note) => item.id !== id)
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
    updateCreateNoteCache: handleAddCache,
    updateDeleteNoteCache: handleDeleteCache
  };
};
