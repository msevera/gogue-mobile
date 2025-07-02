import { CreateLectureAsyncMutation, CreateLectureAsyncMutationVariables } from '@/apollo/__generated__/graphql';
import { useMutation } from '@apollo/client';
import { CREATE_LECTURE_ASYNC } from '@/apollo/queries/lectures';

export const useCreateLecture = () => {
  const [createLectureAsyncMut] = useMutation<CreateLectureAsyncMutation, CreateLectureAsyncMutationVariables>(CREATE_LECTURE_ASYNC, {
    onError: (error) => {
      console.log('createLectureAsyncMut error', error)
    }
  });

  return {
    createLectureAsyncMut: async (description: string, duration: number) => {
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
