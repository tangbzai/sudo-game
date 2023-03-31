import { ReactNode } from 'react'
import classnames from '@/utils/classnames'
import styles from './index.module.css'

interface ButtonProps extends React.DOMAttributes<HTMLButtonElement> {
  className?: string
  children?: ReactNode
}
function Button(props: ButtonProps) {
  return (
    <button {...props} className={classnames(styles.btn, props.className)}>
      {props.children}
    </button>
  )
}

export default Button
