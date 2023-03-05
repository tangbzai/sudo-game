export type SudoGroupType = (SudoValue | null)[]
export type SudoProblemType = SudoGroupType[]
export type SudoValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type SudoIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

// 难度选项
const DIFFICULTY: 'ease' | 'middle' | 'hard' = 'middle'

/**
 * 获取 0 - 8 的随机数字
 * @param exclude 需要排除的数
 */
function getRandomNum(exclude?: SudoIndex[]): SudoIndex {
  const arr = ([0, 1, 2, 3, 4, 5, 6, 7, 8] as SudoIndex[]).filter(
    (item) => !exclude?.includes(item)
  ) as SudoIndex[]
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * 获取每宫的题目
 */
function getBoxProblem(): (SudoValue | null)[] {
  const arr: SudoValue[] = []
  let numCount = { ease: 8, middle: 7, hard: 6 }[DIFFICULTY]
  while (numCount > 0) {
    if (numCount <= 2 && Math.random() * 2 > 1) {
      numCount--
      continue
    }
    const index = Math.floor(Math.random() * 9) as SudoIndex
    arr[index] = (getRandomNum(arr.map((item) => item - 1) as SudoIndex[]) +
      1) as SudoValue
    numCount--
  }
  return arr
}

// FIXME: 目前无法保证生成的题目有且只有唯一解
export function getSudoProblem(): SudoProblemType {
  const sudoProblemByBox: SudoProblemType = []
  let hasNumBoxCount = { ease: 9, middle: 7, hard: 5 }[DIFFICULTY]
  while (hasNumBoxCount > 0) {
    if (hasNumBoxCount < 1 && Math.random() * 2 > 1) {
      hasNumBoxCount--
      continue
    }
    const index = getRandomNum(
      sudoProblemByBox.map<SudoIndex>((_, index) => index as SudoIndex)
    )
    const boxProblem = getBoxProblem()
    if (
      boxProblem.find((item, itemIndex) => {
        if (!item) return false
        const [boxItemY, boxItemX] = [Math.floor(itemIndex / 3), itemIndex % 3]
        // 同一列
        const columnBoxList = getEqualColumnBox(sudoProblemByBox, index)
          .map((item) =>
            item?.filter((_, boxItemIndex) => boxItemIndex % 3 === boxItemX)
          )
          .flat(1)
          .filter((t) => t)
        if (columnBoxList.includes(item)) return true
        // 同一行
        const rowBoxList = getEqualRowBox(sudoProblemByBox, index)
          .map((item) =>
            item?.filter(
              (_, boxItemIndex) => Math.floor(boxItemIndex / 3) === boxItemY
            )
          )
          .flat(1)
        if (rowBoxList.includes(item)) return true
      })
    )
      continue
    sudoProblemByBox[index] = boxProblem
    hasNumBoxCount--
  }

  console.log(
    'numberCount:',
    sudoProblemByBox.flat(1).reduce<number>((acc, i) => (i ? acc + 1 : acc), 0)
  )
  // 需要保证最少18个否则可能有多个解
  // console.log(sudoProblemByBox)
  return transRowPerspective(sudoProblemByBox)
}

/**
 * 获取同列的宫列表
 * @param boxSudoProblem 宫视角数独
 * @param index 当前位置
 * @return 同列的宫列表
 */
export function getEqualColumnBox(
  boxSudoProblem: SudoProblemType,
  index: SudoIndex
): SudoGroupType[] {
  const arr: SudoIndex[] = (
    [0, 3, 6].map((item) => (index % 3) + item) as SudoIndex[]
  ).filter((item) => item !== index)
  return arr.map((item) => boxSudoProblem[item])
}

/**
 * 获取同行的宫
 * @param boxSudoProblem 宫视角数独
 * @param index 当前位置
 * @return 同行的宫列表
 */
export function getEqualRowBox(
  boxSudoProblem: SudoProblemType,
  index: SudoIndex
): SudoGroupType[] {
  const arr: SudoIndex[] = (
    [-2, -1, 1, 2].map((item) => index + item) as SudoIndex[]
  ).filter(
    (item) =>
      Math.floor(index / 3) === Math.floor(item / 3) && item >= 0 && item < 9
  )
  return arr.map((item) => boxSudoProblem[item])
}

/**
 * 获取十字型方向的宫
 */
export function getEqualCrossBox() {}

/**
 * 转换数独数据展示方式（视角）
 * @param boxSudoProblem 宫视角数独
 * @returns 行视角数独
 */
export function transRowPerspective(boxSudoProblem: SudoProblemType) {
  const sudoProblem: SudoProblemType = new Array(9)
    .fill(null)
    .map(() => new Array(9))
  for (let boxIndex = 0; boxIndex < 9; boxIndex++) {
    for (let unitIndex = 0; unitIndex < 9; unitIndex++) {
      const indexByline =
        Math.floor(boxIndex / 3) * 27 +
        (boxIndex % 3) * 3 +
        (unitIndex % 3) +
        Math.floor(unitIndex / 3) * 9
      const y = Math.floor(indexByline / 9)
      const x = indexByline % 9
      sudoProblem[y][x] = boxSudoProblem[boxIndex]?.[unitIndex] || null
    }
  }
  return sudoProblem
}
