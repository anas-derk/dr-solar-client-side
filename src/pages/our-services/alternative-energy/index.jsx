import Head from 'next/head';
import Header from '@/components/Header';
import { useEffect } from 'react';
import alternativeEnergyImage from "../../../../public/images/OurServices/alternative-energy.png";
import alternativeEnergyImageInRes from "../../../../public/images/OurServices/responsive/alternative-energy.png";
import data from "../../../../public/data/index";

export default function AlternativeEnergy() {

    useEffect(() => {

        let header = document.querySelector("#__next .page-header"),
            pageContent = document.querySelector(".alternative-energy-services .page-content");

        pageContent.style.minHeight = `calc(100vh - ${header.clientHeight}px)`;

    }, []);

    return (
        // Start Alternative Energy Services Page
        <div className="alternative-energy-services shared-our-services-with-styles">
            <Head>
                <title>مستر فيكس - الطاقة البديلة</title>
            </Head>
            <Header />
            {/* Start Page Content Section */}
            <section className="page-content pt-3 pb-3" style={{ backgroundImage: `url(${alternativeEnergyImage.src})` }}>
                {/* Start Container From Bootstrap */}
                <div className="container">
                    {/* Start Grid System From Bootstrap */}
                    <div className="row align-items-center">
                        <h1 className='page-title text-center mb-4'>{data.servicesData[2].name}</h1>
                        {/* Start Column */}
                        <div className="col-md-6">
                            <p className='service-explain page-content-explain p-4'>
                                {data.servicesData[2].explain}
                            </p>
                        </div>
                        {/* End Column */}
                        {/* Start Column */}
                        <div className="col-md-6">
                            <img src={alternativeEnergyImageInRes.src} alt="Image" className='image-in-responsive' />
                        </div>
                        {/* End Column */}
                    </div>
                    {/* End Grid System From Bootstrap */}
                </div>
                {/* End Container From Bootstrap */}
            </section>
            {/* End Page Content Section */}
        </div>
        // End Alternative Energy Services Page
    );
}