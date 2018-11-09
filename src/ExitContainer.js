import React, { cloneElement } from "react"
import { DATA_EXIT_CONTAINER } from "./constants"

const ExitContainer = ({ children }) => {
  return cloneElement(children, { [DATA_EXIT_CONTAINER]: true })
}

export default ExitContainer
