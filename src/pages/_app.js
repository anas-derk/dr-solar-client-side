// استيراد المكتبات المطلوبة
import Script from "next/script";
import Head from "next/head";
// استيراد ملفات التنسيق الخاصة بكل الصفحات
import "../Scss/index.css";
import "../components/Header/index.css";
import "../pages/index.css";
import "../pages/login/index.css";
import "./sign-up/index.css";
import "./contact-us/index.css";
import "./service-request/index.css";
import "./forget-password/index.css";
import "./reset-password/index.css";
import "./profile/index.css";
import "./ads/index.css";
import "./dashboard/admin/login/index.css";
import "./dashboard/admin/admin-panel/index.css";
import "./dashboard/admin/admin-panel/requests-manager/index.css";
import "./dashboard/admin/admin-panel/passwords-reset/index.css";
import "./dashboard/admin/admin-panel/requests-manager/[request_Id]/user-info/index.css";
import "./dashboard/admin/admin-panel/ads-manager/index.css";
import "./dashboard/admin/admin-panel/ads-manager/add-ads/index.css";
import "./dashboard/admin/admin-panel/ads-manager/delete-ads/index.css";

// تعريف دالة المكون الرئيسي 
export default function App({ Component, pageProps }) {
  return (
    <>
      {/* بداية كتابة معلومات عنصر ال head في ال html */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* نهاية كتابة معلومات عنصر ال head في ال html */}
      {/* بداية عرض الصفحة بناءً على الرابط الذي يضغط عليه المستخدم */}
      <Component {...pageProps} />
      {/* نهاية عرض الصفحة بناءً على الرابط الذي يضغط عليه المستخدم */}
      {/* بداية استيراد ملف الجافا سكربت الخاص بالبوتستراب */}
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
        crossOrigin="anonymous"
      ></Script>
      {/* نهاية استيراد ملف الجافا سكربت الخاص بالبوتستراب */}
    </>
  );
}
