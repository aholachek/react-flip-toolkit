import initiateAnimations, { createCallTree } from "../initiateAnimations"

describe("createCallTree", () => {
  it("should build the correct tree if there are nested immediate flip functions", () => {
    const flipDict = {
      "id-1": { childIds: ["id-2"], id: "id-1" },
      "id-2": { childIds: ["id-3", "id-4"], id: "id-2" },
      "id-3": { childIds: ["id-5"], id: "id-3" },
      "id-4": { childIds: [], id: "id-4" },
      "id-5": { childIds: [], id: "id-5" },
      "id-6": { childIds: [], id: "id-6" }
    }
    const topLevelChildren = ["id-1", "id-6"]
    const initiateStaggeredAnimations = () => {}

    const tree = createCallTree({
      flipDict,
      topLevelChildren,
      initiateStaggeredAnimations
    })

    expect(JSON.parse(JSON.stringify(tree))).toEqual({
      root: {
        staggeredChildren: {},
        immediateChildren: [
          {
            childIds: ["id-2"],
            id: "id-1",
            staggeredChildren: {},
            immediateChildren: [
              {
                childIds: ["id-3", "id-4"],
                id: "id-2",
                staggeredChildren: {},
                immediateChildren: [
                  {
                    childIds: ["id-5"],
                    id: "id-3",
                    staggeredChildren: {},
                    immediateChildren: [
                      {
                        childIds: [],
                        id: "id-5",
                        staggeredChildren: {},
                        immediateChildren: []
                      }
                    ]
                  },
                  {
                    childIds: [],
                    id: "id-4",
                    staggeredChildren: {},
                    immediateChildren: []
                  }
                ]
              }
            ]
          },
          {
            childIds: [],
            id: "id-6",
            staggeredChildren: {},
            immediateChildren: []
          }
        ]
      }
    })
  })
  it("should build the correct tree if there are staggered functions nested inside an immediate array", () => {
    const flipDict = {
      "id-1": {
        childIds: ["id-2", "id-3"],
        id: "id-1"
      },
      "id-2": { childIds: [], id: "id-2", stagger: "default" },
      "id-3": { childIds: [], id: "id-3", stagger: "some-other-stagger-key" }
    }
    const topLevelChildren = ["id-1"]
    const initiateStaggeredAnimations = () => {}

    const tree = createCallTree({
      flipDict,
      topLevelChildren,
      initiateStaggeredAnimations
    })

    expect(JSON.parse(JSON.stringify(tree))).toEqual({
      root: {
        staggeredChildren: {},
        immediateChildren: [
          {
            childIds: ["id-2", "id-3"],
            id: "id-1",
            staggeredChildren: {
              default: [
                {
                  childIds: [],
                  id: "id-2",
                  stagger: "default",
                  staggeredChildren: {},
                  immediateChildren: []
                }
              ],
              "some-other-stagger-key": [
                {
                  childIds: [],
                  id: "id-3",
                  stagger: "some-other-stagger-key",
                  staggeredChildren: {},
                  immediateChildren: []
                }
              ]
            },
            immediateChildren: []
          }
        ]
      }
    })
  })
  it("should build the correct tree if a staggered function has immediately scheduled children", () => {
    const flipDict = {
      "id-1": {
        childIds: ["id-2", "id-3"],
        id: "id-1"
      },
      "id-2": { childIds: ["id-3"], id: "id-2", stagger: "default" },
      "id-3": { childIds: [], id: "id-3" }
    }
    const topLevelChildren = ["id-1"]
    const initiateStaggeredAnimations = () => {}

    const tree = createCallTree({
      flipDict,
      topLevelChildren,
      initiateStaggeredAnimations
    })

    expect(JSON.parse(JSON.stringify(tree))).toEqual({
      root: {
        staggeredChildren: {},
        immediateChildren: [
          {
            childIds: ["id-2", "id-3"],
            id: "id-1",
            staggeredChildren: {
              default: [
                {
                  childIds: ["id-3"],
                  id: "id-2",
                  stagger: "default",
                  staggeredChildren: {},
                  immediateChildren: [
                    {
                      childIds: [],
                      id: "id-3",
                      staggeredChildren: {},
                      immediateChildren: []
                    }
                  ]
                }
              ]
            },
            immediateChildren: [
              {
                childIds: [],
                id: "id-3",
                staggeredChildren: {},
                immediateChildren: []
              }
            ]
          }
        ]
      }
    })
  })
})
