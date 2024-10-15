export const fiscals = {
    fiscalPeriods: [
        {
            LabelEn: "Year",
            LabelAr: "سنوي",
            LabelFSEn: "Year",
            LabelFSAr: "سنوي",
            FiscalType: "Year",
            FiscalTypeID: "4",
            Value: 4,
        },
        {
            LabelEn: "Quarter",
            LabelAr: "ربعي",
            LabelFSEn: "Quarter",
            LabelFSAr: "ربعي",
            FiscalType: "TTM",
            FiscalTypeID: "3",
            Value: 3,
        },
        {
            LabelEn: "Annualize",
            LabelAr: "مرحلي",
            LabelFSEn: "Annualize",
            LabelFSAr: "مرحلي",
            FiscalType: "Annualize",
            FiscalTypeID: "5",
            Value: 5,
        },
        {
            LabelEn: "Quarter Only",
            LabelAr: "ربعي",
            LabelFSEn: "Quarter Only",
            LabelFSAr: "ربعي",
            FiscalType: "Quarter",
            FiscalTypeID: "7",
            Value: 7,
        },
        {
            LabelEn: "Month",
            LabelAr: "شهري",
            LabelFSEn: "Month",
            LabelFSAr: "شهري",
            FiscalType: "Month",
            FiscalTypeID: "2",
            Value: 2,
        },
        {
            LabelEn: "Daily",
            LabelAr: "يوميًا",
            LabelFSEn: "Daily",
            LabelFSAr: "يوميًا",
            FiscalType: "Daily",
            FiscalTypeID: "6",
            Value: 6,
        },
        {
            LabelEn: "Weekly",
            LabelAr: "أسبوعي",
            LabelFSEn: "Weekly",
            LabelFSAr: "أسبوعي",
            FiscalType: "Weekly",
            FiscalTypeID: "1",
            Value: 1,
        },

        {
            LabelEn: "TTM",
            LabelAr: "آخر 12",
            LabelFSEn: "TTM",
            LabelFSAr: "آخر 12",
            FiscalType: "TTM",
            FiscalTypeID: "-1",
            Value: -1,
        },
    ],
    FiscalYears: [
        {
            YearEn: "1 Year",
            YearAr: "1 سنة",
            Value: 1,
        },
        {
            YearEn: "2 Years",
            YearAr: "سنتين",
            Value: 2,
        },
        {
            YearEn: "3 Years",
            YearAr: "3 سنة",
            Value: 3,
        },
        {
            YearEn: "4 Years",
            YearAr: "4 سنة",
            Value: 4,
        },
        {
            YearEn: "5 Years",
            YearAr: "5 سنوات",
            Value: 5,
        },
        {
            YearEn: "6 Years",
            YearAr: "6 سنة",
            Value: 6,
        },
        {
            YearEn: "7 Years",
            YearAr: "7 سنة",
            Value: 7,
        },
        {
            YearEn: "8 Years",
            YearAr: "8 سنة",
            Value: 8,
        },
        {
            YearEn: "9 Years",
            YearAr: "9 سنة",
            Value: 9,
        },
        {
            YearEn: "10 Years",
            YearAr: "10 سنوات",
            Value: 10,
        },
        {
            YearEn: "11 Years",
            YearAr: "11 سنة",
            Value: 11,
        },
        {
            YearEn: "12 Years",
            YearAr: "12 سنة",
            Value: 12,
        },
        {
            YearEn: "13 Years",
            YearAr: "13 سنة",
            Value: 13,
        },
        {
            YearEn: "14 Years",
            YearAr: "14 سنة",
            Value: 14,
        },
        {
            YearEn: "15 Years",
            YearAr: "15 سنة",
            Value: 15,
        },
        {
            YearEn: "16 Years",
            YearAr: "16 سنة",
            Value: 16,
        },
        {
            YearEn: "17 Years",
            YearAr: "17 سنة",
            Value: 17,
        },
        {
            YearEn: "18 Years",
            YearAr: "18 سنة",
            Value: 18,
        },
        {
            YearEn: "19 Years",
            YearAr: "19 سنة",
            Value: 19,
        },
        {
            YearEn: "20 Years",
            YearAr: "20 سنة",
            Value: 20,
        },
        {
            YearEn: "All",
            YearAr: "الكل",
            Value: 100,
        },
    ],

    DataFilters:[
        {
            Value: 1,
            key: "data",
            NameEn: "Data",
            NameAr: "البيانات",
        },
        {
            Value: 2,
            key: "growth",
            NameEn: "Growth",
            NameAr: "النمو",
        },
        {
            Value: 3,
            key: "both",
            NameEn: "Both",
            NameAr: "الكل",
        },
    ],

    fiscalQuarters: [
        { label: "Q-1", labelAr: "الربع الأول", value: 2 },
        { label: "Q-2", labelAr: "الربع الثاني", value: 3 },
        { label: "Q-3", labelAr: "الربع الثالث", value: 4 },
        { label: "Q-4", labelAr: "الربع الرابع", value: 5 },
    ],


    allFiscalPeriods: [
        //-- below are for month
        { label: "Jan", labelAr: "يناير", value: 58, fiscalPeriodTypeId: 2 },//--value is FiscalPeriodID in 'FiscalPeriods' table
        { label: "Feb", labelAr: "فبراير", value: 59, fiscalPeriodTypeId: 2},
        { label: "March", labelAr: "مارس", value: 60, fiscalPeriodTypeId: 2 },
        { label: "April", labelAr: "أبريل", value: 61, fiscalPeriodTypeId: 2 },
        { label: "May", labelAr: "مايو", value: 62, fiscalPeriodTypeId: 2 },
        { label: "June", labelAr: "يونيو", value: 63, fiscalPeriodTypeId: 2 },
        { label: "July", labelAr: "يوليو", value: 64, fiscalPeriodTypeId: 2 },
        { label: "Aug", labelAr: "أغسطس", value: 65, fiscalPeriodTypeId: 2 },
        { label: "Sep", labelAr: "سبتمبر", value: 66, fiscalPeriodTypeId: 2 },
        { label: "Oct", labelAr: "أكتوبر", value: 67, fiscalPeriodTypeId: 2 },
        { label: "Nov", labelAr: "نوفمبر", value: 68, fiscalPeriodTypeId: 2 },
        { label: "Dec", labelAr: "ديسمبر", value: 69, fiscalPeriodTypeId: 2 },

        //-- below are for quarter
        { label: "Q-1", labelAr: "الربع الأول", value: 2, fiscalPeriodTypeId: 3 },
        { label: "Q-2", labelAr: "الربع الثاني", value: 3, fiscalPeriodTypeId: 3 },
        { label: "Q-3", labelAr: "الربع الثالث", value: 4, fiscalPeriodTypeId: 3 },
        { label: "Q-4", labelAr: "الربع الرابع", value: 5, fiscalPeriodTypeId: 3 },
    ],
}


