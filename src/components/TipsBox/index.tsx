import classnames from '@/utils/classnames'
import { SudoValue } from '@/utils/sudo'
import styles from './index.module.css'

interface TipsBoxProps {
  className?: string
  numList?: SudoValue[]
}

function TipsBox(props: TipsBoxProps) {
  const numList = props.numList || []
  return (
    <div className={classnames(styles.tips, props.className)}>
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

export default TipsBox
