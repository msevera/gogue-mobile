import { CreateLectureAsyncMutation, CreateLectureAsyncMutationVariables, Lecture } from '@/apollo/__generated__/graphql';
import { useMutation } from '@apollo/client';
import { CREATE_LECTURE_ASYNC } from '@/apollo/queries/lectures';
import { useGetLectures } from './useGetLectures';

export const useCreateLecture = () => {
  const { updateCreatingLectureCache } = useGetLectures({ skip: true });
  const [createLectureAsyncMut] = useMutation<CreateLectureAsyncMutation, CreateLectureAsyncMutationVariables>(CREATE_LECTURE_ASYNC);

  return {
    createLectureAsyncMut: async (description: string, duration: number) => {
      updateCreatingLectureCache({
        id: 'temp',             
        creationEvent: {
          name: 'INIT'
        },
      } as Lecture)

      await createLectureAsyncMut({
        variables: {
          input: {
            input: description,
            duration
          }
        },       
      });
    }
  };
};
