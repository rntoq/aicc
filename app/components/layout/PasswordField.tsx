"use client";

import { useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

type PasswordFieldProps = Omit<TextFieldProps, "type">;

export const PasswordField = ({ InputProps, ...props }: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={visible ? "Hide password" : "Show password"}
              onClick={() => setVisible((v) => !v)}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
              size="small"
            >
              {visible ? (
                <VisibilityOffOutlinedIcon fontSize="small" />
              ) : (
                <VisibilityOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
