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
    id: '1',
    title: 'Total Eclipse of the Bork',
    artist: 'Bonnie Tyler',
    details: ''
  },
  {
    id: '2',
    title: 'Hungry like the Wolf',
    artist: 'Duran Duran',
    details: ''
  },
  {
    id: '3',
    title: 'Livin on a Prayer (for a walk)',
    artist: 'Bon Jovi',
    details: ''
  },
  {
    id: '4',
    title: "Don't you forget about treats",
    artist: 'Simple Minds',
    details: ''
  },
  {
    id: '5',
    title: 'Total Eclipse of the Bork',
    artist: 'Bonnie Tyler',
    details: ''
  },
  {
    id: '6',
    title: 'Hungry like the Wolf',
    artist: 'Duran Duran',
    details: ''
  },
  {
    id: '7',
    title: 'Livin on a Prayer (for a walk)',
    artist: 'Bon Jovi',
    details: ''
  },
  {
    id: '8',
    title: "Don't you forget about treats",
    artist: 'Simple Minds',
    details: ''
  }
]

const playlists = [
  {
    src: BorderCollie,
    title: 'High Energy',
    id: '1',
    tags: ['hip hop', 'country', 'pop'],
    description:
      'Time to up the energy with a mix that will amp you up for your next game of fetch.'
  },
  {
    src: Serious,
    title: 'Afternoon Mood',
    id: '2',
    tags: ['pop', 'broadway', 'rock'],
    description:
      'It\'ts 3 hours until dinner, so try to keep the mood positive by listening to these pick-me-up hits'
  },

  {
    src: Corgi,
    title: 'Dreamy Feelings',
    id: '3',
    tags: ['piano', 'ballads', 'instrumental'],
    description:
      'Can\'t get that intriguing shnauzer you met at the dog park out of your head? This romantic playlist is for you.'
  },
  {
    src: Pug,
    title: 'Life is Pain',
    id: '4',
    tags: ['emo', 'gregorian', 'dubstep'],
    description:
      'Everyone\'s eating dinner but all you get is dog food. Revel in the misery of it all with these bangers.'
  },

  {
    src: Pug2,
    title: 'Who am I',
    id: '5',
    tags: ['opera', 'polka', 'classical'],
    description:
      'Old-style songs to remind you of your wolf ancestors whenever life gets you down.'
  },
  {
    src: BlackDoodle,
    title: 'Fitness Beats',
    id: '6',
    tags: ['hip hop', 'rock', 'metal'],
    description:
      'Time to get out and burn some cals with the help of some funky tunes.'
  },
  {
    src: Puppy,
    title: 'Fun in the Sun',
    id: '7',
    tags: ['pop', 'jazz', 'rock'],
    description:
      'When life is good, put on these tunes to help keep the party going strong.'
  },
  {
    src: Samoyed,
    title: 'Deep thoughts',
    id: '8',
    tags: ['instrumental', 'new age', 'spa'],
    description:
      'Bliss out to this calming playlist of low-key ambient music.'
  },
  {
    src: French,
    title: 'Wake Me Up',
    id: '9',
    tags: ['hip hop', 'country', 'r&b'],
    description:
      'You want to nap, but it\'ts time to get up and go for your morning walk. These songs will help you get there.'
  }
]

export default playlists.map(playlist =>
  Object.assign(playlist, { tracks: sampleTracks })
)
