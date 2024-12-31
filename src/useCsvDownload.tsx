import { useCallback } from "react";
import { format } from "date-fns";


function useCsvDownload<T extends Object>() {

  const makeCsvData = useCallback((values: T[], converter?: (key: string, value: T) => string): string => {
    const formatValueForCsv = (k: string, v: any) => {
      if (converter !== undefined) return converter(k, v);
      if (typeof v === 'string') return '"' + v + '"';
      if (Object.prototype.toString.call(v) === "[object Date]") return '"' + format(v, 'PP p') + '"';
      return v;
    }

    const csvheader = Object.keys(values[0]).map((k) => "#" + k).join(',') + '\n';
    const csv = values.map(
      (row) => Object.entries(row).map(([k, v]) => formatValueForCsv(k, v)).join(',')
    ).join("\n");

    return csvheader + csv;
  }, []);

  const download = useCallback((filename: string, values: T[]) => {
    if (values.length <= 0) return;

    const csv = makeCsvData(values);
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [makeCsvData]);

  return {
    download
  }
}

export default useCsvDownload;
