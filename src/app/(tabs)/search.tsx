import { FlatList, SafeAreaView, StyleSheet, TextInput } from 'react-native'

import EditScreenInfo from '@/src/components/EditScreenInfo'
import { Text, View } from '@/src/components/Themed'
import { tracks } from '@/assets/data/tracks'
import TrackListItem from '@/src/components/TrackListItem'
import { FontAwesome } from '@expo/vector-icons'
import { useState } from 'react'

export default function TabTwoScreen() {
  const [search, setSearch] = useState('')
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="search" size={16} color={'gray'} />
        <TextInput
          placeholder="Search music..."
          style={styles.input}
          placeholderTextColor={'gray'}
          value={search}
          onChange={setSearch}
        />
        <Text style={{ color: 'gray' }} onPress={() => setSearch('')}>
          Cancel
        </Text>
      </View>
      <FlatList
        data={tracks}
        renderItem={({ item }) => <TrackListItem track={item} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#121314',
    padding: 8,
    marginHorizontal: 10,
    borderRadius: 5,
    color: 'white',
  },
})
