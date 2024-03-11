import { View, Text, StyleSheet, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { tracks } from '../../assets/data/tracks'
const track = tracks[0]
import { usePlayerContext } from '../providers/PlayerProvider'
import { useEffect, useState } from 'react'
import { AVPlaybackStatus, Audio } from 'expo-av'
import { Sound } from 'expo-av/build/Audio'

const Player = () => {
  const { track } = usePlayerContext()
  const [sound, setSound] = useState<Sound>()
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (track) {
      playTrack()
    }
  }, [track])

  // Unload the sound when we unmount the component
  useEffect(() => {
    return sound
      ? () => {
          console.log('UnLoading Sound')
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
          name={'heart-outline'}
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
