import { RxHamburgerMenu } from "react-icons/rx";

interface HamburgerMenuProps {
    onClick: () => void;
}

const HamburgerMenu = ({ onClick }: HamburgerMenuProps) => {
    return (
        <div className="relative flex pr-4" onClick={onClick}>
            <RxHamburgerMenu size={25} />
        </div>
    );
};

export default HamburgerMenu;