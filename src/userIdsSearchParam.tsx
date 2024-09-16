import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface IdsSearchParamAction {
  selected: string[];
  clearAll: () => void;
}

export const useIdsSearchParam = (): IdsSearchParamAction => {
  const [param, setParam] = useSearchParams();
  const selected = useMemo(() => {
    return param.getAll('id');
  }, [param]);
  const clearAll = useCallback(() => {
    param.delete('id')
    setParam(param);
  }, [param, setParam]);

  return {
    selected,
    clearAll
  };
};
