"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { analyseServices } from "@/lib/services/analyseServices";

type UseReportPdfDownloadI18n = {
  downloadError: string;
  downloadSuccess: string;
};

export function useReportPdfDownload(i18n: UseReportPdfDownloadI18n) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const downloadReport = async (reportId: number, title: string) => {
    if (downloadingId !== null) return;
    setDownloadingId(reportId);
    try {
      const { body, error } = await analyseServices.downloadReportPdf(reportId);
      if (error || !body) {
        toast.error(i18n.downloadError);
        return;
      }
      const blob = new Blob([body], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(i18n.downloadSuccess);
    } finally {
      setDownloadingId(null);
    }
  };

  return {
    downloadingId,
    downloadReport,
  };
}
