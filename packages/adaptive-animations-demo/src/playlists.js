import Aussie from './assets/australian-shepard.jpg'
import Corgi from './assets/corgi.jpg'
import Golden from './assets/golden-with-flower.jpg'
import BlackDoodle from './assets/black-doodle.jpg'
import Pug from './assets/pug.jpg'
import Friends from './assets/friends.jpg'
import Samoyed from './assets/samoyed.jpg'

const sampleTracks = [
  {
    id: 1,
    title: 'Total Eclipse of the Bark',
    artist: 'Bonnie Tyler',
    details: ''
  },
  {
    id: 2,
    title: 'Hungry like the Wolf',
    artist: 'Duran Duran',
    details: ''
  },
  {
    id: 3,
    title: 'Livin on a Prayer (for some treats)',
    artist: 'Bon Jovi',
    details: ''
  },
  {
    id: 4,
    title: "Don't you (forget about taking me for a walk)",
    artist: 'Simple Minds',
    details: ''
  },
  {
    id: 5,
    title: 'Total Eclipse of the Bark',
    artist: 'Bonnie Tyler',
    details: ''
  },
  {
    id: 6,
    title: 'Hungry like the Wolf',
    artist: 'Duran Duran',
    details: ''
  },
  {
    id: 7,
    title: 'Livin on a Prayer (for some treats)',
    artist: 'Bon Jovi',
    details: ''
  },
  {
    id: 8,
    title: "Don't you (forget about taking me for a walk)",
    artist: 'Simple Minds',
    details: ''
  }
]

const playlists = [
  {
    src: Aussie,
    title: 'Top of the charts',
    id: 1,
    tags: ['hip hop', 'country', 'pop']
  },
  {
    src: Golden,
    title: "I'm in Love",
    id: 2,
    tags: ['pop', 'shoe gaze', 'rock']
  },
  {
    src: BlackDoodle,
    title: 'Fitness Beats',
    id: 3,
    tags: ['hip hop', 'rock', 'metal']
  },
  {
    src: Friends,
    title: 'Out with the boys',
    id: 4,
    tags: ['pop', 'jazz', 'rock']
  },
  {
    src: Samoyed,
    title: 'Deep thoughts',
    id: 5,
    tags: ['instrumental', 'new age']
  },
  { src: Pug, title: 'Life is pain', id: 6, tags: ['ballads', 'grunge'] },
  {
    src: Corgi,
    title: 'Party Time',
    id: 7,
    tags: ['hip hop', 'country', 'r&b']
  }
]

export default playlists.map(playlist =>
  Object.assign(playlist, { tracks: sampleTracks })
)
