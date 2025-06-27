
import { 
  Controller, 
  Post, 
  Header,
  Res,
  Req,
  Body,
  Get,
} from '@nestjs/common';
import { PTEC_FA_Service } from '../service/PTEC_FA.service';
import { Response } from 'express';
import { FA_Control_Create_Detail_NAC, FA_control_update_Dto, FA_Control_UpdateDetailCounted_Dto, NacCreateDto, store_FA_control_comment } from '../dto/FA_Control.dto';

@Controller('')
export class PTEC_FA_Controller {
    constructor(private readonly PTEC_FA_Service: PTEC_FA_Service) { }
    
    @Post('/check_files_NewNAC')
    async getFAControlRunningNO(@Req() req: Request, @Res() res: Response){
        try {
            const newpath = 'D:/files/NEW_NAC/';
            const file = (req as any).files?.file;
            if (!file) {
                return res.status(400).json({
                    message: "No file uploaded",
                    code: 400
                });
            }
            
            const filename = file.name;
            const new_path = await this.PTEC_FA_Service.FA_Control_Running_NO();
            
            const newFileName = `${new_path[0].ATT}.${filename.split('.').pop()}`;
            file.mv(`${newpath}${newFileName}`, (err) => {
                if (err) {
                    console.error("File move error:", err);
                    return res.status(500).json({ 
                        message: "File upload failed", 
                        code: 500 
                    }); 
                }
                
                return res.status(200).json({
                    message: "File Uploaded",
                    code: 200,
                    attach: new_path,
                    extension: filename.split('.').pop(),
                    newFileName: newFileName,
                    filePath: `${newpath}${newFileName}`
                });
            });
            
        } catch (error) {
            console.error("Error in getFAControlRunningNO:", error);
            return res.status(500).json({
                message: "Internal server error",
                code: 500,
                error: error.message
            });
        }
    }

