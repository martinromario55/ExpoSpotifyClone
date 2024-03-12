import { View, Text, StyleSheet, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { tracks } from '../../assets/data/tracks'
const track = tracks[0]
import { usePlayerContext } from '../providers/PlayerProvider'
import { useEffect, useState } from 'react'
import { AVPlaybackStatus, Audio } from 'expo-av'
import { Sound } from 'expo-av/build/Audio'
import { gql, useMutation, useQuery } from '@apollo/client'

const insertFavouriteMutation = gql`
  mutation MyMutation($userId: String!, $trackId: String!) {
    insertFavourites(userid: $userId, trackid: $trackId) {
      id
      trackid
      userid
    }
  }
`

const isFavouriteQuery = gql`
  query MyQuery($trackId: String!, $userId: String!) {
    favouritesByTrackidAndUserid(trackid: $trackId, userid: $userId) {
      id
      trackid
      userid
    }
  }
`

const removeFavouriteMutation = gql`
  mutation MyMutation($trackId: String!, $userId: String!) {
    deleteFavourites(trackid: $trackId, userid: $userId) {
      id
    }
  }
`

const Player = () => {
  const { track } = usePlayerContext()
  const [sound, setSound] = useState<Sound>()
  const [isPlaying, setIsPlaying] = useState(false)

  const [insertFavourite] = useMutation(insertFavouriteMutation)
  const [removeFavourite] = useMutation(removeFavouriteMutation)

  const { data, refetch } = useQuery(isFavouriteQuery, {
    variables: { userId: 'martin', trackId: track?.id },
  })
  const isLiked = data?.favouritesByTrackidAndUserid?.length > 0
  // console.log('data', data)
  // console.log('track', track)
  // console.log('liked', isLiked)

  useEffect(() => {
    if (track) {
      playTrack()
      refetch()
    }
  }, [track])

  // Unload the sound when we unmount the component
  useEffect(() => {
    return sound
      ? () => {
          // console.log('UnLoading Sound')
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  const playTrack = async () => {
    // Stop currently playing sound
    if (sound) {
      await sound.unloadAsync()
    }
    // Load the sound
    if (!track?.preview_url) {
      return
    }
    // console.log('Playing:', track.id)
    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: track.preview_url,
    })
    setSound(newSound)
    newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    await newSound.playAsync()
  }

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    // console.log('Status', status)
    if (!status.isLoaded) {
      return
    }
    setIsPlaying(status.isPlaying)
  }

  const onPlayPause = async () => {
    if (!sound) {
      return
    }
    if (isPlaying) {
      await sound.pauseAsync()
    } else {
      await sound.playAsync()
    }
  }

  const onLike = async () => {
    if (!track) {
      console.log('No track')
      return
    }
    if (isLiked) {
      await removeFavourite({
        variables: { trackId: track.id, userId: 'martin' },
      })
    } else {
      await insertFavourite({
        variables: { userId: 'martin', trackId: track.id },
      })
      // console.log('clicked')
      // console.log('liked', isLiked)
    }
    refetch()
  }

  if (!track) {
    return null
  }

  const image = track.album.images?.[0]
  return (
    <View style={styles.container}>
      <View style={styles.player}>
        {image && <Image source={{ uri: image.url }} style={styles.image} />}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{track.name}</Text>
          <Text style={styles.subtitle}>{track.artists[0]?.name}</Text>
        </View>
        <Ionicons
          onPress={() => {
            onLike()
          }}
          name={isLiked ? 'heart' : 'heart-outline'}
          size={20}
          color={'white'}
          style={{ marginHorizontal: 10 }}
        />
        <Ionicons
          onPress={onPlayPause}
          disabled={!track?.preview_url}
          name={isPlaying ? 'pause' : 'play'}
          size={22}
          color={track?.preview_url ? 'white' : 'gray'}
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -75,
    width: '100%',
    height: 75,
    padding: 10,
  },
  player: {
    backgroundColor: '#286660',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    padding: 3,
    paddingRight: 15,
  },
  title: {
    color: 'white',
  },
  subtitle: {
    color: 'lightgray',
    fontSize: 12,
  },
  image: {
    height: '100%',
    aspectRatio: 1,
    marginRight: 10,
    borderRadius: 5,
  },
})
export default Player
