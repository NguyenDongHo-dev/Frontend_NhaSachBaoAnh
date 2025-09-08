"use client";

interface IProps {
  className?: string;
  children: React.ReactNode;
  id?: number;
  onClick?: (id?: number) => void;
  disabled?: boolean;
}

export default function Button(props: IProps) {
  const { className, children, id, onClick, disabled = false } = props;

  const hadleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <button
      disabled={disabled}
      onClick={hadleClick}
      className={`${className} ${
        disabled && "opacity-50 cursor-default"
      } cursor-pointer uppercase inline text-sm disabled:opacity-50 disabled:cursor-default border-2   transition-all duration-300 hover:shadow-md `}
    >
      {children}
    </button>
  );
}
