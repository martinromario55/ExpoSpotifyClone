import { FlatList, StyleSheet } from 'react-native'
import { Text, View } from '@/src/components/Themed'
import { tracks } from '@/assets/data/tracks'
import TrackListItem from '@/src/components/TrackListItem'

export default function FavouritesScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={tracks}
        renderItem={({ item }) => <TrackListItem track={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
})
