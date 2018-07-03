import {
  parseMatrix,
  convertMatrix3dArrayTo2dString
} from "../src/flipHelpers/matrixHelpers"

describe("parseMatrix", () => {
  it("correctly parses matrix values", () => {
    expect(
      parseMatrix(
        "matrix(0.2215909090909091, 0, 0, 0.5113636363636364, 376, 267.28125)"
      )
    ).toEqual([0.2215909090909091, 0, 0, 0.5113636363636364, 376, 267.28125])
  })

  it("can handle negative numbers", () => {
    expect(
      parseMatrix(
        "matrix(0.2215909090909091, 0, 0, -0.5113636363636364, 376, -267.28125)"
      )
    ).toEqual([0.2215909090909091, 0, 0, -0.5113636363636364, 376, -267.28125])
  })
})

describe("convertMatrix3dArrayTo2dString", () => {
  it("takes a 3d matrix and returns a 2d one", () => {
    const threeDArray = [1, 7, 8, 13, 4, 1, 33, 9, 11, 7, 1, 0, 344, 10, 4, 1]
    expect(convertMatrix3dArrayTo2dString(threeDArray)).toBe(
      "matrix(1, 7, 4, 1, 344, 10)"
    )
  })
})
