export type SudoGroupType = (SudoValue | null)[]
export type SudoProblemType = SudoGroupType[]
export type SudoNodesType = SudoValue[][][]
export type SudoValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type SudoIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

// 难度选项
const DIFFICULTY: 'ease' | 'middle' | 'hard' = 'middle'

/**
 * 获取一个随机顺序的 1-9 数组
 */
function getFullNumBox() {
  const arr: SudoGroupType = new Array(9)
    .fill(0)
    .map((_, index) => index + 1) as SudoGroupType
  const result: SudoGroupType = []
  while (arr.length) {
    result.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0])
  }
  return result
}

/**
 * 获取该格可能的数
 * @param rowPerspective 行视角数独
 * @param x 横坐标
 * @param y 纵坐标
 */
export function getUnitPossible(
  rowPerspective: SudoProblemType,
  y: SudoIndex,
  x: SudoIndex
): SudoValue[] {
  const arr: SudoGroupType = new Array(9)
    .fill(0)
    .map((_, index) => index + 1) as SudoGroupType
  const exclude = new Set()
  for (let i = 0; i < 9; i++) {
    if (i !== x && rowPerspective[y][i]) exclude.add(rowPerspective[y][i])
    if (i !== y && rowPerspective[i][x]) exclude.add(rowPerspective[i][x])
    const [offsetY, offsetX] = [Math.floor(y / 3) * 3, Math.floor(x / 3) * 3]
    const boxTarget =
      rowPerspective[offsetY + Math.floor(i / 3)][offsetX + Math.floor(i % 3)]
    if (boxTarget) exclude.add(boxTarget)
  }
  return arr.filter((num) => !exclude.has(num)) as SudoValue[]
}

/**
 * 填写只有唯一可能的格子
 * @param rowPerspective
 */
function setUniqueUnit(rowPerspective: SudoProblemType) {
  rowPerspective.flat(1).forEach((num, index) => {
    if (num) return
    const [y, x] = [index / 9, index % 9].map(Math.floor) as [
      SudoIndex,
      SudoIndex
    ]
    const unitPossible = getUnitPossible(rowPerspective, y, x)
    if (unitPossible.length === 1) rowPerspective[y][x] = unitPossible[0]
  })
}

/**
 * 检查数独是否可解（存在一格任何数字都不能填则判断为无解）
 * @param rowPerspective
 */
function checkValid(rowPerspective: SudoProblemType) {
  const hasNotPossible = rowPerspective.flat(1).find((num, index) => {
    if (num) return false
    const [y, x] = [index / 9, index % 9].map(Math.floor) as [
      SudoIndex,
      SudoIndex
    ]
    const unitPossible = getUnitPossible(rowPerspective, y, x)
    if (!unitPossible.length) return true
  })
  return hasNotPossible !== null
}

/**
 * 存在一个只有唯一可能格子
 * @param rowPerspective
 * @returns
 */
function hasUniqueUnit(rowPerspective: SudoProblemType) {
  const hasUniqueUnit = rowPerspective.flat(1).find((num, index) => {
    if (num) return false
    const [y, x] = [index / 9, index % 9].map(Math.floor) as [
      SudoIndex,
      SudoIndex
    ]
    const unitPossible = getUnitPossible(rowPerspective, y, x)
    if (unitPossible.length === 1) return true
  })
  return hasUniqueUnit === null
}

function getNotNullUnitList(rowPerspective: SudoProblemType) {
  return rowPerspective
    .flat(1)
    .map((num, index) => num && { num, index })
    .filter((t) => t)
}

/**
 * 获取空格子列表
 * @param rowPerspective
 * @returns
 */
function getNullUnitList(rowPerspective: SudoProblemType) {
  const uniqueUnitList = rowPerspective
    .flat(1)
    .map((num, index) => {
      if (num) return undefined
      const [y, x] = [index / 9, index % 9].map(Math.floor) as [
        SudoIndex,
        SudoIndex
      ]
      return {
        x,
        y,
        index,
      }
    })
    .filter((t) => t) as { x: SudoIndex; y: SudoIndex; index: number }[]
  return uniqueUnitList
}

/**
 * 有空格子
 * @param rowPerspective
 * @returns
 */
function hasNullUnit(rowPerspective: SudoProblemType) {
  const hasNullUnit =
    rowPerspective.flat(1).find((num) => {
      if (num) return false
      return true
    }) === null
  return hasNullUnit
}

/**
 * 在列表里随机挑一个
 * @param list
 * @returns
 */
function randomChoice<T extends unknown>(list: T[]): T {
  const num = list[Math.floor(Math.random() * list.length)]
  return num
}

/**
 * 复制一个数独题目
 * @param sudoProblem 数独题目
 * @returns
 */
export function sudoProblemCopy(sudoProblem: SudoProblemType) {
  return sudoProblem.map((rows) => rows.map((num) => num))
}

/**
 * 复制一个数独笔记
 * @param sudoProblem 数独笔记
 * @returns
 */
export function sudoNodesCopy(sudoNodes: SudoNodesType) {
  return sudoNodes.map((rows) => rows.map((notes) => notes.map((note) => note)))
}

/**
 * 创建一个填满数字的数独题目
 */
