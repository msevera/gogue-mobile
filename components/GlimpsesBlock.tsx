import { ActivityIndicator, Pressable, View } from 'react-native';
import { Text } from './ui/Text';
import { Button } from './ui/Button';
import { router } from 'expo-router';
import { useCheckGlimpsesStatus } from '@/hooks/useCheckGlimpsesStatus';
import { cn } from '@/lib/utils';
import { useGetGlimpsesLatest } from '@/hooks/useGetGlimpsesLatest';
import { useSubscription } from '@apollo/client';
import { GLIMPSE_STATUS_UPDATED_SUBSCRIPTION } from '@/apollo/queries/glimpses';
import { GlimpseStatusUpdatedSubscription, GlimpseStatusUpdatedSubscriptionVariables } from '@/apollo/__generated__/graphql';

export const GlimpsesBlock = () => {
  const { items, refetch, isLoading } = useGetGlimpsesLatest();
  const { glimpsesStatus } = useCheckGlimpsesStatus();

  useSubscription<GlimpseStatusUpdatedSubscription, GlimpseStatusUpdatedSubscriptionVariables>(GLIMPSE_STATUS_UPDATED_SUBSCRIPTION, {
    onData: ({ data }) => {
      console.log('glimpse status updated', data?.data?.glimpseStatusUpdated);
      refetch();
    }
  });

  const status = glimpsesStatus?.status;
  const noGlimpses = status === 'NOT_READY' || (items.length === 0 && !isLoading);
  const newGlimpses = status === 'NEW';

  return (
    <Pressable
      className='px-4 mb-5'
      onPress={() => {
        if (noGlimpses) {
          return;
        }

        router.push('/glimpses');
      }}
    >
      <View className={cn('flex-row items-center justify-between bg-blue-200 p-4 px-5 rounded-3xl', noGlimpses && 'opacity-40')}>
        <View>
          <Text className='text-blue-500 text-xl font-semibold'>Smarter in 5 minutes</Text>
          <View className='flex-row items-center mt-0.5'>
            {
              newGlimpses && (
                <View className='bg-blue-500 rounded-full px-2 mr-1.5'>
                  <Text className='text-blue-100 text-sm'>
                    New
                  </Text>
                </View>
              )
            }
            <Text className='text-blue-500 text-sm'>
              {noGlimpses ? '' : 'Personalized glimpses'}
            </Text>
          </View>
        </View>
        <Button
          sm
          secondary
          className='w-[50px] h-[50px]'
          icon={{
            component: 'Ionicons',
            name: 'play',
            size: 24,
            className: 'left-[2]',
          }}
          onPress={() => {
            router.push('/glimpses');
          }}
          loaderColor='#374151'
          loaderClassName='top-[1]'
        />
      </View>
      {
        noGlimpses && (
          <View className='mt-0.5 absolute bottom-4 px-4 left-5 flex-row'>
            <ActivityIndicator size="small" color="#3b82f6" style={{
              transform: [{ scale: 0.7 }],
              marginRight: 5
            }} />
            <Text className='text-blue-500 text-sm'>
              {noGlimpses ? 'Preparing glimpses...' : 'Personalized glimpses'}
            </Text>
          </View>
        )
      }
    </Pressable>
  );
};