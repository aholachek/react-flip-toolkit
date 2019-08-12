import { FunctionComponent, cloneElement, ReactElement } from 'react'
import { constants } from '../FlipToolkit'

const ExitContainer: FunctionComponent = ({ children }) => {
  return cloneElement(children as ReactElement<any>, {
    [constants.DATA_EXIT_CONTAINER]: true
  })
}

export default ExitContainer
