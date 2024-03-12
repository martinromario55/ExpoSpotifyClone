import { ActivityIndicator, FlatList, StyleSheet } from 'react-native'
import { Text, View } from '@/src/components/Themed'
// import { tracks } from '@/assets/data/tracks'
import TrackListItem from '@/src/components/TrackListItem'
import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react'

const query = gql`
  query MyQuery($userId: String!) {
    favouritesByUserid(userid: $userId) {
      id
      trackid
      userid
      track {
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

export default function FavouritesScreen() {
  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      userId: 'martin',
    },
  })

  if (loading) return <ActivityIndicator />
  if (error) {
    return <Text style={{ color: '#fff' }}>Failed to fetch tracks</Text>
  }

  const tracks = (data?.favouritesByUserid || []).map(fav => fav.track)

  // console.log('favourites', tracks)
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
