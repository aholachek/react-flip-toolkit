import BorderCollie from './assets/border-collie.jpg'
import French from './assets/french-bulldog.jpg'
import Serious from './assets/serious.jpg'
import BlackDoodle from './assets/black-doodle.jpg'
import Pug2 from './assets/pug-2.jpg'
import Pug from './assets/pug.jpg'
import Puppy from './assets/puppy.jpg'
import Samoyed from './assets/samoyed.jpg'
import Corgi from './assets/corgi.jpg'
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
    title: 'Livin on a Prayer (for a walk)',
    artist: 'Bon Jovi',
    details: ''
  },
  {
    id: 4,
    title: "Don't you forget about treats",
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
    title: 'Livin on a Prayer (for a walk)',
    artist: 'Bon Jovi',
    details: ''
  },
  {
    id: 8,
    title: "Don't you forget about treats",
    artist: 'Simple Minds',
    details: ''
  }
]

const playlists = [
  {
    src: BorderCollie,
    title: 'High Energy',
    id: 1,
    tags: ['hip hop', 'country', 'pop'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  },
  {
    src: Serious,
    title: 'Afternoon Mood',
    id: 2,
    tags: ['pop', 'broadway', 'rock'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  },

  {
    src: Corgi,
    title: 'Dreamy Feelings',
    id: 3,
    tags: ['piano', 'ballads', 'instrumental'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  },
  {
    src: Pug,
    title: 'Life is Pain',
    id: 4,
    tags: ['emo', 'gregorian', 'dubstep'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  },

  {
    src: Pug2,
    title: 'Who am I',
    id: 5,
    tags: ['opera', 'polka', 'classical'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  },
  {
    src: BlackDoodle,
    title: 'Fitness Beats',
    id: 6,
    tags: ['hip hop', 'rock', 'metal'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  },
  {
    src: Puppy,
    title: 'Fun in the Sun',
    id: 7,
    tags: ['pop', 'jazz', 'rock'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  },
  {
    src: Samoyed,
    title: 'Deep thoughts',
    id: 8,
    tags: ['instrumental', 'new age', 'spa'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  },
  {
    src: French,
    title: 'Wake Me Up',
    id: 9,
    tags: ['hip hop', 'country', 'r&b'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  }
]

export default playlists.map(playlist =>
  Object.assign(playlist, { tracks: sampleTracks })
)
