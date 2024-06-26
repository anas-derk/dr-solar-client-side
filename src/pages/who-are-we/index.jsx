// استيراد المكتبات المطلوبة + صورة صفحة من نحن
import Head from 'next/head';
import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import whoAreWeImage from "../../../public/images/WhoAreWe/who-are-we.png";
import { getUserInfo } from '../../../public/global_functions/popular';
import LoaderPage from '@/components/LoaderPage';
import ErrorOnLoadingThePage from '@/components/ErrorOnLoadingThePage';

// تعريف دالة مكون من نحن
export default function WhoAreWe() {
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isErrorMsgOnLoadingThePage, setIsErrorMsgOnLoadingThePage] = useState(false);
    // تعريف دالة useEffect من أجل عمل شيء ما عند تحميل الصفحة في جانب العميل أي المتصفح
    useEffect(() => {
        if (!isLoadingPage && !isErrorMsgOnLoadingThePage) {
            // جلب بعض العناصر من صفحة الويب باستخدام الجافا سكربت
            const header = document.querySelector("#__next .page-header"),
                pageContent = document.querySelector(".who-are-we .page-content");
            // جعل أقل ارتفاع لعنصر pageContent هو عرض الصفحة المرأية كاملةً منقوصاً منها ارتفاع عنصر رأس الصفحة
            pageContent.style.minHeight = `calc(100vh - ${header.clientHeight}px)`;
        }
    }, [isLoadingPage]);
    useEffect(() => {
        const userToken = localStorage.getItem(process.env.userTokenNameInLocalStorage);
        if (userToken) {
            getUserInfo()
                .then(async (result) => {
                    setIsLoadingPage(false);
                    if (result.error) {
                        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
                    }
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
            setIsLoadingPage(false);
        }
    }, []);
    return (
        // بداية كتابة كود ال jsx لصفحة من نحن
        <div className="who-are-we shared-pages-with-styles">
            {/* بداية كتابة معلومات عنصر ال head في ال html */}
            <Head>
                <title>دكتور سولار - من نحن ؟</title>
            </Head>
            {/* نهاية كتابة معلومات عنصر ال head في ال html */}
            {!isLoadingPage && !isErrorMsgOnLoadingThePage && <>
                {/* بداية عرض مكون الرأس الذي أنشأناه */}
                <Header />
                {/* نهاية عرض مكون الرأس الذي أنشأناه */}
                {/* بداية كتابة كود ال jsx لعنصر ال html المسمى page-content */}
                <section className="page-content p-4">
                    {/* بداية مكون الحاوية من البوتستراب */}
                    <div className="container">
                        <h1 className='text-center'>من نحن</h1>
                        {/* بداية مكون الشبكة من البوتستراب */}
                        <div className="row align-items-center">
                            {/* بداية مكون العمود */}
                            <div className="col-md-6 p-4">
                                <p className='who-are-we-explain page-content-explain ps-4'>
                                    من خلال دكتور سولار نمنح مفهوم آخر وطريقة جديدة للعناية بالطاقة البديلة، هدفنا الإرتباط بعملائنا، ودائمًا نحو الأفضل لجعل حياتهم أسهل في إدارتها
                                    <br />
                                    <br />
                                    ما عليك فعله هو الدخول إلى موقعنا، اختيار الخدمة والإشتراك، وبدورنا سنقوم بمهتنا على أكمل وجه.
                                    <br />
                                    <br />
                                    نحن هنا لمساعدتك و لحماية الطاقة البديلة لديك، ولنضمن تحقيق رضاك.
                                    <br />
                                    <br />
                                    دكتور سولار مكان واحد لكافة احتياجات العناية بالطاقة البديلة من خلال هاتفك، حيث نرغب في أن نكون جزءَا في توفير الأمان والراحة بشكل دائم.
                                    <br />
                                    <br />
                                    شرح خاص بالخدمة المقدمة:
                                    <br />
                                    <br />
                                    الخدمة الأولى: فحص الأداء
                                    <br />
                                    <br />
                                    الصيانة الدورية للمنظومة المركبة لديك حيث نقوم بفحص أدائها واكتشاف فيما إذا كان هنالك خلل أو عطل ونقدم لك تقرير خاص بحالة الطاقة و التوصيات حسب نتائج الفحص ويمكن أن نقوم بعملية الصيانة حسب الإتفاق.
                                    <br />
                                    <br />
                                    الإشتراك في هذه الخدمة إما أن يكون:
                                    <br />
                                    <br />
                                    أسبوعي / فحص مرة واحدة في الأسبوع
                                    <br />
                                    شهري / فحص مرة في الشهر
                                    <br />
                                    ربع سنوي / فحص مرة كل ثلاثة أشهر
                                    <br />
                                    نصف سنوي / فحص مرة كل ستة أشهر
                                    <br />
                                    نصف سنوي / فحص مرة كل ستة أشهر
                                    <br />
                                    سنوي / فحص مرة كل سنة
                                    <br />
                                    <br />
                                    الخدمة الثانية: تنظيف الألواح
                                    <br />
                                    <br />
                                    حيث نقوم بتنظيف الألواح الشمسية بشكل دقيق ومتقن.
                                    <br />
                                    <br />
                                    الإشتراك في هذه الخدمة إما أن يكون:
                                    <br />
                                    <br />
                                    أسبوعي / تنظيف مرة واحدة في الأسبوع
                                    <br />
                                    شهري / تنظيف ثلاثة مرات في الشهر
                                    <br />
                                    ربع سنوي / تنظيف ستة مرات كل ثلاثة أشهر
                                    <br />
                                    نصف سنوي / تنظيف تسعة مرات ستة أشهر
                                    <br />
                                    نصف سنوي / فحص مرة كل ستة أشهر
                                    <br />
                                    سنوي / تنظيف إثنا عشر مرة كل سنة
                                    <br />
                                    <br />
                                    الأسعار: سيتم الاتفاق على السعر بعد طلب الإشتراك ومعرفة التفاصيل حيث ستتفاوت الأسعار حسب كل منطقة وارتفاع الطابق و عدد الألواح و عوامل أخرى
                                    <br />
                                    <br />
                                </p>
                            </div>
                            {/* نهاية مكون العمود */}
                            {/* بداية مكون العمود */}
                            <div className="col-md-6">
                                <div className='image-box text-center'>
                                    <img src={whoAreWeImage.src} alt="Who Are We Image !!" className='who-are-we-img page-img' />
                                </div>
                            </div>
                            {/* نهاية مكون العمود */}
                        </div>
                        {/* نهاية مكون الشبكة من البوتستراب */}
                    </div>
                    {/* نهاية مكون الحاوية من البوتستراب */}
                </section>
                {/* نهاية كتابة كود ال jsx لعنصر ال html المسمى page-content */}
            </>}
            {isLoadingPage && !isErrorMsgOnLoadingThePage && <LoaderPage />}
            {isErrorMsgOnLoadingThePage && <ErrorOnLoadingThePage />}
        </div>
        // نهاية كتابة كود ال jsx لصفحة من نحن
    );
}
