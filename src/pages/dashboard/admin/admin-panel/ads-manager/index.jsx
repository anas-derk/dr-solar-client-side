import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getAdminInfo } from "../../../../../../public/global_functions/popular";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";

export default function AdsManager() {
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isErrorMsgOnLoadingThePage, setIsErrorMsgOnLoadingThePage] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const adminToken = localStorage.getItem(process.env.adminTokenNameInLocalStorage);
        if (adminToken) {
            getAdminInfo()
                .then(async (result) => {
                    if (result.error) {
                        localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                        await router.replace("/dashboard/admin/login");
                    } else {
                        setIsLoadingPage(false);
                    }
                })
                .catch(async (err) => {
                    if (err?.response?.data?.msg === "Unauthorized Error") {
                        localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                        await router.replace("/dashboard/admin/login");
                    }
                    else {
                        setIsLoadingPage(false);
                        setIsErrorMsgOnLoadingThePage(true);
                    }
                });
        } else router.push("/dashboard/admin/login");
    }, []);
    return (
        // Start Ads Manager Page
        <div className="ads-manager">
            <Head>
                <title>دكتور سولار - إدارة الإعلانات</title>
            </Head>
            {!isLoadingPage && !isErrorMsgOnLoadingThePage && <>
                {/* Start Content Section */}
                <section className="content d-flex justify-content-center align-items-center flex-column text-center">
                    <div className="container">
                        <h1 className="welcome-msg mb-4">مرحباً بك في صفحة إدارة الإعلانات الخاصة بك في دكتور سولار</h1>
                        <Link className="btn btn-success request-manager-link w-25 mx-auto mb-4 d-block link" href="/dashboard/admin/admin-panel/ads-manager/add-ads">إضافة إعلان</Link>
                        <Link className="btn btn-danger manager-link w-25 mx-auto mb-4 link" href="/dashboard/admin/admin-panel/ads-manager/delete-ads">حذف إعلان</Link>
                    </div>
                </section>
                {/* End Content Section */}
            </>}
            {isLoadingPage && !isErrorMsgOnLoadingThePage && <LoaderPage />}
            {isErrorMsgOnLoadingThePage && <ErrorOnLoadingThePage />}
        </div>
        // End Ads Manager Page
    );
} 