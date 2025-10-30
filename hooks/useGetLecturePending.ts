import { GetPendingLectureShowNotificationQuery, GetPendingLectureShowNotificationQueryVariables, Lecture } from '@/apollo/__generated__/graphql';
import { GET_PENDING_LECTURE_SHOW_NOTIFICATION } from '@/apollo/queries/lectures';
import { useApolloClient, useQuery } from '@apollo/client';

export const useGetLecturePending = ({ skip }: { skip?: boolean } = {}) => {
  const apolloClient = useApolloClient();
  const { data: { pendingLectureShowNotification } = { pendingLectureShowNotification: null }, refetch, loading } =
    useQuery<GetPendingLectureShowNotificationQuery, GetPendingLectureShowNotificationQueryVariables>(GET_PENDING_LECTURE_SHOW_NOTIFICATION, {
      fetchPolicy: 'network-only',
      skip,
      onError: (error) => {
        console.log('error', JSON.stringify(error, null, 2))
      },
      onCompleted: (data) => {
        console.log('pending lecture completed');
      }
    });



  const handleCache = (lecture: Lecture) => {
    const updateFn = (data: any) => {

      return {
        ...data,
        pendingLectureShowNotification: {
          ...data.pendingLectureShowNotification,
          ...lecture
        }
      }
    }

    apolloClient.cache.updateQuery<GetPendingLectureShowNotificationQuery, GetPendingLectureShowNotificationQueryVariables>(
      {
        query: GET_PENDING_LECTURE_SHOW_NOTIFICATION,
      },
      (data) => updateFn(data)
    );
  }

  return {
    lecture: pendingLectureShowNotification as Lecture,
    loading,
    refetch,
    handleCache
  }
}