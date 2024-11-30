import { useCallback, useEffect } from "react";
import { Layout } from "react-grid-layout";
import { useLocalStorage, useStateWithHistory } from "react-use";

interface EditableLayoutEditor {
  layout: Layout[] | undefined;
  onLayoutChange: (l: Layout[] | undefined) => void;
  onUndo: () => void;
  onRedo: () => void;
  onInitialize: () => void;
  isInitialized: boolean;
  isUndoDisable: boolean;
  isRedoDisable: boolean;
}

function isSame(a: Layout[] | undefined, b: Layout[] | undefined): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function useEditableLayoutEditor(storedKey: string, initLayout: Layout[]): EditableLayoutEditor {
  const [storedLayout, storeLayout] = useLocalStorage<Layout[]>(storedKey, initLayout);
  const [layout, setLayout, layoutHistory] = useStateWithHistory(storedLayout);

  useEffect(() => {
    storeLayout(layout);
  }, [layout, storeLayout]);

  return {
    layout,
    isInitialized: isSame(initLayout, layout),
    isUndoDisable: layoutHistory.history.length === 0 || layoutHistory.position === 0,
    isRedoDisable: layoutHistory.history.length === 0 || (layoutHistory.position === layoutHistory.history.length - 1),
    onLayoutChange: useCallback((l: Layout[] | undefined) => {
      if (l === undefined || isSame(l, layout)) return;
      setLayout(l);
    }, [layout, setLayout]),
    onUndo: useCallback(() => {
      layoutHistory.back();
    }, [layoutHistory]),
    onRedo: useCallback(() => {
      layoutHistory.forward();
    }, [layoutHistory]),
    onInitialize: useCallback(() => {
      setLayout(initLayout);
    }, [initLayout, setLayout]),
  }
}
