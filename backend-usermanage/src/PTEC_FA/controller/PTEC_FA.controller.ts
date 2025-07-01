import { 
  Controller, 
  Post, 
  Res,
  Req,
  Body,
  Get,
} from '@nestjs/common';
import { PTEC_FA_Service } from '../service/PTEC_FA.service';
import { Response } from 'express';
import { FA_Control_Create_Detail_NAC, FA_Control_New_Assets_Xlsx, FA_Control_Running_NO_Dto, FA_control_update_DTL, FA_control_update_Dto, FA_Control_UpdateDetailCounted_Dto, FAMobileUploadImageDto, NacCreateDto, store_FA_control_comment, stroe_FA_control_Path, UpdateDtlAssetDto, updateReferenceDto } from '../dto/FA_Control.dto';

// @Controller('')
// export class PTEC_FA_Controller {
//     constructor(private readonly PTEC_FA_Service: PTEC_FA_Service) { }

    @Post('/check_files_NewNAC')
    async getFAControlRunningNO(@Req() req: Request): Promise<{
        message: string;
        code: number;
        attach?: FA_Control_Running_NO_Dto[];
        extension?: string;
        newFileName?: string;
        filePath?: string;
        error?: string;
    }> {
        try {
            const newpath = 'D:/files/NEW_NAC/';
            const file = (req as any).files?.file;
            if (!file) {
                return {
                    message: "No file uploaded",
                    code: 400
                };
            }

            const filename = file.name;
            const new_path = await this.PTEC_FA_Service.FA_Control_Running_NO();

            const newFileName = `${new_path[0].ATT}.${filename.split('.').pop()}`;

            // Wrap file.mv in a Promise to ensure return value
            await new Promise<void>((resolve, reject) => {
                file.mv(`${newpath}${newFileName}`, (err: any) => {
                    if (err) {
                        console.error("File move error:", err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });

            return {
                message: "File Uploaded",
                code: 200,
                attach: new_path,
                extension: filename.split('.').pop(),
                newFileName: newFileName,
                filePath: `${newpath}${newFileName}`
            };

        } catch (error) {
            console.error("Error in getFAControlRunningNO:", error);
            return {
                message: "Internal server error",
                code: 500,
                error: error.message
            };
        }
    }

    @Post('/FA_Control_Report_All_Counted_by_Description')
    async FA_Control_Report_All_Counted_by_Description(@Body() body: { Description: string }): Promise<{
        message: string;
        code: number;
        data?: AssetReportItem[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_Report_All_Counted_by_Description(body);
            return {
                message: "Report generated successfully",
                code: 200,
                data: result
            };
        } catch (error) {
            console.error("Error in FA_Control_Report_All_Counted_by_Description:", error);
            return {
                message: "Internal server error",
                code: 500,
                error: error.message
            };
        }
    } 

    @Get('/FA_Control_NAC_Backlog')
    async FA_Control_NAC_Backlog(): Promise<{
        message: string;
        code: number;
        data?: FA_Control_NAC_Backlog[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_NAC_Backlog();
            if (result.length == 0) {
                return {
                    message: "ไม่พบข้อมูล",
                    code: 400
                }
            }else{
                return{
                    message: "NAC Backlog retrieved successfully",
                    code: 200,
                    data: result
                }
            }
        } catch (error) {
            console.error("Error in FA_Control_NAC_Backlog:", error);
            return {
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/FA_Control_AnnualGraph')
    async FA_Control_AnnualGraph(@Body() body: { TargetYear: number }): Promise<{
        message: string;
        code: number;
        data?: FA_Control_AnnualGraph[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_AnnualGraph(body.TargetYear);
            return {
                message: "Annual graph data retrieved successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in FA_Control_AnnualGraph:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/FA_Control_Fetch_Assets')
    async FA_Control_Fetch_Assets(@Body() body: { usercode: string }): Promise<{
        message: string;
        code: number;
        data?: FA_Control_Fetch_Assets[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_Fetch_Assets(body.usercode);
            return {
                message: "Assets fetched successfully",
                code: 200,
                data: result
            };
        } catch (error) {
            console.error("Error in FA_Control_Fetch_Assets:", error);
            return {
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/FA_Control_UpdateDetailCounted')
    async FA_Control_UpdateDetailCounted(@Body() body: FA_Control_UpdateDetailCounted_Dto): Promise<{
            message: string;
            code: number;
            data?: string[]; 
            error?: string;
        }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_UpdateDetailCounted(body);
            return{
                message: "Detail counted updated successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in FA_Control_UpdateDetailCounted:", error);
            return {
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Get('/FA_Control_Assets_TypeGroup')
    async FA_Control_Assets_TypeGroup(): Promise<{
        message: string;
        code: number;
        data?: FA_Control_Assets_TypeGroup[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_Assets_TypeGroup();
            return{
                message: "Assets type group retrieved successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in FA_Control_Assets_TypeGroup:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }
    @Post('FA_Control_Create_Document_NAC')
    async FA_Control_Create_Document_NAC(@Body() body: NacCreateDto): Promise<{
        message: string;
        code: number;
        data?: string[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_Create_Document_NAC(body);
            return {
                message: "Document NAC created successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in FA_Control_Create_Document_NAC:", error);
            return {
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/store_FA_control_update_table')
    async store_FA_control_update_table(@Body() body: FA_control_update_Dto): Promise<{
        message: string;
        code: number;
        data?: string[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.store_FA_control_update_table(body);
            return {
                message: "FA control update table retrieved successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in store_FA_control_update_table:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/store_FA_control_comment')
    async store_FA_control_comment(@Body() body: store_FA_control_comment): Promise<{
        message: string;
        code: number;
        data?: store_FA_control_comment_entity[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.store_FA_control_comment(body);
            return{
                message: "FA control comment stored successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in store_FA_control_comment:", error);
            return {
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/FA_Control_Create_Detail_NAC')
    async FA_Control_Create_Detail_NAC(@Body() body: FA_Control_Create_Detail_NAC): Promise<{
        message: string;
        code: number;
        data?: FA_Control_Create_Detail_NAC_Entity[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_Create_Detail_NAC(body);
            return {
                message: "Detail NAC created successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in FA_Control_Create_Detail_NAC:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/store_FA_SendMail')
    async store_FA_SendMail(@Body() body: { nac_code: string }): Promise<{
        message: string;
        code: number;
        data?: string[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.store_FA_SendMail({ nac_code: body.nac_code });
            return{
                message: "Email sent successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in store_FA_SendMail:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/AssetsAll_Control')
    async AssetsAll_Control(@Body() body: { BranchID: number, usercode: string }): Promise<{
        message: string;
        code: number;
        data?: AssetEntity[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.AssetsAll_Control(body);
            return {
                message: "Assets all control retrieved successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in AssetsAll_Control:", error);
            return {
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/FA_control_select_headers')
    async FA_control_select_headers(@Body() body: { nac_code: string }):Promise<{
        message: string;
        code: number;
        data?: NacHeaderEntity[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_control_select_headers(body);
            return{
                message: "FA control headers retrieved successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in FA_control_select_headers:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/FA_Control_execDocID')
    async FA_Control_execDocID(@Body() body: { nac_code: string, usercode: string }):Promise<{
        message: string;
        code: number;
        data?: FA_Control_execDocID_Entity[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_execDocID(body);
            return {
                message: "Document ID executed successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in FA_Control_execDocID:", error);
            return {
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/FA_Control_select_dtl')
    async FA_Control_select_dtl(@Body() body: { nac_code: string }): Promise<{
        message: string;
        code: number;
        data?: FA_Control_select_dtl_Entity[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_select_dtl(body);
            return{
                message: "FA control details retrieved successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in FA_Control_select_dtl:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/FA_control_update_DTL')
    async FA_control_update_DTL(@Body() body: FA_control_update_DTL): Promise<{
        message: string;
        code: number;
        data?: FA_control_update_DTL_Entity[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_control_update_DTL(body);
            return{
                message: "FA control updated successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in FA_control_update_DTL:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/FA_Control_CheckAssetCode_Process')
    async FA_Control_CheckAssetCode_Process(@Body() body: { nacdtl_assetsCode: string }): Promise<{
        message: string;
        code: number;
        data?: string[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_CheckAssetCode_Process(body);
            return{
                message: "Asset code checked successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in FA_Control_CheckAssetCode_Process:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/stroe_FA_control_Path')
    async stroe_FA_control_Path(@Body() body: stroe_FA_control_Path): Promise<{
        message: string;
        code: number;
        data?: store_control_path[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.stroe_FA_control_Path(body);
            return{
                message: "Path stored successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in stroe_FA_control_Path:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/qureyNAC_comment')
    async qureyNAC_comment(@Body() body: { nac_code: string }): Promise<{
        message: string;
        code: number;
        data?: QueryNACCommentEntity[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.qureyNAC_comment(body);
            return {
                message: "NAC comments retrieved successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in qureyNAC_comment:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/qureyNAC_path')
    async qureyNAC_path(@Body() body: { nac_code: string }): Promise<{
        message: string;
        code: number;
        data?: QueryNACPath[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.qureyNAC_path(body);
            return {
                message: "NAC path retrieved successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in qureyNAC_path:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/store_FA_control_HistorysAssets')
    async store_FA_control_HistorysAssets(@Body() body: { userCode: string }): Promise<{
        message: string;
        code: number;
        data?: HistoryAssets[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.store_FA_control_HistorysAssets(body);
            return {
                message: "FA control history stored successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in store_FA_control_HistorysAssets:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/FA_Control_BPC_Running_NO')
    async FA_Control_BPC_Running_NO(): Promise<{
        message: string;
        code: number;
        data?: string[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_BPC_Running_NO();
            return{
                message: "FA Control BPC Running NO retrieved successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in FA_Control_BPC_Running_NO:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/FA_Control_New_Assets_Xlsx')
    async FA_Control_New_Assets_Xlsx(@Body() req: FA_Control_New_Assets_Xlsx): Promise<{
        message: string;
        code: number;
        data?: string[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_New_Assets_Xlsx(req);
            return{
                message: "FA Control New Assets Xlsx retrieved successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in FA_Control_New_Assets_Xlsx:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }
    
    @Post('/FA_Control_import_dataXLSX_toAssets')
    async FA_Control_import_dataXLSX_toAssets(@Body() req: { count: number, keyID: string }): Promise<{
        message: string;
        code: number;
        data?: string[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_import_dataXLSX_toAssets(req);
            return {
                message: "FA Control import data from XLSX to Assets retrieved successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in FA_Control_import_dataXLSX_toAssets:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/UpdateDtlAsset')
    async UpdateDtlAsset(@Body() req: UpdateDtlAssetDto): Promise<{
        message: string;
        code: number;
        data?: string[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.UpdateDtlAsset(req);
            return {
                message: "FA Control Update Detail Asset retrieved successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in UpdateDtlAsset:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/FA_control_updateStatus')
    async FA_control_updateStatus(@Body() req: { usercode: string, nac_code: string, nac_status: number }): Promise<{
        message: string;
        code: number;
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_control_updateStatus(req);
            return {
                message: "FA Control Update Status retrieved successfully",
                code: 200,
            }
        } catch (error) {
            console.error("Error in FA_control_updateStatus:", error);
            return {
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/store_FA_control_drop_NAC')
    async store_FA_control_drop_NAC(@Body() req: {usercode: string, nac_code: string }): Promise<
    {
        message: string;
        code: number;
        data?: string[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.store_FA_control_drop_NAC(req);
            return{
                message: "FA Control Drop NAC retrieved successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in store_FA_control_drop_NAC:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/FA_Control_Select_MyNAC')
    async FA_Control_Select_MyNAC(@Body() req: { userCode: string }): Promise<
    {
        message: string;
        code: number;
        data?: FA_Control_Select_MyNAC_Entity[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_Select_MyNAC(req);
            return {
                message: "FA Control Select MyNAC retrieved successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in FA_Control_Select_MyNAC:", error);
            return {
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/FA_Control_Select_MyNAC_Approve')
    async FA_Control_Select_MyNAC_Approve(@Body() req: { usercode: string }): Promise<{
        message: string;
        code: number;
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_Select_MyNAC_Approve(req);
            return{
                message: "FA Control Select MyNAC Approve retrieved successfully",
                code: 200,
            }
        } catch (error) {
            console.error("Error in FA_Control_Select_MyNAC_Approve:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Get('/FA_Control_ListStatus')
    async FA_Control_ListStatus(): Promise<
    
    {
        message: string;
        code: number;
        data?: string[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_ListStatus();
            return{
                message: "FA Control List Status retrieved successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in FA_Control_ListStatus:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }

    @Post('/check_code_result')
    async check_code_result(@Body() req: { Code: string }): Promise<
    {
        message: string;
        code: number;
        data?: string[];
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.check_code_result({ Code: req.Code });
            return {
                message: "Code result checked successfully",
                code: 200,
                data: result
            }
        } catch (error) {
            console.error("Error in check_code_result:", error);
            return{
                message: "Internal server error",
                code: 500,
                error: error.message
            }
        }
    }
    @Post('FA_Mobile_UploadImage')
    async uploadImage(@Body() body: FAMobileUploadImageDto): Promise<{ 
        message: string; 
        code: number; 
        data?: FAMobileUploadImageDto[]; 
        error?: string 
    }> {
        try {
            const result = await this.PTEC_FA_Service.uploadImage(body);
            return {
                message: 'Image uploaded successfully',
                code: 200,
                data: result
            };
        } catch (error) {
            console.error("Error in uploadImage:", error);
            return {
                message: "Internal server error",
                code: 500,
                error: error.message
            };
        }
    }

    @Post('/updateReference')
    async updateReference(@Body() body: updateReferenceDto): Promise<{
        message: string;
        code: number;
        data?: string[]; // Adjust type as needed
        error?: string;
    }> {
        try {
            const result = await this.PTEC_FA_Service.updateReference(body);
            return {
                message: "Reference updated successfully",
                code: 200,
                data: result
            };
        } catch (error) {
            console.error("Error in updateReference:", error);
            return {
                message: "Internal server error",
                code: 500,
                error: error.message
            };
        }
    }
}