import { useState } from "react";
import Button from "../atoms/buttons/Button";

type Props = { onClick: () => void; children: React.ReactNode };

const IndicateLoadingButton = ({ onClick, children, ...props }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      loading={isLoading}
      onClick={() => {
        setIsLoading(true);
        // await onClick(); // TODO: This is not really how it should work.
        setIsLoading(false);
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default IndicateLoadingButton;
