import { cloneElement, ReactElement, ReactNode } from 'react'
import { constants } from 'flip-toolkit'

const ExitContainer = ({ children }: { children: ReactNode }) => {
  return cloneElement(children as ReactElement<any>, {
    [constants.DATA_EXIT_CONTAINER]: true
  })
}

export default ExitContainer
