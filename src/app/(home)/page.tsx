import { ConsultantModal } from "../_components/ConsultantModal";
import { HomeViews } from "./_components/HomeViews";

export default function Home() {
    const diamonds = [
        {
            sku: "DDD2431907",
            name: "Natural Diamond 7.37 - 6.62 VS2-D",
            original: "$30,000",
            sale: "$26,700",
            discount: "11%",
        },
        {
            sku: "DDD2422675",
            name: "Natural Diamond 6.60 - 6.64 VVS2-D",
            original: "$11,600",
            sale: "$10,380",
            discount: "11%",
        },
        {
            sku: "DDD2412950",
            name: "Natural Diamond 6.86 - 6.90 VS1-D",
            original: "$11,100",
            sale: "$9,930",
            discount: "11%",
        },
        {
            sku: "DDD2335747",
            name: "Natural Diamond 6.51 - 6.54 VVS1-F",
            original: "$10,400",
            sale: "$9,270",
            discount: "11%",
        },
        {
            sku: "DDD2322500",
            name: "Natural Diamond 6.36 - 6.41 VVS1-F",
            original: "$10,000",
            sale: "$8,900",
            discount: "11%",
        },
        {
            sku: "DDD2420094",
            name: "Natural Diamond 6.22 - 6.24 VVS1-D",
            original: "$9,160",
            sale: "$8,150",
            discount: "11%",
        },
        {
            sku: "DDD2334760",
            name: "Natural Diamond 6.31 - 6.34 VVS2-E",
            original: "$9,160",
            sale: "$8,150",
            discount: "11%",
        },
        {
            sku: "DDD2406100",
            name: "Natural Diamond 6.50 - 6.53 VS1-E",
            original: "$7,900",
            sale: "$7,040",
            discount: "11%",
        },
    ];

    return (
        <>
            <div className="selection:bg-gold bg-white font-sans antialiased transition-colors duration-500 selection:text-black dark:bg-[#030303]">
                <ConsultantModal />
                <HomeViews diamonds={diamonds} />
            </div>
        </>
    );
}
