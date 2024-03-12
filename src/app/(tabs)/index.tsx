import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import React from 'react'
// import { tracks } from '@/assets/data/tracks'
import TrackListItem from '@/src/components/TrackListItem'
import { gql, useQuery } from '@apollo/client'

const query = gql`
  query MyQuery($genres: String!) {
    recommendations(seed_genres: $genres) {
      tracks {
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
`

const HomeScreen = () => {
  const { data, loading, error } = useQuery(query, {
    variables: {
      genres: 'pop',
    },
  })
  if (loading) return <ActivityIndicator />
  if (error)
    return (
      <Text style={{ color: '#fff' }}>Failed to fetch recommendations</Text>
    )

  // console.log('data', data)
  const tracks = data?.recommendations?.tracks || []
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

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
})
