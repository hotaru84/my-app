import { useCallback } from "react";
import { Layout } from "react-grid-layout";
import { useLocalStorage } from "react-use";

interface EditableLayoutEditor {
  layout: Layout[] | undefined;
  onLayoutChange: (l: Layout[] | undefined) => void;
  onInitialize: () => void;
}

export function useEditableLayoutEditor(storedKey: string, initLayout: Layout[]): EditableLayoutEditor {
  const [layout, onLayoutChange] = useLocalStorage<Layout[]>(storedKey, initLayout);

  return {
    layout,
    onLayoutChange,
    onInitialize: useCallback(() => {
      onLayoutChange(initLayout);
    }, [initLayout, onLayoutChange]),
  }
}