    @Post('/FA_Control_Report_All_Counted_by_Description')
    async FA_Control_Report_All_Counted_by_Description(@Body() body: { Description: string }, @Res() res: Response) {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_Report_All_Counted_by_Description(body);
            return res.status(200).json({
                message: "Report generated successfully",
                code: 200,
                data: result
            });
        } catch (error) {
            console.error("Error in FA_Control_Report_All_Counted_by_Description:", error);
            return res.status(500).json({
                message: "Internal server error",
                code: 500,
                error: error.message
            });
        }
    }

    @Get('/FA_Control_NAC_Backlog')
    async FA_Control_NAC_Backlog(@Res() res: Response) {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_NAC_Backlog();
            if (result.length == 0) {
                return res.status(400).json({
                    message: "ไม่พบข้อมูล",
                    code: 400
                });
            }else{
                return res.status(200).json({
                    message: "NAC Backlog retrieved successfully",
                    code: 200,
                    data: result
                });
            }
        } catch (error) {
            console.error("Error in FA_Control_NAC_Backlog:", error);
            return res.status(500).json({
                message: "Internal server error",
                code: 500,
                error: error.message
            });
        }
    }

    @Post('/FA_Control_AnnualGraph')
    async FA_Control_AnnualGraph(@Body() body: { TargetYear: string }, @Res() res: Response) {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_AnnualGraph(body.TargetYear);
            return res.status(200).json({
                message: "Annual graph data retrieved successfully",
                code: 200,
                data: result
            });
        } catch (error) {
            console.error("Error in FA_Control_AnnualGraph:", error);
            return res.status(500).json({
                message: "Internal server error",
                code: 500,
                error: error.message
            });
        }
    }

    @Post('/FA_Control_Fetch_Assets')
    async FA_Control_Fetch_Assets(@Body() body: { usercode: string }, @Res() res: Response) {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_Fetch_Assets(body.usercode);
            return res.status(200).json({
                message: "Assets fetched successfully",
                code: 200,
                data: result
            });
        } catch (error) {
            console.error("Error in FA_Control_Fetch_Assets:", error);
            return res.status(500).json({
                message: "Internal server error",
                code: 500,
                error: error.message
            });
        }
    }

    @Post('/FA_Control_UpdateDetailCounted')
    async FA_Control_UpdateDetailCounted(@Body() body: FA_Control_UpdateDetailCounted_Dto, @Res() res: Response) {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_UpdateDetailCounted(body);
            return res.status(200).json({
                message: "Detail counted updated successfully",
                code: 200,
                data: result
            });
        } catch (error) {
            console.error("Error in FA_Control_UpdateDetailCounted:", error);
            return res.status(500).json({
                message: "Internal server error",
                code: 500,
                error: error.message
            });
        }
    }

    @Get('/FA_Control_Assets_TypeGroup')
    async FA_Control_Assets_TypeGroup(@Res() res: Response) {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_Assets_TypeGroup();
            return res.status(200).json({
                message: "Assets type group retrieved successfully",
                code: 200,
                data: result
            });
        } catch (error) {
            console.error("Error in FA_Control_Assets_TypeGroup:", error);
            return res.status(500).json({
                message: "Internal server error",
                code: 500,
                error: error.message
            });
        }
    }
    @Post('FA_Control_Create_Document_NAC')
    async FA_Control_Create_Document_NAC(@Body() body: NacCreateDto, @Res() res: Response) {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_Create_Document_NAC(body);
            return res.status(200).json({
                message: "Document NAC created successfully",
                code: 200,
                data: result
            });
        } catch (error) {
            console.error("Error in FA_Control_Create_Document_NAC:", error);
            return res.status(500).json({
                message: "Internal server error",
                code: 500,
                error: error.message
            });
        }
    }

    @Post('/store_FA_control_update_table')
    async store_FA_control_update_table(@Body() body: FA_control_update_Dto, @Res() res: Response) {
        try {
            const result = await this.PTEC_FA_Service.store_FA_control_update_table(body);
            return res.status(200).json({
                message: "FA control update table retrieved successfully",
                code: 200,
                data: result
            });
        } catch (error) {
            console.error("Error in store_FA_control_update_table:", error);
            return res.status(500).json({
                message: "Internal server error",
                code: 500,
                error: error.message
            });
        }
    }

    @Post('/store_FA_control_comment')
    async store_FA_control_comment(@Body() body: store_FA_control_comment, @Res() res: Response) {
        try {
            const result = await this.PTEC_FA_Service.store_FA_control_comment(body);
            return res.status(200).json({
                message: "FA control comment stored successfully",
                code: 200,
                data: result
            });
        } catch (error) {
            console.error("Error in store_FA_control_comment:", error);
            return res.status(500).json({
                message: "Internal server error",
                code: 500,
                error: error.message
            });
        }
    }

    @Post('/FA_Control_Create_Detail_NAC')
    async FA_Control_Create_Detail_NAC(@Body() body: FA_Control_Create_Detail_NAC, @Res() res: Response) {
        try {
            const result = await this.PTEC_FA_Service.FA_Control_Create_Detail_NAC(body);
            return res.status(200).json({
                message: "Detail NAC created successfully",
                code: 200,
                data: result
            });
        } catch (error) {
            console.error("Error in FA_Control_Create_Detail_NAC:", error);
            return res.status(500).json({
                message: "Internal server error",
                code: 500,
                error: error.message
            });
        }
    }

    @Post('/store_FA_SendMail')
    async store_FA_SendMail(@Body() body: { nac_code: string }, @Res() res: Response) {
        try {
            const result = await this.PTEC_FA_Service.store_FA_SendMail({ nac_code: body.nac_code });
            return res.status(200).json({
                message: "Email sent successfully",
                code: 200,
                data: result
            });
        } catch (error) {
            console.error("Error in store_FA_SendMail:", error);
            return res.status(500).json({
                message: "Internal server error",
                code: 500,
                error: error.message
            });
        }
    }

    @Post('/AssetsAll_Control')
    async AssetsAll_Control(@Body() body: { BranchID: number, usercode: string }, @Res() res: Response) {
        try {
            const result = await this.PTEC_FA_Service.AssetsAll_Control(body);
            return res.status(200).json({
                message: "Assets all control retrieved successfully",
                code: 200,
                data: result
            });
        } catch (error) {
            console.error("Error in AssetsAll_Control:", error);
            return res.status(500).json({
                message: "Internal server error",
                code: 500,
                error: error.message
            });
        }
    }
}
