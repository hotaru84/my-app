import { useDisclosure } from "@chakra-ui/react";
import { useState, useMemo, useCallback } from "react";

interface ZoomHookReturn {
  isZoom: boolean;
  isNotEnd: boolean;
  min: number;
  max: number;
  isInZoomRange: (x: number) => boolean;
  onToggleZoom: () => void;
  setZoomStart: (value: number) => void;
  setZoomEnd: (value: number) => void;
  resetZoom: () => void;
}

export function useChartZoom(defaultIsZoom?: boolean): ZoomHookReturn {
  const [zoomStart, setZoomStart] = useState<number>(0);
  const [zoomEnd, setZoomEnd] = useState<number>(0);
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: defaultIsZoom });

  const min = useMemo(() => {
    return Math.min(zoomStart, zoomEnd);
  }, [zoomEnd, zoomStart]);

  const max = useMemo(() => {
    return Math.max(zoomStart, zoomEnd);
  }, [zoomEnd, zoomStart]);


  const isNotEnd = useMemo(() => {
    return zoomEnd === 0;
  }, [zoomEnd]);

  const isInZoomRange = useCallback((x: number) => {
    return min > 0 && max > 0 && x >= min && x <= max;
  }, [max, min]);


  const resetZoom = useCallback(() => {
    setZoomStart(0);
    setZoomEnd(0);
  }, []);

  const onToggleZoom = useCallback(() => {
    resetZoom();
    onToggle();
  }, [onToggle, resetZoom]);

  return {
    isZoom: isOpen,
    isNotEnd,
    min,
    max,
    isInZoomRange,
    onToggleZoom,
    setZoomStart,
    setZoomEnd,
    resetZoom,
  }
}