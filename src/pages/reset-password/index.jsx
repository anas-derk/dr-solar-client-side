// استيراد المكتبات المطلوبة + صورة صفحة إعادة ضبط كلمة السر
import Head from 'next/head';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import ResetPasswordImage from "../../../public/images/ResetPassword/reset-password.png";
import { AiOutlineClockCircle, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import global_functions from '../../../public/global_functions/validations';
import Axios from 'axios';
import { useRouter } from 'next/router';

// تعريف دالة صفحة إعادة ضبط كلمة السر 
export default function ResetPassword() {
    // تعريف المتغيرات المطلوب كــ state
    const [typedUserCode, setTypedUserCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newConfirmPassword, setNewConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isResetingPasswordStatus, setIsResetingPasswordStatus] = useState(false);
    const [isSuccessfulyStatus, setIsSuccessfulyStatus] = useState(false);
    const [tempResetPasswordData, setTempResetPasswordData] = useState("");
    const [errMsg, setErrorMsg] = useState("");
    const [isVisiblePassword, setIsVisiblePassword] = useState(false);
    const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] = useState(false);
    // تعريف راوتر لاستخدامه في التعامل مع روابط الصفحات
    const router = useRouter();
    // تعريف دالة useEffect من أجل عمل شيء ما عند تحميل الصفحة في جانب العميل أي المتصفح
    useEffect(() => {
        // جلب بعض العناصر من صفحة الويب باستخدام الجافا سكربت
        const header = document.querySelector("#__next .page-header"),
            pageContent = document.querySelector(".reset-password .page-content");
        // جعل أقل ارتفاع لعنصر pageContent هو عرض الصفحة المرأية كاملةً منقوصاً منها ارتفاع عنصر رأس الصفحة
        pageContent.style.minHeight = `calc(100vh - ${header.clientHeight}px)`;
        // جلب البيانات المطلوبة لإعادة ضبط كلمة السر من التخزين المحلي
        const tempResetPasswordData = JSON.parse(localStorage.getItem("mr-fix-temp-reset-password-data"));
        // التحقق من كون البيانات موجودة فعلاً
        if (tempResetPasswordData) {
            // في حالة البيانات موجودة نخزنها كــ state
            setTempResetPasswordData(tempResetPasswordData);
        } else {
            // في حالة لم تكن موجودة نقوم بإعادة التوجيه لصفحة نسيت كلمة السر
            router.push("/forget-password");
        }
    }, []);
    // تعريف دالة إرسال طلب للباك ايند لإعادة ضبط كلمة السر
    const resetPassword = async (e) => {
        // منع إرسال المعلومات لنفس الصفحة
        e.preventDefault();
        // إعادة تعيين كائن الأخطاء الخاصة بالمدخلات إلى كائن فارغ لتصفير كل الأخطاء وإعادة التحقق من كل الأخطاء للمدخلات الجديدة
        setErrors({});
        // إرسال المدخلات إلى دالة inputValuesValidation للتحقق منها قبل إرسال الطلب إلى الباك ايند وتخزينها في المتغير errorsObject
        const errorsObject = global_functions.inputValuesValidation(
            [
                {
                    name: "typedUserCode",
                    value: typedUserCode,
                    rules: {
                        isRequired: {
                            msg: "عذراً ، لا يجب أن يكون الحقل فارغاً !!",
                        },
                        isMatch: {
                            value: tempResetPasswordData.code,
                            msg: "عذراً الرمز غير صحيح !!",
                        },
                    },
                },
                {
                    name: "newPassword",
                    value: newPassword,
                    rules: {
                        isRequired: {
                            msg: "عذراً ، لا يجب أن يكون الحقل فارغاً !!",
                        },
                        isValidPassword: {
                            value: newPassword,
                            msg: "عذراً ، يجب أن تكون كلمة السر تحتوي على الأقل 8 حروف أو أرقام أو كلاهما.",
                        },
                    },
                },
                {
                    name: "newConfirmPassword",
                    value: newConfirmPassword,
                    rules: {
                        isRequired: {
                            msg: "عذراً ، لا يجب أن يكون الحقل فارغاً !!",
                        },
                        isMatch: {
                            value: newPassword,
                            msg: "عذراً ، لا يوجد تطابق بين كلمة السر وتأكيدها !!",
                        },
                    },
                },
            ]
        );
        // تخزين الأخطاء الناتجة في ال state الخاص بالأخطاء
        setErrors(errorsObject);
        // التحقق من أنّ الكائن الخاص بالأخطاء فارغ أي لا يوجد أخطاء
        if (Object.keys(errorsObject).length == 0) {
            // تعديل قيمة ال state المسماة isResetingPasswordStatus لتصبح true من أجل استخدامه لاحقاً في إظهار رسالة انتظار
            setIsResetingPasswordStatus(true);
            // بداية محاولة إرسال الطلب
            try {
                // إرسال الطلب وتخزين الاستجابة في متغير
                const res = await Axios.put(`${process.env.BASE_API_URL}/users/reset-password/${tempResetPasswordData.userIdAndType.userId}?userType=${tempResetPasswordData.userIdAndType.userType}&newPassword=${newPassword}`);
                // جلب البيانات الناتجة عن الاستجابة
                const result = await res.data;
                // التحقق من البيانات  المُرسلة كاستجابة
                if (result === "لقد تمّت عملية إعادة تعيين كلمة المرور الخاصة بك بنجاح !!") {
                    // تعيين مؤقت ليتم تنفيذ تعليمات بعد ثانيتين
                    let resetPasswordStatusTimeout = setTimeout(() => {
                        // تعديل قيمة ال state المسماة isResetingPasswordStatus لتصبح false من أجل استخدامه لاحقاً في إخفاء رسالة الانتظار
                        setIsResetingPasswordStatus(false);
                        // تعديل قيمة ال state المسماة isSuccessfulyStatus من أجل استخدامه لاحقاً في إظهار رسالة نجاح العملية
                        setIsSuccessfulyStatus(true);
                        // تعيين مؤقت ليتم تنفيذ تعليمات بعد ثانيتين ونصف
                        let successStatusTimeout = setTimeout(() => {
                            // حذف المتغيرات التي تحتوي المؤقتات
                            clearTimeout(resetPasswordStatusTimeout);
                            clearTimeout(successStatusTimeout);
                            // إعادة تحميل الصفحة من أجل تسجيل الدخول
                            router.push("/login");
                        }, 2500);
                    }, 2000);
                } else {
                    // تعديل قيمة ال state المسماة isResetingPasswordStatus لتصبح false من أجل استخدامه لاحقاً في إخفاء رسالة الانتظار
                    setIsResetingPasswordStatus(false);
                    // إعادة قيمة ال state المسماة errMsg إلى القيمة الفارغة الافتراضية من أجل استخدامها لاحقاً في إخفاء رسالة الخطأ
                    setErrorMsg(result);
                    // تعيين مؤقت ليتم تنفيذ تعليمات بعد أربع ثواني
                    let errMsgTimeout = setTimeout(() => {
                        // إعادة قيمة ال state المسماة errMsg إلى القيمة الفارغة الافتراضية من أجل استخدامها لاحقاً في إخفاء رسالة الخطأ
                        setErrorMsg("");
                        // حذف المتغير الذي يحتوي المؤقت
                        clearTimeout(errMsgTimeout);
                    }, 4000);
                }
            } catch (err) {
                // طباعة رسالة الخطأ في الكونسول إن حصلت مشكلة عند إرسال الطلب للسيرفر
                setErrorMsg(err);
            }
        }
    }
    return (
        // بداية كتابة كود ال jsx لصفحة إعادة ضبط كلمة السر
        <div className="reset-password shared-pages-with-styles">
            {/* بداية كتابة معلومات عنصر ال head في ال html */}
            <Head>
                <title>دكتور سولار - إعادة تعيين كلمة السر</title>
            </Head>
            {/* نهاية كتابة معلومات عنصر ال head في ال html */}
            {/* بداية عرض مكون الرأس الذي أنشأناه */}
            <Header />
            {/* نهاية عرض مكون الرأس الذي أنشأناه */}
            {/* بداية كتابة كود ال jsx لعنصر ال html المسمى page-content */}
            <div className="page-content pt-4 pb-4">
                {/* بداية مكون الحاوية من البوتستراب */}
                <div className="container">
                    {/* بداية مكون الشبكة من البوتستراب */}
                    <div className="row align-items-center">
                        {/* بداية مكون العمود */}
                        <div className="col-md-6 p-4 reset-password-form-box">
                            {/* بداية كتابة كود ال jsx لعنصر ال html المسمى reset-password-form */}
                            <form
                                className="reset-password-form p-4 text-center"
                                onSubmit={resetPassword}
                            >
                                <h4 className='mb-4 welcome-msg'>إعادة تعيين كلمة السر !</h4>
                                <input
                                    type="text"
                                    placeholder="أدخل الكود"
                                    // في حالة يوجد خطأ بالإدخال نجعل الحواف بلون أحمر
                                    className={`form-control p-3 ${errors["typedUserCode"] ? "border border-danger mb-2" : "mb-4"}`}
                                    onChange={(e) => setTypedUserCode(e.target.value.trim())}
                                />
                                {/* بداية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                {errors["typedUserCode"] && <p className='error-msg text-danger'>{errors["typedUserCode"]}</p>}
                                {/* نهاية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                <div className='password-field-box'>
                                    <input
                                        type={isVisiblePassword ? "text" : "password"}
                                        placeholder="كلمة السر الجديدة"
                                        // في حالة يوجد خطأ بالإدخال نجعل الحواف بلون أحمر
                                        className={`form-control p-3 ${errors["newPassword"] ? "border border-danger mb-2" : "mb-4"}`}
                                        onChange={(e) => setNewPassword(e.target.value.trim())}
                                    />
                                    <div className='icon-box'>
                                        {!isVisiblePassword && <AiOutlineEye className='eye-icon icon' onClick={() => setIsVisiblePassword(value => value = !value)} />}
                                        {isVisiblePassword && <AiOutlineEyeInvisible className='invisible-eye-icon icon' onClick={() => setIsVisiblePassword(value => value = !value)} />}
                                    </div>
                                </div>
                                {/* بداية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                {errors["newPassword"] && <p className='error-msg text-danger'>{errors["newPassword"]}</p>}
                                {/* نهاية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                <div className='confirm-password-field-box'>
                                    <input
                                        type={isVisibleConfirmPassword ? "text" : "password"}
                                        placeholder="تأكيد كلمة السر الجديدة"
                                        // في حالة يوجد خطأ بالإدخال نجعل الحواف بلون أحمر
                                        className={`form-control p-3 ${errors["newConfirmPassword"] ? "border border-danger mb-2" : "mb-4"}`}
                                        onChange={(e) => setNewConfirmPassword(e.target.value.trim())}
                                    />
                                    <div className='icon-box'>
                                        {!isVisibleConfirmPassword && <AiOutlineEye className='eye-icon icon' onClick={() => setIsVisibleConfirmPassword(value => value = !value)} />}
                                        {isVisibleConfirmPassword && <AiOutlineEyeInvisible className='invisible-eye-icon icon' onClick={() => setIsVisibleConfirmPassword(value => value = !value)} />}
                                    </div>
                                </div>
                                {/* بداية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                {errors["newConfirmPassword"] && <p className='error-msg text-danger'>{errors["newConfirmPassword"]}</p>}
                                {/* نهاية رسالة الخطأ بالإدخال للمُدخل المحدد */}
                                {/* في حالة لم يكن لدينا حالة إنشاء طلب إعادة تعيين كملة السر في الانتظار ولا يوجد أي خطأ أو حالة نجاح نظهر المكون التالي */}
                                {!isResetingPasswordStatus && !errMsg && !isSuccessfulyStatus && <button type='submit' className='btn reset-password-btn w-100 p-3'>إرسال</button>}
                                {/* في حالة لم يكن لدينا حالة إنشاء طلب إعادة تعيين كملة السر في الانتظار ولا يوجد أي خطأ أو حالة نجاح نظهر المكون التالي */}
                                {/* في حالة كان لدينا حالة إنشاء طلب إعادة تعيين كلمة السر في الانتظار نظهر المكون التالي */}
                                {isResetingPasswordStatus && <button className='btn wait-reset-password-btn w-50 p-3 mt-4 mx-auto d-block' disabled>
                                    <span className='ms-2'>جاري إعادة التعيين ...</span>
                                    <AiOutlineClockCircle />
                                </button>}
                                {/* في حالة كان لدينا حالة إنشاء طلب إعادة تعيين كلمة السر في الانتظار نظهر المكون التالي */}
                                {/* في حالة كان لدينا حالة النجاح نظهر المكون التالي */}
                                {isSuccessfulyStatus && <button className='btn btn-success success-reset-password-btn w-100 p-3 mt-4 mx-auto d-block' disabled>
                                    <span className='ms-2'>تمت عملية إعادة تعيين كلمة السر بنجاح ...</span>
                                </button>}
                                {/* في حالة كان لدينا حالة النجاح نظهر المكون التالي */}
                                {/* في حالة كان لدينا خطأ نظهر المكون التالي */}
                                {errMsg && <button className='btn btn-danger error-btn w-50 p-3 mt-4 mx-auto d-block' disabled>
                                    {errMsg}
                                </button>}
                                {/* في حالة كان لدينا خطأ نظهر المكون التالي */}
                            </form>
                            {/* نهاية كتابة كود ال jsx لعنصر ال html المسمى reset-password-form */}
                        </div>
                        {/* بداية مكون العمود */}
                        {/* بداية مكون العمود */}
                        <div className="col-md-6 text-center">
                            <img src={ResetPasswordImage.src} alt="Reset Password Image !!" className='reset-password-img' />
                        </div>
                        {/* نهاية مكون العمود */}
                    </div>
                    {/* نهاية مكون الشبكة من البوتستراب */}
                </div>
                {/* نهاية مكون الحاوية من البوتستراب */}
            </div>
            {/* بداية كتابة كود ال jsx لعنصر ال html المسمى page-content */}
        </div>
        // نهاية كتابة كود ال jsx لصفحة إعادة ضبط كلمة السر
    );
}