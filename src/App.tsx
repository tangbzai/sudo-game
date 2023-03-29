import { createRef, useCallback, useEffect, useRef, useState } from 'react'
import styles from './App.module.css'
import {
  getSudoProblem,
  getUnitPossible,
  SudoIndex,
  sudoNodesCopy,
  SudoNodesType,
  sudoProblemCopy,
  SudoProblemType,
  SudoValue,
} from './utils/sudo'
import Tips from './assets/tips.svg'
import Clear from './assets/clear.svg'
import Record from './assets/record.svg'
import Revoke from './assets/revoke.svg'
import classnames from './utils/classnames'
import ControlBar from './components/ControlBar'
import NumberBar from './components/NumberBar'
import TipsBox from './components/TipsBox'
import Timer from './components/Timer'

// 撤回最多次数
const RECORD_LENGTH = 5
function App() {
  // 历史记录列表（用作撤回操作）
  const recordList = useRef<SudoProblemType[]>([])
  // 数独笔记
  const [sudoNotes, setSudoNotes] = useState<SudoNodesType>(
    new Array(9).fill(new Array(9).fill(new Array(9).fill(undefined)))
  )
  // 数独题目
  const [sudoProblem, setSudoProblem] = useState<SudoProblemType>(
    new Array(9).fill(new Array(9).fill(null))
  )
  // 正在展示的数独
  const [showSudo, setShowSudo] = useState<SudoProblemType>(
    new Array(9).fill(new Array(9).fill(null))
  )
  // 填写模式
  const [fillPattern, setFillPattern] = useState<'normal' | 'note'>('normal')
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
    (num: SudoValue | null) => {
      const [y, x] = currentPosition || []
      if (typeof y !== 'number' || typeof x !== 'number') return
      // 属于题目位置不可编辑
      if (sudoProblem[y][x]) return
      // 正常模式或清空单元格
      if (fillPattern === 'normal' || num === null) {
        // 记录当前状态便于回退
        recordList.current = recordList.current
          .slice(-RECORD_LENGTH + 1)
          .concat([showSudo])
        const newProblem = sudoProblemCopy(showSudo)
        newProblem[y][x] = num
        setShowSudo(newProblem)
        return
      }
      // 笔记模式
      if (fillPattern === 'note') {
        const newNotes = sudoNodesCopy(sudoNotes)
        const hasNum = newNotes[y][x].find((n) => n === num)
        if (hasNum) newNotes[y][x] = newNotes[y][x].filter((n) => n !== num)
        else newNotes[y][x].push(num)
        setSudoNotes(newNotes)
        return
      }
    },
    [showSudo, sudoNotes, sudoProblem, currentPosition]
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

  const timerRef = createRef<{ stopFn: () => void }>()
  useEffect(() => {
    if (!showSudo.find((row) => row.includes(null))?.includes(null))
      timerRef.current?.stopFn()
  }, [showSudo])

  // 生成笔记
  // useEffect(() => {
  //   const newSudoNotes = showSudo.map((numList, y) =>
  //     numList.map((num, x) =>
  //       num ? [] : getUnitPossible(showSudo, y as SudoIndex, x as SudoIndex)
  //     )
  //   )
  //   setSudoNotes(newSudoNotes)
  //   // 唯一可能格所在的宫内其他格不可能为该数字
  //   let boxNotes = transBoxPerspective(newSudoNotes)
  //   for (let i = 0; i < 9; i++)
  //     boxNotes = boxNotes.map((boxList) => {
  //       const targetNotesList =
  //         boxList.find((notesList) => notesList.length === 1) || []
  //       const targetNum = targetNotesList[0]
  //       return targetNum
  //         ? boxList.map((notesList) =>
  //             notesList.length > 1
  //               ? notesList.filter((note) => note !== targetNum)
  //               : notesList
  //           )
  //         : boxList
  //     })
  //   setSudoNotes(transRowPerspective(boxNotes) as SudoValue[][][])
  // }, [showSudo])

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
      <Timer ref={timerRef} />
      <div className={styles.sudoProblem}>
        {showSudo.map((row, rowIndex) =>
          row.map((num, columnIndex) => {
            const [ry, cx] = [rowIndex, columnIndex] as [SudoIndex, SudoIndex]
            return (
              <div
                key={`${ry}-${cx}`}
                className={classnames(
                  styles.unit,
                  heightLightNum === num ? styles.heightLight : '',
                  y === ry && x === cx ? styles.curr : ''
                )}
              >
                {num ?? (
                  <TipsBox
                    className={styles.tips}
                    numList={sudoNotes[ry][cx]}
                  />
                )}
              </div>
            )
          })
        )}
      </div>
      <ControlBar
        valueEnum={{
          tips: Tips,
          revoke: Revoke,
          clear: Clear,
          record: Record,
        }}
        onClick={(key) => {
          if (!key) return
          const keyMap: Record<typeof key, () => void> = {
            tips: () => {
              // 生成选中格的笔记
              if (typeof y !== 'number' || typeof x !== 'number') return
              // 属于题目位置不可编辑
              if (sudoProblem[y][x]) return
              const newNotes = sudoNodesCopy(sudoNotes)
              newNotes[y][x] = getUnitPossible(showSudo, y, x)
              setSudoNotes(newNotes)
            },
            revoke: () => {
              const newShowSudo = recordList.current.pop()
              if (newShowSudo) setShowSudo(newShowSudo)
            },
            clear: () => {
              editUnit(null)
            },
            record: () => {
              setFillPattern(fillPattern === 'normal' ? 'note' : 'normal')
            },
          }
          keyMap[key]?.()
        }}
      />
      <NumberBar
        className={classnames(
          styles.numberBar,
          fillPattern === 'normal' ? styles.normal : styles.note
        )}
        onClick={editUnit}
      />
    </div>
  )
}

export default App
