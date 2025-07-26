

const Label = ({ name, size = "sm" }) => {
  return <div className={`text-${size} font-semibold mb-2`}>{name}</div>
}

export default Label
