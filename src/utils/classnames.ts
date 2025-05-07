export default function classnames(
  ...classnames: (string | number | boolean | undefined)[]
): string | undefined {
  return classnames.reduce<string>((acc, name) => (name ? `${acc} ${name}` : acc), '')
}
