import type { ChangeEvent } from "react";

interface FormRowProps {
  type: string;
  name: string;
  labelText?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FormRow = ({
  type,
  name,
  labelText,
  defaultValue = "",
  onChange,
}: FormRowProps) => {
  return (
    <div className="form-row w-full flex flex-col items-start space-y-1">
      <input
        type={type}
        id={name}
        name={name}
        onChange={onChange}
        className="w-full border-b-2 border-black bg-transparent text-black text-lg placeholder-transparent focus:outline-none focus:border-blue-400 py-2"
        placeholder={labelText || name}
        defaultValue={defaultValue}
        required
      />
    </div>
  );
};

export default FormRow;
