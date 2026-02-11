import { useState } from "react";
import { FiEyeOff } from "react-icons/fi";
import { FaEye } from "react-icons/fa";

type PasswordInputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
};

const PasswordInput = ({
  value,
  onChange,
  placeholder,
}: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          rounded-lg
          bg-zinc-800
          border border-white/10
          px-4 pr-12
          py-2
          text-sm
          focus:outline-none
          focus:ring-1
          focus:ring-yellow-500
        "
      />

      {/* Divider */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-px bg-white/10" />

      {/* Eye Toggle */}
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-zinc-400
          hover:text-yellow-400
          transition
        "
      >
        {show ? <FiEyeOff size={18} /> : <FaEye size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;
