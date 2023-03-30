export function timeFormat(seconds: number) {
  let min = Math.floor(seconds / 60)
  const hour = Math.floor(min / 60)
  const sec = seconds - min * 60
  min = min - hour * 60
  const strList = [hour, min, sec].map((n) => `${n}`.padStart(2, '0'))
  return strList.join(' : ')
}
