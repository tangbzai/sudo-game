import classnames from '@/utils/classnames'
import { SudoValue } from '@/utils/sudo'
import styles from './index.module.css'

interface NumberBarProps {
  className?: string
  onClick?: (num: SudoValue) => void
}
function NumberBar(props: NumberBarProps) {
  return (
    <div
      className={classnames(styles.numberBar, props.className)}
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

export default NumberBar
