import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import styles from './index.module.css'

function timeFormat(seconds: number) {
  let min = Math.floor(seconds / 60)
  const hour = Math.floor(min / 60)
  const sec = seconds - min * 60
  min = min - hour * 60
  const strList = [hour, min, sec].map((n) => `${n}`.padStart(2, '0'))
  return strList.join(' : ')
}

const Timer = forwardRef((props: {}, ref) => {
  const timer = useRef<number>()
  const [seconds, setSeconds] = useState(0)

  const stopFn = useCallback(() => {
    clearInterval(timer.current)
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      stopFn,
    }),
    [stopFn]
  )

  useEffect(() => {
    if (timer.current) stopFn()
    timer.current = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return stopFn
  }, [])
  return <div className={styles.Timer}>{timeFormat(seconds)}</div>
})

export default Timer
