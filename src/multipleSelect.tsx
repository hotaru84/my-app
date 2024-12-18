import { CreatableSelect, GroupBase } from "chakra-react-select"
import { FC } from "react"

type SelectableItems = {
  value: string | number;
  label: string;
}
interface SingleProps {
  selected?: SelectableItems;
  onSelect?: (items?: SelectableItems) => void;
  selectableItems?: SelectableItems[];
}
interface MultipleProps {
  selected?: SelectableItems;
  onSelect?: (items?: SelectableItems[]) => void;
  selectableItems?: SelectableItems[];
}

export const SingleSelect: FC<SingleProps> = ({ selected, selectableItems, onSelect }) => {

  return <CreatableSelect<SelectableItems, false, GroupBase<SelectableItems>>
    value={selected}
    options={selectableItems}
    onChange={(v) => { onSelect !== undefined && onSelect(v as SelectableItems); }}
  />
}
export const MultipleSelect: FC<MultipleProps> = ({ selected, selectableItems, onSelect }) => {

  return <CreatableSelect<SelectableItems, true, GroupBase<SelectableItems>>
    isMulti
    value={selected}
    options={selectableItems}
    onChange={(v) => { onSelect !== undefined && onSelect(v as SelectableItems[]); }}
  />
}