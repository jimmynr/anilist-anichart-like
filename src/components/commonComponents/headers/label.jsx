

const Label = ({ name, size = "sm" }) => {
  return <div className={`text-${size} font-semibold mb-2 text-[#6e859e] dark:text-[#41B1EA]`}>{name}</div>
}

export default Label
