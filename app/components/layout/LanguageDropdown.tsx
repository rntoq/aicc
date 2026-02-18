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
import Image from "next/image";
import ruFlag from "@/public/flag-ru.svg";
import kkFlag from "@/public/flag-kz.svg";

const options: { value: Locale; label: string }[] = [
  { value: "ru", label: "RU" },
  { value: "kk", label: "KK" },
];

export const LanguageDropdown = () => {
  const { locale, setLocale } = useLocale();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (e: React.MouseEvent, value: Locale) => {
    e.preventDefault();
    e.stopPropagation();
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
        startIcon={<LanguageIcon sx={{ width: 24, height: 24 }} />}
        sx={styles.button}
      >
        <Image src={locale === "ru" ? ruFlag : kkFlag} alt={currentLabel} width={32} height={20} />
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
            component="button"
            type="button"
            onClick={(e) => handleSelect(e, opt.value)}
            selected={locale === opt.value}
          >
            {locale === opt.value ? (
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckIcon fontSize="small" color="primary" />
              </ListItemIcon>
            ) : (
              <ListItemIcon sx={{ minWidth: 32 }} />
            )}
            <ListItemText primary={<Image src={opt.value === "ru" ? ruFlag : kkFlag} alt={opt.label} width={32} height={20} />} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const styles = {
  button: {
    color: "text.primary",
    textTransform: "none",
    minWidth: "auto",
  },
  menuPaper: {
    borderRadius: 1,
  },
};
