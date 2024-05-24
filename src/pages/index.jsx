// استيراد المكتبات المطلوبة + الصور الخاصة بالصفحة الرئيسية
import Head from 'next/head';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import sliderImage1 from "../../public/images/Home/slider1.png";
import sliderImage2 from "../../public/images/Home/slider2.png";
import sliderImage3 from "../../public/images/Home/slider3.png";
import Link from 'next/link';
import Carousel from 'react-bootstrap/Carousel';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { getAdsCount, getAllAdsInsideThePage, getUserInfo } from '../../public/global_functions/popular';
import LoaderPage from '@/components/LoaderPage';
import ErrorOnLoadingThePage from '@/components/ErrorOnLoadingThePage';

// تعريف دالة الصفحة الرئيسية 
export default function Home({ result }) {
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isErrorMsgOnLoadingThePage, setIsErrorMsgOnLoadingThePage] = useState(false);
    const [token, setToken] = useState("");
    const [allAdsInsideThePage, setAllAdsInsideThePage] = useState([]);
    const pageSize = 5;
    // تعريف دالة ال useEffect لعمل أشياء ما عند تحميل الصفحة
    useEffect(() => {
        if (!isLoadingPage && !isErrorMsgOnLoadingThePage) {
            // جلب بعض العناصر من صفحة الويب باستخدام الجافا سكربت
            const header = document.querySelector("#__next .page-header"),
                pageContent = document.querySelector(".home .page-content"),
                ads = document.querySelector(".home .ads"),
                introduction = document.querySelector(".home .introduction");
            // جعل أقل ارتفاع لعنصر pageContent هو عرض الصفحة المرأية كاملةً منقوصاً منها ارتفاع عنصر رأس الصفحة
            pageContent.style.minHeight = `calc(100vh - ${header.clientHeight}px)`;
            // جعل أقل ارتفاع لعنصر introduction هو عرض الصفحة المرأية كاملةً منقوصاً منها ارتفاع عنصر رأس الصفحة + ارتفاع عنصر الإعلانات
            introduction.style.minHeight = `calc(100vh - (${header.clientHeight}px + ${ads.clientHeight}px))`;
        }
    }, [isLoadingPage]);
    useEffect(() => {
        const userToken = localStorage.getItem(process.env.userTokenNameInLocalStorage);
        if (userToken) {
            getUserInfo()
                .then(async (result) => {
                    if (result.error) {
                        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
                    } else {
                        setToken(userToken);
                    }
                    result = await getAdsCount();
                    if (result.data > 0) {
                        setAllAdsInsideThePage((await getAllAdsInsideThePage(1, pageSize)).data);
                    }
                    setIsLoadingPage(false);
                })
                .catch(async (err) => {
                    setIsLoadingPage(false);
                    if (err?.response?.data?.msg === "Unauthorized Error") {
                        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
                    } else {
                        setIsErrorMsgOnLoadingThePage(true);
                    }
                });
        } else {
            getAdsCount()
                .then(async (result) => {
                    if (result.data > 0) {
                        setAllAdsInsideThePage((await getAllAdsInsideThePage(1, pageSize)).data);
                    }
                    setIsLoadingPage(false);
                })
                .catch(() => {
                    setIsLoadingPage(false);
                    setIsErrorMsgOnLoadingThePage(true);
                });
        }
    }, []);
    return (
        // بداية كتابة كود ال jsx للصفحة الرئيسية
        <div className="home">
            {/* بداية كتابة معلومات عنصر ال head في ال html */}
            <Head>
                <title>دكتور سولار - الصفحة الرئيسية</title>
            </Head>
            {/* نهاية كتابة معلومات عنصر ال head في ال html */}
            {!isLoadingPage && !isErrorMsgOnLoadingThePage && <>
                {/* بداية عرض مكون الرأس الذي أنشأناه */}
                <Header />
                {/* نهاية عرض مكون الرأس الذي أنشأناه */}
                {/* بداية كتابة كود ال jsx لعنصر ال html المسمى page-content */}
                <div className="page-content pb-3">
                    {/* بداية كتابة كود ال jsx عنصر الإعلانات */}
                    <section className="ads text-center p-3">
                        {allAdsInsideThePage.length === 0 && <p className='m-0'>شريط الإعلانات</p>}
                        {allAdsInsideThePage.length > 0 && <Carousel indicators={false} controls={false}>
                            {allAdsInsideThePage.map((ad, index) => (
                                <Carousel.Item key={index}>
                                    <Carousel.Caption>
                                        <Link href="/ads" className='text-white'>
                                            <p className='ads-content'>{ad.content}</p>
                                        </Link>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        }
                    </section>
                    {/* نهاية كتابة كود ال jsx عنصر الإعلانات */}
                    {/* بداية كتابة كود ال jsx عنصر المدخل */}
                    <section className="introduction">
                        {/* بداية كتابة كود ال jsx عنصر السلايدر */}
                        <Carousel
                            indicators={false}
                            controls={true}
                            prevIcon={<IoIosArrowBack className='slider-control-icon arrow-left-icon' />}
                            nextIcon={<IoIosArrowForward className='slider-control-icon arrow-right-icon' />}
                        >
                            <Carousel.Item>
                                <Carousel.Caption>
                                    <div className="container">
                                        {/* بداية مكون الشبكة من البوتستراب */}
                                        <div className="row align-items-center justify-content-center">
                                            {/* بداية مكون العمود */}
                                            <div className="col-md-5 content-box">
                                                <div className='slider-content-explain text-center'>
                                                    <p className='pe-2 ps-2 exeption-paragraph'>دعنا نساعدك في إنقاذ الطاقة البديلة لديك من الضياع والتشتت وهدر الطاقة من خلال الصيانة الدورية والتنظيف </p>
                                                </div>
                                            </div>
                                            {/* نهاية مكون العمود */}
                                            {/* بداية مكون العمود */}
                                            <div className="col-md-7 image-box image-box1">
                                                <p className='text-center home-paragraph'>الطاقة من أهم الأشياء التي نعتمد عليها في حياتنا</p>
                                                <img src={sliderImage1.src} alt="Slider Image 1" className='slider-image slider-image-1' />
                                            </div>
                                            {/* نهاية مكون العمود */}
                                        </div>
                                        {/* نهاية مكون الشبكة من البوتستراب */}
                                    </div>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <Carousel.Caption>
                                    <div className="container">
                                        {/* بداية مكون الشبكة من البوتستراب */}
                                        <div className="row align-items-center">
                                            {/* بداية مكون العمود */}
                                            <div className="col-md-5 content-box custom-mobile">
                                                <div className='slider-content-explain text-center'>
                                                    <p>نسبة و مستوى الاتساخ والظل المؤقت والدائم، كلها عوامل ناتجة عن مصادر متنوعة  مثل فضلات الطيور والغبار والانبعاثات وكذلك مكان التركيب الخاطىء</p>
                                                </div>
                                            </div>
                                            {/* نهاية مكون العمود */}
                                            {/* بداية مكون العمود */}
                                            <div className="col-md-7 image-box image-box2">
                                                <p className='home-paragraph'>يتحسّن أداء ألواح الطاقة الشمسية عندما تكون نظيفة</p>
                                                <img src={sliderImage2.src} alt="Slider Image 2" className='slider-image slider-image-2 ' />
                                            </div>
                                            {/* نهاية مكون العمود */}
                                        </div>
                                        {/* نهاية مكون الشبكة من البوتستراب */}
                                    </div>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <Carousel.Caption>
                                    <div className="container">
                                        {/* بداية مكون الشبكة من البوتستراب */}
                                        <div className="row align-items-center">
                                            {/* بداية مكون العمود */}
                                            <div className="col-md-5 content-box">
                                                <div className='slider-content-explain text-center'>
                                                    <p className='exeption-paragraph-3'>نبسط الأمور، ونرغب في أن نكون جزءَ في تخفيف الأعباء وتوفير الأمان والراحة حيث معًا سنعمل على صيانة الطاقة والمحافظة عليها من خلال موقع بسيط</p>
                                                </div>
                                            </div>
                                            {/* نهاية مكون العمود */}
                                            {/* بداية مكون العمود */}
                                            <div className="col-md-7 image-box image-box3">
                                                <p className='home-paragraph'>اعتني بالطاقة لديك من خلال هاتفك</p>
                                                <img src={sliderImage3.src} alt="Slider Image 3" className='slider-image slider-image-3' />
                                            </div>
                                            {/* نهاية مكون العمود */}
                                        </div>
                                        {/* نهاية مكون الشبكة من البوتستراب */}
                                    </div>
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>
                        {/* نهاية كتابة كود ال jsx عنصر السلايدر */}
                        {/* بداية كتابة كود ال jsx عنصر الرابط الخاص بصفحة إنشاء حساب */}
                        {/* نعرضه في حالة لم يكن يوجد معرّف للمستخدم */}
                        {!token && <Link href="/sign-up" className='d-block btn start-with-us-btn mt-3 mx-auto pt-3 pb-3 pe-5 ps-5'>
                            <span>اشترك الآن</span>
                        </Link>}
                        {/* نهاية كتابة كود ال jsx عنصر الرابط الخاص بصفحة إنشاء حساب */}
                        {/* بداية كتابة كود ال jsx عنصر الرابط الخاص بصفحة طلب خدمة */}
                        {token && <Link className='d-block btn service-request-btn mt-3 mx-auto pt-3 pb-3' href="/service-request">
                            <span className='ms-2'>طلب الخدمة ( الاشتراك )</span>
                        </Link>}
                        {/* نهاية كتابة كود ال jsx عنصر الرابط الخاص بصفحة طلب خدمة */}
                    </section>
                    {/* نهاية كتابة كود ال jsx عنصر المدخل */}
                </div>
                {/* نهاية كتابة كود ال jsx لعنصر ال html المسمى page-content */}
            </>}
            {isLoadingPage && !isErrorMsgOnLoadingThePage && <LoaderPage />}
            {isErrorMsgOnLoadingThePage && <ErrorOnLoadingThePage />}
        </div >
        // نهاية كتابة كود ال jsx للصفحة الرئيسية
    );
}