// استيراد المكتبات المطلوبة + صورة صفحة طلب الخدمة
import Head from 'next/head';
import Header from '@/components/Header';
import { Fragment, useEffect, useState } from 'react';
import { FiUserPlus } from "react-icons/fi";
import { RiFileUploadLine } from "react-icons/ri";
import Axios from "axios";
import { useRouter } from 'next/router';
import global_functions, { inputValuesValidation } from "../../../public/global_functions/validations";
import { AiOutlineClockCircle } from "react-icons/ai";
import RequestServiceImage from "../../../public/images/RequestService/request-service.png";
import { getUserInfo } from '../../../public/global_functions/popular';
import LoaderPage from '@/components/LoaderPage';
import ErrorOnLoadingThePage from '@/components/ErrorOnLoadingThePage';

// تعريف دالة صفحة طلب خدمة 
export default function ServiceRequest() {
    // تعريف المتغيرات المطلوب كــ state
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isErrorMsgOnLoadingThePage, setIsErrorMsgOnLoadingThePage] = useState(false);
    const [serviceType, setServiceType] = useState("");
    const [subType, setSubtype] = useState("");
    const [address, setAddress] = useState("");
    const [fileList1, setFileList1] = useState("");
    const [fileList2, setFileList2] = useState("");
    const [preferredDateOfVisit, setPreferredDateOfVisit] = useState("");
    const [preferredTimeOfVisit, setPreferredTimeOfVisit] = useState("");
    const [electricityTimes, setElectricityTimes] = useState("");
    const [isWishRenewSubscription, setisWishRenewSubscription] = useState("");
    const [errors, setErrors] = useState({});
    const [isRequestingStatus, setIsRequestingStatus] = useState(false);
    const [isSuccessfulyStatus, setIsSuccessfulyStatus] = useState(false);
    const [errMsg, setErrorMsg] = useState("");
    // تعريف كائن يحتوي وصف الملفات بحيث نعرض تفاصيل عنها بحسب نوع الخدمة التي يحددها المستخدم لاحقاً
    const filesCaption = {
        "طلب فحص": ["صورة الألواح الشمسية مع صورة اللصاقة الخلفية", "صورة الانفرتر مع صورة اللصاقة التي عليه"],
        "طلب تنظيف": ["صورة الألواح الشمسية"],
    }
    // تعريف راوتر لاستخدامه في التعامل مع روابط الصفحات
    const router = useRouter();
    // تعريف دالة useEffect من أجل عمل شيء ما عند تحميل الصفحة في جانب العميل أي المتصفح
    useEffect(() => {
        if (!isLoadingPage && !isErrorMsgOnLoadingThePage) {
            // جلب بعض العناصر من صفحة الويب باستخدام الجافا سكربت
            const header = document.querySelector("#__next .page-header"),
                pageContent = document.querySelector(".service-request .page-content");
            // جعل أقل ارتفاع لعنصر pageContent هو عرض الصفحة المرأية كاملةً منقوصاً منها ارتفاع عنصر رأس الصفحة
            pageContent.style.minHeight = `calc(100vh - ${header.clientHeight}px)`;
        }
    }, [isLoadingPage]);
    useEffect(() => {
        const userToken = localStorage.getItem(process.env.userTokenNameInLocalStorage);
        if (userToken) {
            getUserInfo()
                .then(async (result) => {
                    console.log(result);
                    if (!result.error) {
                        setIsLoadingPage(false);
                    } else {
                        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
                        await router.replace("/login");
                    }
                })
                .catch(async (err) => {
                    if (err?.response?.data?.msg === "Unauthorized Error") {
                        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
                        await router.replace("/login");
                    } else {
                        setIsLoadingPage(false);
                        setIsErrorMsgOnLoadingThePage(true);
                    }
                });
        } else {
            router.replace("/login");
        }
    }, []);
    // تعريف دالة إرسال طلب لطلب خدمة للباك ايند
    const serviceRequest = async (e) => {
        try {
            // منع إرسال المعلومات لنفس الصفحة
            e.preventDefault();
            // إعادة تعيين كائن الأخطاء الخاصة بالمدخلات إلى كائن فارغ لتصفير كل الأخطاء وإعادة التحقق من كل الأخطاء للمدخلات الجديدة
            setErrors({});
            // إرسال المدخلات إلى دالة inputValuesValidation للتحقق منها قبل إرسال الطلب إلى الباك ايند وتخزينها في المتغير errorsObject
            const errorsObject = inputValuesValidation(
                [
                    {
                        name: "serviceType",
                        value: serviceType,
                        rules: {
                            isRequired: {
                                msg: "عذراً ، لا يجب أن يكون الحقل فارغاً !!",
                            },
                        },
                    },
                    {
                        name: "subType",
                        value: subType,
                        rules: {
                            isRequired: {
                                msg: "عذراً ، لا يجب أن يكون الحقل فارغاً !!",
                            },
                        },
                    },
                    {
                        name: "address",
                        value: address,
                        rules: {
                            isRequired: {
                                msg: "عذراً ، لا يجب أن يكون الحقل فارغاً !!",
                            },
                        },
                    },
                    {
                        name: "fileList1",
                        value: fileList1,
                        rules: {
                            isRequired: {
                                msg: "عذراً ، لا يجب أن يكون الحقل فارغاً !!",
                            },
                            isImages: {
                                msg: "عذراً ، يجب أن يكون الملف أو الملفات صور من امتداد png أو jpg !!"
                            },
                        },
                    },
                    serviceType !== "طلب تنظيف" ?
                        {
                            name: "fileList2",
                            value: fileList2,
                            rules: {
                                isRequired: {
                                    msg: "عذراً ، لا يجب أن يكون الحقل فارغاً !!",
                                },
                                isImages: {
                                    msg: "عذراً ، يجب أن يكون الملف أو الملفات صور من امتداد png أو jpg !!"
                                },
                            },
                        } : {
                            name: "fileList2",
                            value: fileList2,
                            rules: {
                                isRequired: undefined,
                            },
                        },
                    {
                        name: "preferredDateOfVisit",
                        value: preferredDateOfVisit,
                        rules: {
                            isRequired: {
                                msg: "عذراً ، لا يجب أن يكون الحقل فارغاً !!",
                            },
                        },
                    },
                    {
                        name: "preferredTimeOfVisit",
                        value: preferredTimeOfVisit,
                        rules: {
                            isRequired: {
                                msg: "عذراً ، لا يجب أن يكون الحقل فارغاً !!",
                            },
                        },
                    },
                    {
                        name: "electricityTimes",
                        value: electricityTimes,
                        rules: {
                            isRequired: {
                                msg: "عذراً ، لا يجب أن يكون الحقل فارغاً !!",
                            },
                        },
                    },
                    {
                        name: "isWishRenewSubscription",
                        value: isWishRenewSubscription,
                        rules: {
                            isRequired: {
                                msg: "عذراً ، لا يجب أن يكون الحقل فارغاً !!",
                            },
                        },
                    },
                ]
            );
            // تخزين الأخطاء الناتجة في ال state الخاص بالأخطاء
            setErrors(errorsObject);
            // التحقق من أنّ الكائن الخاص بالأخطاء فارغ أي لا يوجد أخطاء
            // أو التحقق من كون نوع الطلب إسعافي + عدد الأخطاء هو 2 ( للدلالة على أنّ الأخطاء هي عدم وجود بيانات لتاريخ يوم الزيارة المفضل والوقت المفضل للزياة )
            if (Object.keys(errorsObject).length == 0 ||
                (serviceType === "طلب تنظيف"
                    && Object.keys(errorsObject).length == 2
                    && errorsObject["preferredDateOfVisit"] === "عذراً ، لا يجب أن يكون الحقل فارغاً !!"
                    && errorsObject["preferredTimeOfVisit"] === "عذراً ، لا يجب أن يكون الحقل فارغاً !!"
                )
            ) {
                // تعديل قيمة ال state المسماة isRequestingStatus لتصبح true من أجل استخدامه لاحقاً في إظهار رسالة انتظار
                setIsRequestingStatus(true);
                // إنشاء كائن من ال formData لتخزين بيانات الفورم قبل إرساله مع الطلب في جسم الطلب وذلك بسبب وجود ملفات
                let formData = new FormData();
                formData.append("serviceType", serviceType);
                formData.append("subType", subType);
                formData.append("address", address);
                // إضافة كل الملفات إلى ال formData
                for (let i = 0; i < fileList1.length; i++) {
                    formData.append(`file${i}`, fileList1[i]);
                }
                for (let i = 0; i < fileList2.length; i++) {
                    formData.append(`file${i}`, fileList2[i]);
                }
                // التحقق من نوع الطلب بحيث نضيف بيانات حقلي تاريخ اليوم المفضل للزيارة ووقت الزيارة المفضل في حالة نوع الطلب عادي فقط ( كون الطلب الإسعافي ليس بحاجتهم )
                if (serviceType === "طلب فحص") {
                    formData.append("preferredDateOfVisit", preferredDateOfVisit);
                    formData.append("preferredTimeOfVisit", preferredTimeOfVisit);
                }
                // إضافة باقي بيانات الحقول إلى الـ formDat
                formData.append("electricityTimes", electricityTimes);
                formData.append("isWishRenewSubscription", isWishRenewSubscription);
                // إرسال الطلب وتخزين الاستجابة في متغير
                const res = await Axios.post(`${process.env.BASE_API_URL}/requests/create-new-request`, formData, {
                    // إضافة header لتحدد نوع المحتوى ا لمراد إرساله بحيث يسمح بإرسال البيانات ضمن ال formData
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": localStorage.getItem(process.env.userTokenNameInLocalStorage)
                    }
                });
                // جلب البيانات الناتجة عن الاستجابة
                const result = await res.data;
                // التحقق من البيانات  المُرسلة كاستجابة
                if (!result.error) {
                    // تعديل قيمة ال state المسماة isRequestingStatus لتصبح false من أجل استخدامه لاحقاً في إخفاء رسالة الانتظار
                    setIsRequestingStatus(false);
                    // تعديل قيمة ال state المسماة isSuccessfulyStatus من أجل استخدامه لاحقاً في إظهار رسالة نجاح العملية
                    setIsSuccessfulyStatus(true);
                    // تعيين مؤقت ليتم تنفيذ تعليمات بعد ثانيتين
                    setTimeout(() => {
                        // تعديل قيمة ال state المسماة isSuccessfulyStatus لتصبح false من أجل استخدامه لاحقاً في إخفاء رسالة النجاح
                        setIsSuccessfulyStatus(false);
                        // تعيين مؤقت ليتم تنفيذ تعليمات بعد ثانية ونصف
                        setTimeout(() => {
                            // إعادة تحميل الصفحة من أجل حذف بيانات الحقول لإتاحة الإمكانية للمستخدم من إرسال طلب جديد إن أراد
                            router.reload();
                        }, 1500);
                    }, 2000);
                } else {
                    // تعديل قيمة ال state المسماة isRequestingStatus لتصبح false من أجل استخدامه لاحقاً في إخفاء رسالة الانتظار
                    setIsRequestingStatus(false);
                    // إعادة قيمة ال state المسماة errMsg إلى القيمة الفارغة الافتراضية من أجل استخدامها لاحقاً في إخفاء رسالة الخطأ
                    setErrorMsg(result.msg);
                    // تعيين مؤقت ليتم تنفيذ تعليمات بعد أربع ثواني
                    let errMsgTimeout = setTimeout(() => {
                        // إعادة قيمة ال state المسماة errMsg إلى القيمة الفارغة الافتراضية من أجل استخدامها لاحقاً في إخفاء رسالة الخطأ
                        setErrorMsg("");
                        // حذف المتغير الذي يحتوي المؤقت
                        clearTimeout(errMsgTimeout);
                    }, 4000);
                }
            }
        }
        catch (err) {
            if (err?.response?.data?.msg === "Unauthorized Error") {
                localStorage.removeItem(process.env.userTokenNameInLocalStorage);
                await router.replace("/login");
                return;
            }
            // طباعة رسالة الخطأ في الكونسول إن حصلت مشكلة عند إرسال الطلب للسيرفر
            setIsRequestingStatus(false);
            setErrorMsg("عذراً حدث خطا ما ، يرجى إعادة المحاولة !!");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                clearTimeout(errorTimeout);
            }, 5000);
        }
    }
    return (
        // بداية كتابة كود ال jsx لصفحة طلب الخدمة
        <div className="service-request">
            {/* بداية كتابة معلومات عنصر ال head في ال html */}
            <Head>
                <title>دكتور سولار - طلب خدمة</title>
            </Head>
            {/* نهاية كتابة معلومات عنصر ال head في ال html */}
            {!isLoadingPage && !isErrorMsgOnLoadingThePage && <>
                {/* بداية عرض مكون الرأس الذي أنشأناه */}
                <Header />
                {/* نهاية عرض مكون الرأس الذي أنشأناه */}
                {/* بداية كتابة كود ال jsx لعنصر ال html المسمى page-content */}
                <section className="page-content pt-4 pb-4">
                    {/* بداية مكون الحاوية من البوتستراب */}
                    <div className="container">
                        {/* بداية مكون الشبكة من البوتستراب */}
                        <div className="row mb-4 align-items-center text-center">
                            <div className="col-md-3">
                                <img src={RequestServiceImage.src} alt="صورة طلب خدمة !" width="135" height="135" />
                            </div>
                            <div className="col-md-6">
                                <h1 className='page-title m-0 text-center'>طلب الخدمة (الإشتراك)</h1>
                            </div>
                            <div className="col-md-3">
                                <p className='note-paragraph text-center p-2 m-0'>
                                    ملاحظة هامة: كل الشروحات التي تتعلق بالخدمة والإشتراك والأجور مذكورة في تبويبة (من نحن)
                                </p>
                            </div>
                        </div>
                        {/* نهاية مكون الشبكة من البوتستراب */}
                        <form className="service-request-form" onSubmit={serviceRequest}>
                            <select
                                // في حالة يوجد خطأ بالإدخال نجعل الحواف بلون أحمر
                                className={`form-control p-3 request-type-select ${errors["serviceType"] ? "border border-danger mb-2" : "mb-4"}`}
                                onChange={(e) => setServiceType(e.target.value)}
                            >
                                <option value="" hidden>نوع الخدمة</option>
                                <option value="طلب فحص">طلب فحص الطاقة البديلة وأدائها</option>
                                <option value="طلب تنظيف">طلب تنظيف الألواح الشمسية</option>
                            </select>
                            {/* بداية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                            {errors["serviceType"] && <p className='error-msg text-danger'>{errors["serviceType"]}</p>}
                            {/* نهاية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                            <select
                                // في حالة يوجد خطأ بالإدخال نجعل الحواف بلون أحمر
                                className={`form-control p-3 service-type-select ${errors["subType"] ? "border border-danger mb-2" : "mb-4"}`}
                                onChange={(e) => setSubtype(e.target.value)}
                            >
                                <option value="" hidden>نوع الاشتراك</option>
                                {/* عمل حلقة تكرارية على بيانات الخدمات بحيث نعرض كل أسماء الخدمات داخل option */}
                                <option value="أسبوعي">أسبوعي</option>
                                <option value="شهري">شهري</option>
                                <option value="ربع سنوي">ربع سنوي</option>
                                <option value="نصف سنوي">نصف سنوي</option>
                                <option value="سنوي">سنوي</option>
                            </select>
                            {/* بداية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                            {errors["subType"] && <p className='error-msg text-danger'>{errors["subType"]}</p>}
                            {/* نهاية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                            {/* بداية مكون الشبكة من البوتستراب */}
                            <div className="row">
                                {/* بداية مكون العمود */}
                                <div className="col-md-6">
                                    <textarea
                                        placeholder="شرح مبسط في حال كنت تواجه مشكلة أو شرح مبسط عن الطلب المرغوب ، وكذلك يمكن إضافة العنوان بالتفصيل في حالة إختلافه عن العنوان المسجل"
                                        // في حالة يوجد خطأ بالإدخال نجعل الحواف بلون أحمر
                                        className={`form-control p-3 explain-and-new-address ${errors["address"] ? "border border-danger mb-2" : "mb-4"}`}
                                        onChange={(e) => setAddress(e.target.value)}
                                    ></textarea>
                                    {/* بداية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                    {errors["address"] && <p className='error-msg text-danger'>{errors["address"]}</p>}
                                    {/* نهاية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                    {/* عرض حقل رفع الملفات فقط عندما يختار المستخدم نوع الخدمة وبناءً على نوع الخدمة يظهر له وصف الملفات المراد رفعها وعدد الحقول */}
                                    {serviceType !== "" && subType !== "" && filesCaption[serviceType].map((el, index) => (
                                        <Fragment key={index}>
                                            {/* في حالة يوجد خطأ بالإدخال نجعل الحواف بلون أحمر */}
                                            <div className={`file-box form-control p-3 ${errors[`fileList${index + 1}`] ? "border border-danger mb-2" : "mb-4"}`}>
                                                <label htmlFor={`file${index + 1}`} className='file-label d-flex justify-content-between'>
                                                    <p className='caption'>{el}</p>
                                                    <RiFileUploadLine className="upload-file-icon" />
                                                </label>
                                                <input
                                                    type="file"
                                                    id={`file${index + 1}`}
                                                    onChange={(e) => index == 0 ? setFileList1(e.target.files) : setFileList2(e.target.files)}
                                                    multiple
                                                />
                                            </div>
                                            {/* بداية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                            {errors[`fileList${index + 1}`] && <p className='error-msg text-danger'>{errors[`fileList${index + 1}`]}</p>}
                                            {/* نهاية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                        </Fragment>
                                    ))}
                                </div>
                                {/* نهاية مكون العمود */}
                                {/* بداية مكون العمود */}
                                <div className="col-md-6">
                                    {/* في حالة الطلب غير إسعافي عرض الحقول التالية */}
                                    {serviceType !== "طلب تنظيف" && <>
                                        <input
                                            type="text"
                                            placeholder="تواريخ الأيام المفضلة لزيارة الورشة الفاحصة"
                                            // في حالة يوجد خطأ بالإدخال نجعل الحواف بلون أحمر
                                            className={`form-control p-3 ${errors["preferredDateOfVisit"] ? "border border-danger mb-2" : "mb-4"}`}
                                            onChange={(e) => setPreferredDateOfVisit(e.target.value)}
                                        />
                                        {/* بداية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                        {errors["preferredDateOfVisit"] && <p className='error-msg text-danger'>{errors["preferredDateOfVisit"]}</p>}
                                        {/* نهاية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                        <input
                                            type="text"
                                            placeholder="الأوقات المفضلة لزيارة الورشة الفاحصة"
                                            // في حالة يوجد خطأ بالإدخال نجعل الحواف بلون أحمر
                                            className={`form-control p-3 ${errors["preferredTimeOfVisit"] ? "border border-danger mb-2" : "mb-4"}`}
                                            onChange={(e) => setPreferredTimeOfVisit(e.target.value)}
                                        />
                                        {/* بداية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                        {errors["preferredTimeOfVisit"] && <p className='error-msg text-danger'>{errors["preferredTimeOfVisit"]}</p>}
                                        {/* نهاية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                    </>}
                                    <input
                                        type="text"
                                        placeholder="أوقات الكهرباء النظامية"
                                        // في حالة يوجد خطأ بالإدخال نجعل الحواف بلون أحمر
                                        className={`form-control p-3 ${errors["electricityTimes"] ? "border border-danger mb-2" : "mb-4"}`}
                                        onChange={(e) => setElectricityTimes(e.target.value)}
                                    />
                                    {/* بداية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                    {errors["electricityTimes"] && <p className='error-msg text-danger'>{errors["electricityTimes"]}</p>}
                                    {/* نهاية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                    <select
                                        // في حالة يوجد خطأ بالإدخال نجعل الحواف بلون أحمر
                                        className={`form-control p-3 ${errors["isWishRenewSubscription"] ? "border border-danger mb-2" : "mb-4"}`}
                                        onChange={(e) => setisWishRenewSubscription(e.target.value)}
                                    >
                                        <option value="" hidden>هل ترغب بتجديد الاشتراك تلقائياً ؟</option>
                                        <option value="yes">نعم</option>
                                        <option value="no">لا</option>
                                    </select>
                                    {/* بداية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                    {errors["isWishRenewSubscription"] && <p className='error-msg text-danger'>{errors["isWishRenewSubscription"]}</p>}
                                    {/* نهاية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                </div>
                                {/* نهاية مكون العمود */}
                            </div>
                            {/* نهاية مكون الشبكة من البوتستراب */}
                            {/* في حالة لم يكن لدينا حالة إنشاء طلب في الانتظار ولا يوجد أي خطأ أو حالة نجاح نظهر المكون التالي */}
                            {!isRequestingStatus && !errMsg && !isSuccessfulyStatus && <button type='submit' className='btn service-request-btn w-50 p-3 mx-auto d-block'>
                                <span className='ms-2'>إرسال</span>
                                <FiUserPlus />
                            </button>}
                            {/* في حالة لم يكن لدينا حالة إنشاء طلب في الانتظار ولا يوجد أي خطأ أو حالة نجاح نظهر المكون التالي */}
                            {/* في حالة كان لدينا حالة إنشاء الطلب في الانتظار نظهر المكون التالي */}
                            {isRequestingStatus && <button className='btn wait-requesting-btn w-50 p-3 mt-4 mx-auto d-block' disabled>
                                <span className='ms-2'>جاري الطلب ...</span>
                                <AiOutlineClockCircle />
                            </button>}
                            {/* في حالة كان لدينا حالة إنشاء الطلب في الانتظار نظهر المكون التالي */}
                            {/* في حالة كان لدينا حالة النجاح نظهر المكون التالي */}
                            {isSuccessfulyStatus && <button className='btn btn-success requesting-successfuly-btn w-50 p-3 mt-4 mx-auto d-block' disabled>
                                <span className='ms-2'>تمّ طلب الخدمة بنجاح</span>
                            </button>}
                            {/* في حالة كان لدينا حالة النجاح نظهر المكون التالي */}
                            {/* في حالة كان لدينا خطأ نظهر المكون التالي */}
                            {errMsg && <button className='btn btn-danger error-btn w-50 p-3 mt-4 mx-auto d-block' disabled>
                                {errMsg}
                            </button>}
                            {/* في حالة كان لدينا خطأ نظهر المكون التالي */}
                        </form>
                    </div>
                    {/* نهاية مكون الحاوية من البوتستراب */}
                </section>
                {/* نهاية كتابة كود ال jsx لعنصر ال html المسمى page-content */}
            </>}
            {isLoadingPage && !isErrorMsgOnLoadingThePage && <LoaderPage />}
            {isErrorMsgOnLoadingThePage && <ErrorOnLoadingThePage />}
        </div>
        // نهاية كتابة كود ال jsx لصفحة طلب الخدمة
    );
}