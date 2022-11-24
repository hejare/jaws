import { useState } from "react";
import Button from "../atoms/buttons/Button";

type Props = { onClick: () => void; children: React.ReactNode };

const IndicateLoadingButton = ({ onClick, children, ...props }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      loading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        await onClick();
        setIsLoading(false);
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default IndicateLoadingButton;
