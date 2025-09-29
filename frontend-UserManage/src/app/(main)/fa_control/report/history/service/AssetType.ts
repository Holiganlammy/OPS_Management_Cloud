interface HistoryAssetType {
    Code: any
    nacdtl_id: string,
    nac_code: string,
    nacdtl_assetsCode: string,
    name: string,
    workflowtypeid: number,
    nacdtl_assetsName: string,
    nacdtl_bookV: number,
    nacdtl_PriceSeals: number,
    nacdtl_profit: number,
    nacdtl_assetsPrice: number,
    nacdtl_date_asset: string,
    update_date: string,
    create_by: string,
    source_approve_userid: string,
    account_aprrove_id: string,
    OwnerID: string,
    typeCode: string
    nac_type: string
}

interface FilterAssetType {
    nac_code: string,
    nacdtl_assetsCode: string,
    name: string,
    source_approve_userid: string
}

interface setFiltersType {
    nac_code: string[],
    nacdtl_assetsCode: string[],
    name: string[],
    source_approve_userid: string[]
}