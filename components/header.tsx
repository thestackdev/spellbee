import { GiHamburgerMenu } from "react-icons/gi";

interface HeaderProps {
  date?: string;
  editor?: string;
  setShowMenu: () => void;
}

export default function Header(props: HeaderProps) {
  const { date, editor, setShowMenu } = props;

  return (
    <div
      className="md:p-4 flex flex-row md:justify-between w-full md:items-start justify-end "
      data-testid="header-div"
    >
      <div className="flex flex-col items-end">
        <button
          className="hover:bg-gray-100 active:bg-gray-200 text-2xl m-2 w-10 h-10 rounded-full flex items-center justify-center"
          data-testid="menu-icon"
          onClick={() => setShowMenu()}
        >
          <GiHamburgerMenu />
        </button>
      </div>
    </div>
  );
}
