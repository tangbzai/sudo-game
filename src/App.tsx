import { useCallback, useEffect, useState } from 'react'
import styles from './App.module.css'
import {
  getSudoProblem,
  getUnitPossible,
  SudoIndex,
  sudoProblemCopy,
  SudoProblemType,
  SudoValue,
} from './utils/sudo'

function App() {
  // 数独题目
  const [sudoProblem, setSudoProblem] = useState<SudoProblemType>(
    new Array(9).fill(new Array(9).fill(undefined))
  )
  // 正在展示的数独
  const [showSudo, setShowSudo] = useState<SudoProblemType>(
    new Array(9).fill(new Array(9).fill(undefined))
  )
  // 当前选中的位置
  const [currentPosition, setCurrentPosition] =
    useState<[SudoIndex, SudoIndex]>()
  useEffect(() => {
    // 获取题目
    const t = new Date()
    const sudoProblem = getSudoProblem()
    console.log('生成耗时：', Date.now() - t.getTime(), 'ms')
    setSudoProblem(sudoProblem)
    setShowSudo(sudoProblem)
  }, [])

  const editUnit = useCallback(
    (num: SudoValue) => {
      const [y, x] = currentPosition || []
      if (typeof y !== 'number' || typeof x !== 'number') return
      const newProblem = sudoProblemCopy(showSudo)
      // 属于题目位置不可编辑
      if (sudoProblem[y][x]) return
      newProblem[y][x] = num
      setShowSudo(newProblem)
    },
    [showSudo, sudoProblem, currentPosition]
  )

  const keydownListener = useCallback(
    (e: KeyboardEvent) => {
      const numKey = Number(e.key)
      if (Number.isNaN(numKey)) return
      if (numKey < 1 || numKey > 9) return
      editUnit(numKey as SudoValue)
    },
    [editUnit]
  )

  useEffect(() => {
    window.removeEventListener('keydown', keydownListener)
    window.addEventListener('keydown', keydownListener)
    return () => {
      window.removeEventListener('keydown', keydownListener)
    }
  }, [keydownListener])

  const [y, x] = currentPosition || []
  const heightLightNum =
    typeof y === 'number' && typeof x === 'number'
      ? showSudo[y][x] ?? undefined
      : undefined
  return (
    <div
      className={styles.app}
      onClick={(e) => {
        const { target } = e
        // @ts-expect-error
        const { classList, parentElement } = target
        if (![...classList].includes(`${styles.unit}`)) {
          return setCurrentPosition(undefined)
        }
        const index = [...parentElement.children].indexOf(target as any)
        const [targetY, targetX] = [index / 9, index % 9].map(Math.floor) as [
          SudoIndex,
          SudoIndex
        ]
        setCurrentPosition([targetY, targetX])
      }}
    >
      <div className={styles.sudoProblem}>
        {showSudo.map((row, rowIndex) =>
          row.map((num, columnIndex) => {
            const [ry, cx] = [rowIndex, columnIndex] as [SudoIndex, SudoIndex]
            return (
              <div
                key={`${ry}-${cx}`}
                className={`${styles.unit} ${
                  heightLightNum === num ? styles.heightLight : ''
                } ${y === ry && x === cx ? styles.curr : ''}`}
              >
                {num ?? <TipsBox numList={getUnitPossible(showSudo, ry, cx)} />}
              </div>
            )
          })
        )}
      </div>
      <NumberBar onClick={editUnit} />
    </div>
  )
}

interface TipsBoxProps {
  numList?: SudoValue[]
}

function TipsBox(props: TipsBoxProps) {
  const numList = props.numList || []
  return (
    <div className={styles.tips}>
      {new Array(9).fill(0).map((_, index) => (
        <span
          key={index}
          style={
            numList.includes((index + 1) as SudoValue)
              ? {}
              : { visibility: 'hidden' }
          }
        >
          {index + 1}
        </span>
      ))}
    </div>
  )
}

interface NumberBarProps {
  onClick?: (num: SudoValue) => void
}
function NumberBar(props: NumberBarProps) {
  return (
    <div
      className={styles.numberBar}
      onClick={(e) => {
        // @ts-expect-error
        const { innerText } = e.target
        const num = Number(innerText) as SudoValue
        if (Number.isNaN(num)) return
        props.onClick?.(num)
      }}
    >
      {new Array(9).fill(0).map((_, index) => (
        <div key={index}>{index + 1}</div>
      ))}
    </div>
  )
}
export default App
