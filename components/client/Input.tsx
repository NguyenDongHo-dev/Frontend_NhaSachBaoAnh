"use client";

interface Iprops {
  label: string;
  nameInput: string;
  className?: string;
  type?: string;
  value: string;
  readOnly?: boolean;
  onChangeForm?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input(props: Iprops) {
  const {
    label,
    nameInput,
    type = "text",
    value,
    onChangeForm,
    className,
    readOnly,
  } = props;
  const isReadOnly = readOnly ?? (value !== undefined && !onChangeForm);
  return (
    <div>
      <label
        className="mb-[6px] block text-[#222] font-medium"
        htmlFor={nameInput}
      >
        {label}
      </label>
      <input
        readOnly={isReadOnly}
        onChange={onChangeForm}
        className={`focus:outline-none focus:shadow-lg h-[40px] px-3 border border-gray-300 rounded-md ${className} `}
        type={type}
        name={nameInput}
        id={nameInput}
        value={value}
      />
    </div>
  );
}
