import Head from 'next/head';
import Header from '@/components/Header';
import { useEffect } from 'react';
import woodworkAndFurnishingsImage from "../../../../public/images/OurServices/woodwork-and-furnishings.png";
import woodworkAndFurnishingsImageInRes from "../../../../public/images/OurServices/responsive/woodwork-and-furnishings.png";
import data from "../../../../public/data/index";

export default function WoodworkAndFurnishings() {

    useEffect(() => {

        let header = document.querySelector("#__next .page-header"),
            pageContent = document.querySelector(".woodwork-and-furnishings-services .page-content");

        pageContent.style.minHeight = `calc(100vh - ${header.clientHeight}px)`;

    }, []);

    return (
        // Start Woodwork And Furnishings Services Page
        <div className="woodwork-and-furnishings-services shared-our-services-with-styles">
            <Head>
                <title>مستر فيكس - الخشبيات والمفروشات</title>
            </Head>
            <Header />
            {/* Start Page Content Section */}
            <section className="page-content pt-3 pb-3" style={{ backgroundImage: `url(${woodworkAndFurnishingsImage.src})` }}>
                {/* Start Container From Bootstrap */}
                <div className="container">
                    {/* Start Grid System From Bootstrap */}
                    <div className="row align-items-center">
                        <h1 className='page-title text-center mb-4'>{data.servicesData[3].name}</h1>
                        {/* Start Column */}
                        <div className="col-md-6">
                            <p className='service-explain page-content-explain p-4'>
                                {data.servicesData[3].explain}
                            </p>
                        </div>
                        {/* End Column */}
                        {/* Start Column */}
                        <div className="col-md-6">
                            <img src={woodworkAndFurnishingsImageInRes.src} alt="Image" className='image-in-responsive' />
                        </div>
                        {/* End Column */}
                    </div>
                    {/* End Grid System From Bootstrap */}
                </div>
                {/* End Container From Bootstrap */}
            </section>
            {/* End Page Content Section */}
        </div>
        // End Woodwork And Furnishings Services Page
    );
}