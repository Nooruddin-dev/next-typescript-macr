import React from 'react';



export default function CategoriesSideNav({ filteredCategories, activeCategory, selectedLanguage, handleActiveCategory } : any) {





    return (
        <aside className="px-lg-4 py-lg-3 desktop_side_menu mobile_side_menu">


            {/* <SearchComponent
                filteredCategories={filteredCategories}
            /> */}



            <ul className="m-0 p-0 menu_item">

                {
                    filteredCategories && filteredCategories.length > 0
                        ?
                        filteredCategories?.map((item: any, index: number) => (
                            <li className={item.categoryId == activeCategory ? 'active' : ''} key={index}>
                                <a className="my-lg-1 py-lg-3 py-2 px-2"
                                    onClick={(e) => handleActiveCategory(e, item.categoryId)}
                                >
                                    <img src={`${item.logoIconUrl}`} alt="menu category icon" className='category_menu_img'
                                        width="24"
                                        height="25"
                                        loading="lazy"
                                    />
                                    <img src={`${item.logoIconHoverUrl}`} alt="menu category icon" className='category_menu_img_hover'
                                        width="24"
                                        height="25"
                                        loading="lazy"
                                    />

                                    {selectedLanguage == "en"
                                        ? item.textNameEn
                                        : item.textNameAr}
                                </a>
                            </li>
                        ))
                        :
                        <></>
                }



            </ul>
        </aside>

    )
}
