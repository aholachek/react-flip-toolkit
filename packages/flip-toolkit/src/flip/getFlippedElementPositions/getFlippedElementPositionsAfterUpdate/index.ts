import {
  addTupleToObject,
  filterInvisibleElements,
  getAllElements
} from '../utilities'
import { FlippedElementPositionsAfterUpdate } from './types'

const getFlippedElementPositionsAfterUpdate = ({
  element,
  portalKey
}: {
  element: HTMLElement
  portalKey?: string
}): FlippedElementPositionsAfterUpdate => {
  return (
    filterInvisibleElements(getAllElements(element, portalKey))
      .map(([child, childBCR]) => {
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
      })
      // @ts-ignore
      .reduce(addTupleToObject, {})
  )
}

export default getFlippedElementPositionsAfterUpdate
