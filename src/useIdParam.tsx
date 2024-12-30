import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";


function useIdParam() {
  const [searchParams, setSearchParams] = useSearchParams();

  const id = searchParams.get('id');

  const setId = (newId: string | null) => {
    if (newId === null) {
      searchParams.delete("id");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ ...searchParams, id: newId });
    }
  };

  return { id, setId };
}

export default useIdParam;

