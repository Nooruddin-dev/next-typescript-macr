
"use client"
import React, { useEffect, useState } from 'react';

import { getPageIdByPageName } from '@/helpers/common/SeoCommonHelper';
import { useDispatch, useSelector } from 'react-redux';
import SiteLoader from '../common/SiteLoader';
import { getLocaleFromURL } from '@/Routes/routeHelper';
import { isBrowserWindow, isEmptyEntity } from '@/helpers/common/GlobalHelper';
import { settrialStatusModal } from '@/store/authmodal/slice';
import { freeTrialPages } from '@/util/freeTrialPages';
import { usePathname, useRouter } from 'next/navigation';
import SectorPageSub from '../sector/SectorPageSub';
import { getPageSeoNameFromUrl } from '@/helpers/chart/ChartCommonHelpers';

export default function MainSectorPage() {
    const router = useRouter();
    
    const pathname = usePathname();  // Get the full pathname

    const pageSeoName = getPageSeoNameFromUrl(pathname);
    const pageId = getPageIdByPageName(pageSeoName);





    return <SectorPage key={pageId} pageId={pageId} />
}

function SectorPage(props: any) {

    const router = useRouter();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const pageSeoName = props.title;
    const pageId = props?.pageId;
    const user = useSelector((state: any) => state.user.user);
    const UserId = user?.UserId;
    const HasMacroChartsAccess = user?.HasMacroChartsAccess;

    let paramsSearch = null;
    let isArgaamEmbed: any = "0";
    if (isBrowserWindow()) {
        paramsSearch = new URLSearchParams(window.location.search);
        isArgaamEmbed = paramsSearch.get('isArgaamEmbed');
    }




    const handleUserAccess = () => {
        if (user?.HasMacroChartsAccess == "true") {
            setIsLoaded(true);
            return;
        }


        if (user?.IsMacroTrialOrMacroPackageExpired == "true") {
            setIsLoaded(true);
            dispatch(
                settrialStatusModal({
                    visible: true,
                    status: 0,
                })
            );
            router.push(`/${getLocaleFromURL()}`);

        } else if (user?.HasMacroChartsAccess !== "true") {

            router.push(`/${getLocaleFromURL()}/Request`);


        } else if (isEmptyEntity(user)) {
            router.push(`/${getLocaleFromURL()}`);
            return;
        }
    }



    useEffect(() => {
        if (isArgaamEmbed === "1") {
            setIsLoaded(true);
            return;
        }

      if(1 == 1){
        setIsLoaded(true);
        return;
      }



        const foundPage = freeTrialPages?.find((x: { pageId: any; }) => x.pageId == pageId);
        if (foundPage && foundPage.pageId > 0) {
            setIsLoaded(true);
            return;
        }

        handleUserAccess();

        //-- call refresh token on every time visit of sector page. if user log in to any other device, then no page should be access
        // refreshToken()
        //   .then((res) => {
        //     handleUserAccess();
        //   })
        //   .catch((err) => {
        //     resetUser(false);
        //     navigate(`/${getLocaleFromURL()}/Request`);
        //     setIsLoaded(true);
        //   });

    }, [])





    return (
        <>
            {
                isLoaded === true ? (
                    <SectorPageSub />
                   

                )

                    :
                    <SiteLoader />
            }




        </>
    );
}
