import { Button, ButtonProps } from '@mui/material';


interface Props extends ButtonProps {
    label: string;
    handleClick: () => void;
}

const RectangularButton = ({handleClick, label, variant, color, size, disabled}: Props) => {
  return (
    <Button  variant={variant} size={size} color={color} onClick={handleClick} disabled={disabled}>{label}</Button>
  )
}

export default RectangularButton