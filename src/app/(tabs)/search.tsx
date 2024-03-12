import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from 'react-native'

import EditScreenInfo from '@/src/components/EditScreenInfo'
import { Text, View } from '@/src/components/Themed'
// import { tracks } from '@/assets/data/tracks'
import TrackListItem from '@/src/components/TrackListItem'
import { FontAwesome } from '@expo/vector-icons'
import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'

const query = gql`
  query MyQuery($q: String!) {
    search(q: $q) {
      tracks {
        items {
          id
          name
          preview_url
          artists {
            id
            name
          }
          album {
            id
            name
            images {
              height
              url
              width
            }
          }
        }
      }
    }
  }
`

export default function TabTwoScreen() {
  const [search, setSearch] = useState('')

  const { data, loading, error } = useQuery(query, {
    variables: {
      q: search,
    },
  })

  const tracks = data?.search?.tracks?.items || []

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="search" size={16} color={'gray'} />
        <TextInput
          placeholder="Search music..."
          style={styles.input}
          placeholderTextColor={'gray'}
          value={search}
          onChangeText={setSearch}
        />
        <Text style={{ color: 'gray' }} onPress={() => setSearch('')}>
          Cancel
        </Text>
      </View>
      {loading && <ActivityIndicator />}
      {error && <Text style={{ color: '#fff' }}>Failed to fetch tracks</Text>}
      {tracks?.length > 0 ? (
        <FlatList
          data={tracks}
          renderItem={({ item }) => <TrackListItem track={item} />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text>List is empty</Text>
      )}
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
    backgroundColor: '#000',
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
