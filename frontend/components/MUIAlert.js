import React from "react";
import {
  Alert as MUIAlert,
  AlertTitle,
  IconButton,
  Collapse,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const Alert = ({
  type = "info",
  message,
  title,
  onClose,
  dismissible = false,
  open = true,
  className = "",
  sx = {},
}) => {
  const [isOpen, setIsOpen] = React.useState(open);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const severityMap = {
    error: "error",
    success: "success",
    warning: "warning",
    info: "info",
  };

  return (
    <Collapse in={isOpen}>
      <MUIAlert
        severity={severityMap[type] || "info"}
        className={className}
        sx={{ mb: 2, ...sx }}
        action={
          dismissible ? (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          ) : null
        }
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {typeof message === "string" ? message : message}
      </MUIAlert>
    </Collapse>
  );
};

export default Alert;
