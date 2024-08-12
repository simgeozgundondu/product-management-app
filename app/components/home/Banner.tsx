import Image from "next/image";

const Banner = () => {
    return (
        <div className='h-[167px] bg-customBackground flex items-center justify-center"'>
            <div className="h-[147px] relative w-full ">
                <Image src = {"/background.png"} fill alt=""/>
            </div>
        </div>
    );
};

export default Banner;