import { addTupleToObject, getAllElements } from '../utilities'
import { FlippedElementPositionsAfterUpdate } from './types'

const getFlippedElementPositionsAfterUpdate = ({
  element,
  portalKey
}: {
  element: HTMLElement
  portalKey?: string
}): FlippedElementPositionsAfterUpdate => {
  return (
    getAllElements(element, portalKey)
      .map(child => {
        const computedStyle = window.getComputedStyle(child)
        const rect = child.getBoundingClientRect()
        return [
          child.dataset.flipId,
          {
            rect,
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
