import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface IdSearchParamAction {
  selected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  onToggle: () => void;
}

export const useIdSearchParam = (id: string): IdSearchParamAction => {
  const [param, setParam] = useSearchParams();
  const selected = useMemo(() => {
    return param.getAll('id').find((p) => p === id) !== undefined
  }, [id, param]);
  const onSelect = useCallback(() => {
    param.append('id', id);
    setParam(param);
  }, [id, param, setParam]);

  const onDeselect = useCallback(() => {
    param.set('id', param.getAll('id').filter((p) => p !== id).join('&'));
    setParam(param);
  }, [id, param, setParam]);

  const onToggle = useCallback(() => {
    if (selected) onDeselect();
    else onSelect();
  }, [onDeselect, onSelect, selected]);

  return {
    selected,
    onSelect,
    onDeselect,
    onToggle
  };
};
