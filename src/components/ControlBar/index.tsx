import classnames from '@/utils/classnames'
import styles from './index.module.css'

interface ControlBarProps<K extends string> {
  onClick?: (key?: K) => void
  valueEnum?: Record<K, string>
}
function ControlBar<K extends string>(props: ControlBarProps<K>) {
  return (
    <div className={styles.controlBar}>
      {props.valueEnum &&
        Object.entries<string>(props.valueEnum).map(([key, icon]) => (
          <div
            key={key}
            onClick={() => {
              props.onClick?.(key as K)
            }}
          >
            <img src={icon} />
          </div>
        ))}
    </div>
  )
}
export default ControlBar
