import { Button, FormLabel, IconButton, Input, InputGroup, InputRightAddon, InputRightElement, Select, VStack } from "@chakra-ui/react"
import { FC, FormEventHandler } from "react";
import { CardFilter, CardInfo, CardType, CardTypeList, CardValueTypeList } from "./CardConfig";
import { useSetState } from "react-use";
import { TbPlus } from "react-icons/tb";

type CardEditForm = {
  type: CardType;
  label: string;
  filter?: CardFilter;
}

const CardEditForm: FC = () => {
  const [form, setForm] = useSetState<CardEditForm>();
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const label = (form.get("label") || "") as string;
    const type = (form.get("type") || "count") as CardType;
    const filter = form.get("filter") || "";

    setForm({ type: type, label: label });

    alert(
      `${label} ${type}, ${filter}`
    );
  };

  return <form onSubmit={handleSubmit}>
    <VStack align={"start"} w="full">
      <FormLabel textColor={'GrayText'}>label</FormLabel>
      <Input name="label" />
      <FormLabel textColor={'GrayText'}>type</FormLabel>
      <Select name="type">
        {CardTypeList.map(r => (
          <option value={r} key={r}>{r}</option>
        ))}
      </Select>
      <FormLabel textColor={'GrayText'}>filter</FormLabel>
      <InputGroup>
        <Select name="filter">
          {CardValueTypeList.map(r => (
            <option value={r} key={r}>{r}</option>
          ))}
        </Select>

      </InputGroup>
    </VStack>
    <Button type="submit">submit</Button>
  </form>
}

export default CardEditForm;