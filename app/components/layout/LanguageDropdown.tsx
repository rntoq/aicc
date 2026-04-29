"use client";

import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, type Locale } from "@/app/context/LocaleContext";
import Image from "next/image";
import ruFlag from "@/public/icons/flag-ru.svg";
import kkFlag from "@/public/icons/flag-kz.svg";
import enFlag from "@/public/icons/flag-en.png";
import type { StaticImageData } from "next/image";

const options: { value: Locale; label: string; flag: StaticImageData | string }[] = [
  { value: "ru", label: "RU", flag: ruFlag },
  { value: "kk", label: "KK", flag: kkFlag },
  { value: "en", label: "EN", flag: enFlag },
];

export const LanguageDropdown = () => {
  const router = useRouter();
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
    // Re-fetch server-rendered parts in the selected locale.
    router.refresh();
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
        <Image src={options.find((o) => o.value === locale)?.flag ?? ruFlag} alt={currentLabel} width={32} height={20} style={{borderRadius: 3}}/>
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
            <ListItemText primary={<Image src={opt.flag} alt={opt.label} width={32} height={20} style={{borderRadius: 3}} />} />
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
