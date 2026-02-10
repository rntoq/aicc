"use client";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { getTestById } from "../constants";
import { useTestsStore } from "@/lib/store/testsStore";

export function TestResultModal() {
  const t = useTranslations();
  const { openResultModalId, setOpenResultModalId } = useTestsStore();
  const test = openResultModalId ? getTestById(openResultModalId) : null;
  const open = Boolean(test);

  const handleClose = () => setOpenResultModalId(null);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
      slotProps={{
        backdrop: { sx: { backdropFilter: "blur(4px)" } },
      }}
    >
      <AnimatePresence>
        {test && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>
              {t("test_resultTitle", { name: test.name })}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ py: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Краткий результат теста (placeholder). После интеграции с backend здесь будут реальные данные.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                    Совпадение с профилем
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={78}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 1,
                        background: "linear-gradient(90deg, #1E3A8A, #10B981)",
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    78%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 120,
                    borderRadius: 2,
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Визуальный график / детали результата
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleClose}
                sx={{ borderRadius: 2 }}
              >
                {t("close")}
              </Button>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
