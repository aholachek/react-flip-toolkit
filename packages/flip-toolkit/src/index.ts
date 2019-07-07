import * as utilities from './utilities'
import * as constants from './constants'
export { default as Flipper } from './Flipper'
import getFlippedElementPositionsBeforeUpdate from './flip/getFlippedElementPositions/getFlippedElementPositionsBeforeUpdate'
import onFlipKeyUpdate from './flip'

// have to do it like this to get types to get exported externally for some dumb reason
export {
  getFlippedElementPositionsBeforeUpdate,
  utilities,
  constants,
  onFlipKeyUpdate
}
