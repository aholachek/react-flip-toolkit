import Aussie from './assets/australian-shepard.jpg'
import Corgi from './assets/corgi.jpg'
import Golden from './assets/golden-with-flower.jpg'
import BlackDoodle from './assets/black-doodle.jpg'
import Pug from './assets/pug.jpg'
import Friends from './assets/friends.jpg'
import Samoyed from './assets/samoyed.jpg'

const sampleTracks = [
  {
    name: 'Total Eclipse of the Bark',
    artist: '',
    details: ''
  }
]

const playlists = [
  { src: Aussie, title: 'Happy Afternoon', id: 1 },
  { src: Golden, title: 'Summertime Love', id: 2 },
  { src: BlackDoodle, title: 'Fitness Beats', id: 3 },
  { src: Friends, title: 'Out with the boys', id: 4 },
  { src: Samoyed, title: 'Meditative beats', id: 5 },
  { src: Pug, title: 'Life is pain', id: 6 },
  { src: Corgi, title: 'Party Time', id: 7 }
]

export default playlists.map(playlist =>
  Object.assign(playlist, { tracks: sampleTracks })
)
