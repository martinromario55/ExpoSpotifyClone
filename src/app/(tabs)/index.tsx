import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { tracks } from '@/assets/data/tracks'
import TrackListItem from '@/src/components/TrackListItem'

const index = () => {
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

export default index

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
})
