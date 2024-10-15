import { storeSession } from "@/store/store";


export const getPageIdByPageName = (pageSeoName: any) => {
    

    let pageId = 0;
    const categories = storeSession?.getState()?.home?.categories;

    const filteredPages = categories?.flatMap((itm: any) => itm.macrocategoryPages.filter((page: any) => page.seo_name_en == pageSeoName)
    );
    if(filteredPages && filteredPages.length > 0){
        const page = filteredPages[0];
        pageId = page.pageId;
    }

    return pageId;


}
