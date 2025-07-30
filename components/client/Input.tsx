"use client";

interface Iprops {
  label: string;
  nameInput: string;
  type?: string;
  value: string;
  onChangeForm: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input(props: Iprops) {
  const { label, nameInput, type = "text", value, onChangeForm } = props;
  return (
    <div>
      <label
        className="mb-[6px] block text-[#222] font-medium"
        htmlFor={nameInput}
      >
        {label}
      </label>
      <input
        onChange={onChangeForm}
        className="w-full focus:outline-none focus:shadow-lg h-[40px] px-3 border border-gray-300 rounded-md"
        type={type}
        name={nameInput}
        id={nameInput}
        value={value}
      />
    </div>
  );
}
