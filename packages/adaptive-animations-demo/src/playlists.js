import BorderColliePrimitive from './assets/border-collie.svg'
import FrenchPrimitive from './assets/french-bulldog.svg'
import OceanPrimitive from './assets/ocean.svg'
import BlackDoodlePrimitive from './assets/black-doodle.svg'
import PugPrimitive from './assets/pug.svg'
import Pug2Primitive from './assets/pug-2.svg'
import HuskyPrimitive from './assets/husky.svg'
import SamoyedPrimitive from './assets/samoyed.svg'

import BorderCollie from './assets/border-collie.jpg'
import French from './assets/french-bulldog.jpg'
import Ocean from './assets/ocean.jpg'
import BlackDoodle from './assets/black-doodle.jpg'
import Pug from './assets/pug.jpg'
import Pug2 from './assets/pug-2.jpg'
import Husky from './assets/husky.jpg'
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
    primitive: BorderColliePrimitive,
    title: 'High Energy',
    id: 1,
    tags: ['hip hop', 'country', 'pop'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  },
  {
    src: Ocean,
    primitive: OceanPrimitive,
    title: 'Summer fun',
    id: 2,
    tags: ['pop', 'broadway', 'rock'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  },

  {
    src: Pug2,
    primitive: Pug2Primitive,
    title: 'Who am I',
    id: 4,
    tags: ['opera', 'polka', 'classical'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  },
  {
    src: BlackDoodle,
    primitive: BlackDoodlePrimitive,
    title: 'Fitness Beats',
    id: 5,
    tags: ['hip hop', 'rock', 'metal'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  },
  {
    src: Husky,
    primitive: HuskyPrimitive,
    title: 'Walk in the Park',
    id: 6,
    tags: ['pop', 'jazz', 'rock'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  },
  {
    src: Samoyed,
    primitive: SamoyedPrimitive,
    title: 'Deep thoughts',
    id: 7,
    tags: ['instrumental', 'new age', 'spa'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  },
  {
    src: French,
    primitive: FrenchPrimitive,
    title: 'Wake Me Up',
    id: 8,
    tags: ['hip hop', 'country', 'r&b'],
    description:
      'Lorem ipsum dolor sit amet, id legere accumsan patrioque quo. Dicant quidam has ex. Cu alia fuisset theophrastus sea.'
  }
]

export default playlists.map(playlist =>
  Object.assign(playlist, { tracks: sampleTracks })
)
