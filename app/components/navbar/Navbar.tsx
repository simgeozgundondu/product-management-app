import HamburgerMenu from "./HamburgerMenu";
import Logo from "./Logo";
import Search from "./Search";

const Navbar = () => {
    return(
        <div className="flex items-center justify-between gap-3 md:gap-10 px-5 md:px:10 h-20 bg-orange-300 text-slate-100">
            <Logo/>
            <Search/>
            <HamburgerMenu/>
        </div>
    )
}

export default Navbar;