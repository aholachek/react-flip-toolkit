export const parseMatrix = matrix =>
  matrix.match(/-?\d+\.?\d*/g).map(parseFloat)

// 3d transforms were causing weird issues in chrome,
// especially when opacity was also being tweened,
// so convert to a 2d matrix
export const convertMatrix3dArrayTo2dString = matrix =>
  `matrix(${[
    matrix[0],
    matrix[1],
    matrix[4],
    matrix[5],
    // translation X
    matrix[12],
    // translation Y
    matrix[13]
  ].join(", ")})`
