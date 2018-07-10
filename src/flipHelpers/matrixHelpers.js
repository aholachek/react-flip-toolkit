// 3d transforms were causing weird issues in chrome,
// especially when opacity was also being tweened,
// so convert to a 2d matrix
export const convertMatrix3dArrayTo2dArray = matrix => [
  // scale X
  matrix[0],
  matrix[1],
  // scale Y
  matrix[4],
  matrix[5],
  // translation X
  matrix[12],
  // translation Y
  matrix[13]
]

export const convertMatrix2dArrayToString = matrix =>
  `matrix(${[
    matrix[0],
    matrix[1],
    matrix[2],
    matrix[3],
    matrix[4],
    matrix[5]
  ].join(", ")})`
