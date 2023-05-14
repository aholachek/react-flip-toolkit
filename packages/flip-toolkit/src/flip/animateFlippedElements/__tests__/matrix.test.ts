import {
  convertMatrix3dArrayTo2dArray,
  convertMatrix2dArrayToString
} from '../index'

describe('convertMatrix3dArrayTo2dArray', () => {
  it('takes a 3d matrix and returns a 2d one', () => {
    const threeDArray = [1, 7, 8, 13, 4, 1, 33, 9, 11, 7, 1, 0, 344, 10, 4, 1]
    expect(convertMatrix3dArrayTo2dArray(threeDArray)).toEqual([
      1, 7, 4, 1, 344, 10
    ])
  })
})

describe('convertMatrix2dArrayToString', () => {
  it('takes the values and makes a string', () => {
    expect(
      convertMatrix2dArrayToString([
        0.2215909090909091, 0, 0, 0.5113636363636364, -376, 267.28125
      ])
    ).toEqual(
      'matrix(0.2215909090909091, 0, 0, 0.5113636363636364, -376, 267.28125)'
    )
  })
})
