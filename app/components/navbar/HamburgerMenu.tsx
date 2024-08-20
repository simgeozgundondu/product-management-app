import { RxHamburgerMenu } from "react-icons/rx";

interface HamburgerMenuProps {
    onClick: () => void;
}

const HamburgerMenu = ({ onClick }: HamburgerMenuProps) => {
    return (
        <div className="relative flex pr-4 text-black" onClick={onClick}>
            <RxHamburgerMenu size={26} />
        </div>
    );
};

export default HamburgerMenu;
