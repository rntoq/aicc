"use client";

import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import { useLocale, type Locale } from "@/app/context/LocaleContext";

const options: { value: Locale; label: string }[] = [
  { value: "ru", label: "Русский" },
  { value: "kk", label: "Қазақша" },
];

export function LanguageDropdown() {
  const { locale, setLocale } = useLocale();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value: Locale) => {
    setLocale(value);
    handleClose();
  };

  const currentLabel = options.find((o) => o.value === locale)?.label ?? "RU";

  return (
    <>
      <Button
        id="language-button"
        aria-controls={open ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpen}
        startIcon={<LanguageIcon />}
        sx={styles.button}
      >
        <Typography variant="body2" fontWeight={500}>
          {currentLabel}
        </Typography>
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "language-button",
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: { sx: styles.menuPaper },
        }}
      >
        {options.map((opt) => (
          <MenuItem
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            selected={locale === opt.value}
          >
            {locale === opt.value ? (
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckIcon fontSize="small" color="primary" />
              </ListItemIcon>
            ) : (
              <ListItemIcon sx={{ minWidth: 32 }} />
            )}
            <ListItemText primary={opt.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

const styles = {
  button: {
    color: "text.primary",
    textTransform: "none",
    minWidth: "auto",
    "&:hover": { bgcolor: "action.hover" },
  },
  menuPaper: {
    mt: 1.5,
    minWidth: 160,
    borderRadius: 2,
    boxShadow: 3,
  },
};
