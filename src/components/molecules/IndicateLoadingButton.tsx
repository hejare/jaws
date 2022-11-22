import { useState } from "react";
import Button from "../atoms/buttons/Button";

type Props = { onClick: () => Promise<void>; label: string };

const IndicateLoadingButton = ({ onClick, label }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      loading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        await onClick();
        setIsLoading(false);
      }}
    >
      {label}
    </Button>
  );
};

export default IndicateLoadingButton;
