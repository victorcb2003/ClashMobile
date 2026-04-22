import { Image, Text, View } from 'react-native'

const BASE_URL = 'https://clashofleagues.fr'

const SIZES = {
  xs: { wh: 32,  font: 12 },
  sm: { wh: 48,  font: 18 },
  md: { wh: 64,  font: 24 },
  lg: { wh: 96,  font: 36 },
  xl: { wh: 150, font: 54 },
}

export default function Avatar({ user, equipe, size = 'md', style }) {
  const s = SIZES[size] || SIZES.md

  const circle = {
    width: s.wh, height: s.wh, borderRadius: s.wh / 2,
    backgroundColor: '#4338ca',
    alignItems: 'center', justifyContent: 'center',
    ...style,
  }
  const imgStyle = { width: s.wh, height: s.wh, borderRadius: s.wh / 2, ...style }

  if (!user && equipe?.img_url) {
    return <Image source={{ uri: BASE_URL + equipe.img_url }} style={imgStyle} />
  }

  if (!user) {
    const initials = `${equipe?.nom?.[0] || ''}${equipe?.nom?.[1] || ''}`
    return <View style={circle}><Text style={{ color: '#fff', fontWeight: '800', fontSize: s.font }}>{initials}</Text></View>
  }

  if (user?.img_url) {
    return <Image source={{ uri: BASE_URL + user.img_url }} style={imgStyle} />
  }

  const initials = `${user?.prenom?.[0] || ''}${user?.nom?.[0] || ''}`
  return <View style={circle}><Text style={{ color: '#fff', fontWeight: '800', fontSize: s.font }}>{initials}</Text></View>
}
