import { Button, ButtonProps } from "@mui/material";
import React from "react";

interface Props extends ButtonProps {
  label: string;
}

const RectangularButton = React.forwardRef(
  ({ onClick, label, variant, color, size, disabled }: Props, ref) => {
    return (
      <Button
        variant={variant}
        size={size}
        color={color}
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </Button>
    );
  },
);

export default RectangularButton;
