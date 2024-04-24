import * as React from "react";
import Button from "@mui/material/Button";

export default function ButtonUsage({ label, onClick, ...rest }) {
  return (
    <Button variant="contained" size="large" onClick={onClick} className="ubuntu-medium" {...rest}>
      {label}
    </Button>
  );
}
