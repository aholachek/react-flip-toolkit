import { FunctionComponent, cloneElement, ReactElement } from 'react'
import { DATA_EXIT_CONTAINER } from '../constants'

const ExitContainer: FunctionComponent = ({ children }) => {
  return cloneElement(children as ReactElement<any>, {
    [DATA_EXIT_CONTAINER]: true
  })
}

export default ExitContainer
