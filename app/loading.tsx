import { ImSpinner8 } from "react-icons/im";

export default function Spinner() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <ImSpinner8 className="animate-spin text-6xl text-primary" />
    </div>
  );
}
