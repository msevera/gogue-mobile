import { View } from 'react-native'

interface ProgressProps {
  total: number
  current: number
}

export const Progress = ({ total, current }: ProgressProps) => {
  console.log('total', total)
  console.log('current', current)
  const progressPercentage = Math.min(Math.max((current / total) * 100, 0), 100)

  return (
    <View className="w-full h-1">
      <View className="w-full h-full bg-white rounded-md overflow-hidden">
        <View 
          className="h-full bg-blue-500 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        />
      </View>
    </View>
  )
}