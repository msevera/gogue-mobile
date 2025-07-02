import { cn } from '@/lib/utils'
import { View } from 'react-native'

interface ProgressProps {
  total: number
  current: number
  className?: string
}

export const Progress = ({ total, current, className }: ProgressProps) => {  
  const progressPercentage = Math.min(Math.max((current / total) * 100, 0), 100)

  return (
    <View className="w-full h-1">
      <View className={cn("w-full h-full bg-white rounded-md overflow-hidden", className)}>
        <View 
          className="h-full bg-blue-500 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        />
      </View>
    </View>
  )
}