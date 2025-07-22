interface DataAsset {
    AssetID: string;
    Code: string;
    Name: string;
    AssetTypeID: string | null;
    Asset_group: string;
    Group_name: string;
    SupplierID: string | null;
    BranchID: number;
    OwnerID: number;
    DepID: number;
    SecID: string | null;
    Details: string;
    WarrantyBegin: string | null;
    WarrantyEnd: string | null;
    SerialNo: string;
    Price: number;
    InvoiceNo: string | null;
    InvoiceDate: string | null;
    AccountCode: string | null;
    StatusID: string | null;
    CreateBy: string;
    CreateDate: string;
    UpdateBy: string;
    UpdateDate: string;
    Position: string;
    ImagePath: string;
    active: number;
    ImagePath_2: string;
    PositionNumber: string | null;
    bac_status: number;
    CommitDate: string;
    type_group: string;
    OwnerCode: string;
    BranchName: string;
}

interface ApproveList {
    approverid: string;
    limitamount: number;
    pendingday: string;
    status: number;
    workflowlevel: number;
}

interface IComment {
    userid: string | null | undefined;
    comment: string | null | undefined;
    create_date: string | null | undefined;
    img_profile: string | null | undefined;
}

interface FileItemType {
    nac_code: string | null | undefined;
    description: string | null | undefined;
    linkpath: string | null | undefined;
    userid: string | null | undefined;
    img_profile: string | null | undefined;
    create_by: string | null | undefined;
    create_date: string | null | undefined;
}
