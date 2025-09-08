"use client";

import { useState, useEffect } from "react";
import Button from "./Button";

interface Iprops {
  label: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function Modal({ label, onClose, onConfirm }: Iprops) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 z-100 transition-opacity duration-300  ${
        show ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-6 w-[400px] transform transition-all duration-300 ${
          show ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-lg font-medium">{label}</div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            className="border border-gray-300 rounded-[4px] px-2 py-1"
            onClick={handleClose}
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              if (onConfirm) onConfirm();
              handleClose();
            }}
            className="bg-green-500  px-2 py-1 text-white hover:bg-green-600 transition-colors duration-200 rounded-[4px]"
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    </div>
  );
}
