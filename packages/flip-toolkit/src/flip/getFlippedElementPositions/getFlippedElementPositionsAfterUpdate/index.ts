import { addTupleToObject, getRects, getAllElements } from '../utilities'
import {
  FlippedElementPositionsAfterUpdate,
  FlippedElementPositionDatumAfterUpdate
} from './types'

const getFlippedElementPositionsAfterUpdate = ({
  element,
  portalKey
}: {
  element: HTMLElement
  portalKey?: string
}): FlippedElementPositionsAfterUpdate => {
  const positionArray = getRects(getAllElements(element, portalKey)).map(
    ([child, childBCR]) => {
      const computedStyle = window.getComputedStyle(child)
      return [
        child.dataset.flipId,
        {
          element: child,
          rect: childBCR,
          opacity: parseFloat(computedStyle.opacity!),
          transform: computedStyle.transform
        }
      ]
    }
  ) as [string, FlippedElementPositionDatumAfterUpdate][]

  return positionArray.reduce(addTupleToObject, {})
}

export default getFlippedElementPositionsAfterUpdate