function createdFullSudoProblem() {
  const sudoProblemByBox: SudoProblemType = []
  // 将首尾及中间的宫填上
  sudoProblemByBox[0] = getFullNumBox()
  sudoProblemByBox[4] = getFullNumBox()
  sudoProblemByBox[8] = getFullNumBox()

  // 行视角的数独题目
  let rowPerspective = transRowPerspective(sudoProblemByBox)

  // 填几个数字减少耗时
  for (let i = 3 as SudoIndex; i < 9; i += 3) {
    rowPerspective[i][0] = randomChoice(getUnitPossible(rowPerspective, i, 0))
    rowPerspective[0][i] = randomChoice(getUnitPossible(rowPerspective, 0, i))
  }

  // 存储回溯点的栈
  const recordPointStack: {
    x: SudoIndex
    y: SudoIndex
    sudoProblem: SudoProblemType
    possibleList: SudoValue[]
  }[] = []
  while (hasNullUnit(rowPerspective)) {
    // 发现没有解
    if (!checkValid(rowPerspective)) {
      // 回退到上个回溯点
      const { y, x, possibleList, sudoProblem } = recordPointStack.splice(
        -1,
        1
      )?.[0]
      rowPerspective = sudoProblem
      if (possibleList.length === 1) {
        rowPerspective[y][x] = possibleList[0]
        continue
      }
      const num = randomChoice(possibleList)
      rowPerspective[y][x] = num
      recordPointStack.push({
        y,
        x,
        sudoProblem,
        possibleList: possibleList.filter((n) => n !== num),
      })
      continue
    }
    // 如果出现没有唯一可能性时需要随机填一个再继续填
    if (!hasUniqueUnit(rowPerspective)) {
      console.warn('not has unique unit need randomChoice')
      const uniqueUnitList = getNullUnitList(rowPerspective)
      // uniqueUnitList 为空表示到这步出现无解
      if (!uniqueUnitList.length) break
      const { x, y } = randomChoice(uniqueUnitList)
      const possibleList = getUnitPossible(rowPerspective, y, x)
      const num = randomChoice(possibleList)
      // 存储回溯点，含当前数独题目、选择的格子，可能的选择（需要把这次选择的数字排除）
      recordPointStack.push({
        x,
        y,
        possibleList: possibleList.filter((n) => n !== num),
        sudoProblem: sudoProblemCopy(rowPerspective),
      })
      rowPerspective[y][x] = num
      continue
    }
    setUniqueUnit(rowPerspective)
  }
  return rowPerspective
}

export function getSudoProblem(): SudoProblemType {
  const rowPerspective = createdFullSudoProblem()
  // 保存一份填满数字的题目
  const fullProblem = sudoProblemCopy(rowPerspective)
  // 开始挖空
  for (let i = 0; i < 69; i++) {
    const { index } = randomChoice(getNotNullUnitList(rowPerspective)) || {}
    if (typeof index !== 'number') continue
    const [y, x] = [index / 9, index % 9].map(Math.floor)
    if (typeof y !== 'number' || typeof x !== 'number') continue
    const num = rowPerspective[y][x]
    rowPerspective[y][x] = null
    // 尝试解题
    const problem = tryCompleteSudoProblem(sudoProblemCopy(rowPerspective))
    // 解题成功
    if (problem && problemEqual(problem, fullProblem)) continue
    rowPerspective[y][x] = num
    if (DIFFICULTY === 'ease') break
  }
  console.log(
    'numberCount:',
    rowPerspective
      .flat(1)
      .reduce<number>((acc, num) => (num ? acc + 1 : acc), 0)
  )
  // 需要保证最少18个否则可能有多个解
  return rowPerspective
}

/**
 * 尝试完成数独
 * @param rowPerspective
 * @returns
 */
function tryCompleteSudoProblem(rowPerspective: SudoProblemType) {
  const problem = sudoProblemCopy(rowPerspective)
  // 循环填写只有唯一解的空
  while (hasNullUnit(problem)) {
    // 出现 没有解 或 没有唯一可能性
    if (!checkValid(problem) || !hasUniqueUnit(problem)) return undefined
    setUniqueUnit(problem)
  }
  return problem
}
/**
 * 转换数独数据展示方式（视角）
 * @param boxSudoProblem 宫视角数独
 * @returns 行视角数独
 */
export function transRowPerspective<T extends unknown>(boxSudoProblem: T[][]) {
  const sudoProblem: (T | null)[][] = new Array(9)
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

export function transBoxPerspective<T extends unknown>(rowPerspective: T[][]) {
  const sudoProblem: T[][] = []
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      const bIndex = Math.floor(y / 3) * 3 + Math.floor(x / 3)
      sudoProblem[bIndex] = [
        ...(sudoProblem[bIndex] || []),
        rowPerspective[y][x],
      ]
    }
  }
  return sudoProblem
}

export function problemEqual(
  problemA: SudoProblemType,
  problemB: SudoProblemType
) {
  for (let y: SudoIndex = 0; y < 9; y++) {
    for (let x: SudoIndex = 0; x < 9; x++) {
      if (problemA[y][x] !== problemB[y][x]) return false
    }
  }
  return true
}
