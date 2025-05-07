import type { MouseEventHandler, ReactNode } from 'react'
import Button from '@/components/Button'
import styles from './TheEnd.module.css'

interface TheEndProps {
  time?: ReactNode
  onClickReset?: MouseEventHandler<HTMLButtonElement>
}
function TheEnd(props: TheEndProps) {
  return (
    <div className={styles.theEnd}>
      <h1>游戏结束</h1>
      <em>总共用时</em>
      <strong>{props.time}</strong>
      <Button className={styles.btn} onClick={props.onClickReset}>
        重新开始
      </Button>
    </div>
  )
}

export default TheEnd
