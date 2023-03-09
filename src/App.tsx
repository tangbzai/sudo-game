import { useEffect, useState } from 'react'
import styles from './App.module.css'
import {
  getSudoProblem,
  getUnitPossible,
  SudoIndex,
  SudoProblemType,
  SudoValue,
} from './utils/sudo'

function App() {
  const [sudoProblem, setSudoProblem] = useState<SudoProblemType>(
    new Array(9).fill(new Array(9).fill(undefined))
  )
  const [showSudo, setShowSudo] = useState<SudoProblemType>(
    new Array(9).fill(new Array(9).fill(undefined))
  )
  const [heightLightNum, setHeightLightNum] = useState<number>()
  useEffect(() => {
    // 获取题目
    const t = new Date()
    const sudoProblem = getSudoProblem()
    console.log('生成耗时：', Date.now() - t.getTime(), 'ms')
    setSudoProblem(sudoProblem)
    setShowSudo(sudoProblem)
    console.log(sudoProblem)
    // sudoProblem.map((item, index) => console.log(index + 1, item))
  }, [])

  return (
    <div className={styles.app}>
      {showSudo.map((row, rowIndex) =>
        row.map((num, columnIndex) => {
          const [y, x] = [rowIndex, columnIndex] as [SudoIndex, SudoIndex]
          return (
            <div
              key={`${y}-${x}`}
              className={`${styles.unit} ${
                heightLightNum === num ? styles.heightLight : ''
              }`}
              contentEditable={!sudoProblem[y][x]}
              onBlur={(e) => {
                const text = Number(e.target.innerText)
                const textNum = (
                  Number.isNaN(text) ? null : text < 1 || text > 9 ? null : text
                ) as SudoValue
                const newProblem = showSudo.map((item) => [...item])
                newProblem[y][x] = textNum
                setShowSudo(newProblem)
              }}
              onClick={(e) => {
                // @ts-expect-error
                const text = Number(e.target.innerText)
                const textNum = Number.isNaN(text) ? undefined : text
                setHeightLightNum(num ?? textNum ?? undefined)
              }}
            >
              {num ?? <TipsBox numList={getUnitPossible(showSudo, y, x)} />}
            </div>
          )
        })
      )}
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
      <span style={numList.includes(1) ? {} : { display: 'none' }}>1</span>
      <span style={numList.includes(2) ? {} : { display: 'none' }}>2</span>
      <span style={numList.includes(3) ? {} : { display: 'none' }}>3</span>
      <span style={numList.includes(4) ? {} : { display: 'none' }}>4</span>
      <span style={numList.includes(5) ? {} : { display: 'none' }}>5</span>
      <span style={numList.includes(6) ? {} : { display: 'none' }}>6</span>
      <span style={numList.includes(7) ? {} : { display: 'none' }}>7</span>
      <span style={numList.includes(8) ? {} : { display: 'none' }}>8</span>
      <span style={numList.includes(9) ? {} : { display: 'none' }}>9</span>
    </div>
  )
}

export default App
