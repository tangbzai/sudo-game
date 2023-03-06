import { useEffect, useState } from 'react'
import styles from './App.module.css'
import { getSudoProblem } from './utils/sudo'

function App() {
  const [sudoProblem, setSudoProblem] = useState<(number | null)[][]>(
    new Array(9).fill(new Array(9).fill(null))
  )
  useEffect(() => {
    // 获取题目
    const t = new Date()
    const sudoProblem = getSudoProblem()
    console.log('生成耗时：', Date.now() - t.getTime(), 'ms')
    setSudoProblem(sudoProblem)
    console.log(sudoProblem)
    // sudoProblem.map((item, index) => console.log(index + 1, item))
  }, [])
  return (
    <div className={styles.app}>
      {sudoProblem.map((row, rowIndex) =>
        row.map((num, columnIndex) => (
          <div
            key={`${rowIndex}-${columnIndex}`}
            className={styles.unit}
            contentEditable={!num}
          >
            {num}
          </div>
        ))
      )}
    </div>
  )
}

export default App
