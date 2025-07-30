import React from "react";

interface IProps {
  className?: string;
  children: React.ReactNode;
  id?: number;
  onClick?: (id?: number) => void;
}

export default function Button(props: IProps) {
  const { className, children, id, onClick } = props;

  const hadleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <button
      onClick={hadleClick}
      className={`${className} cursor-pointer uppercase inline text-sm  border-2 px-4 py-2  transition-all duration-300 hover:shadow-md`}
    >
      {children}
    </button>
  );
}
