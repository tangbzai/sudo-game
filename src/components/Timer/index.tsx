import { timeFormat } from '@/utils/time'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import styles from './index.module.css'

const Timer = forwardRef((props: {}, ref) => {
  const timer = useRef<number>()
  const [seconds, setSeconds] = useState(0)

  const stopFn = useCallback(() => {
    clearInterval(timer.current)
    return seconds
  }, [seconds])

  const resetFn = useCallback(() => {
    setSeconds(0)
    timer.current = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      stopFn,
      resetFn,
    }),
    [stopFn, resetFn]
  )

  useEffect(() => {
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => {
      clearInterval(timer.current)
    }
  }, [])
  return <div className={styles.Timer}>{timeFormat(seconds)}</div>
})

export default Timer
