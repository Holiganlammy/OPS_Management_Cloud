import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = (rows: CountAssetRow[]) => {

  const getFormattedDate = (): string => {
    const today: Date = new Date();
    const day: string = String(today.getDate()).padStart(2, '0');
    const month: string = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year: string = String(today.getFullYear());
    return `${day}${month}${year}`;
  };

  const formatDateTime = (dateInput: Date | string): string => {
    if (!dateInput) return 'Invalid date';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return 'Invalid date';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formattedDate: string = getFormattedDate();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('NAC Data');

  // Define headers
  const headers = [
    { key: 'Code', header: 'รหัสทรัพย์สิน', },
    { key: 'Name', header: 'ชื่อทรัพย์สิน', },
    { key: 'SerialNo', header: 'SerialNo', },
    { key: 'OwnerID', header: 'ผู้ถือครอง', },
    { key: 'Date', header: 'วันที่ตรวจนับ', },
    { key: 'EndDate_Success', header: 'วันที่ทำ NAC ล่าสุด', },
    { key: 'UserID', header: 'ผู้ตรวจ', },
    { key: 'detail', header: 'สถานะล่าสุด', },
    { key: 'Reference', header: 'สถานะครั้งนี้', },
    { key: 'comment', header: 'Comment', },
    { key: 'remarker', header: 'ผลการตรวจนับ', },
    { key: 'ImagePath', header: 'รูปภาพที่ 1', },
    { key: 'ImagePath_2', header: 'รูปภาพที่ 2', }
  ];

  // Add headers to worksheet
  worksheet.columns = headers.map(header => ({
    header: header.header,
    key: header.key,
    width: 20 // Set initial width, adjust later based on content
  }));

  // Style header row
  worksheet.getRow(1).eachCell(cell => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '404040' }
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFF' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Add rows to the worksheet
  rows.forEach(item => {
    const formattedItem = {
      ...item,
      ImagePath: item.ImagePath ? 'Yes' : 'No',
      ImagePath_2: item.ImagePath_2 ? 'Yes' : 'No',
    };

    const row = worksheet.addRow(formattedItem);

    // Apply border, alignment, and status-specific font color
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.alignment = {
        wrapText: true,
        horizontal: 'left',
        vertical: 'top'
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      // Apply font color based on the status_name value
      if (headers[colNumber - 1].key === 'remarker') {
        switch (cell.value) {
          case 'ต่างสาขา':
            cell.font = { color: { argb: 'FFD700' } }; // Yellow
            break;
          case 'ตรวจนับแล้ว':
            cell.font = { color: { argb: '5863F8' } }; // Blue
            break;
          case 'ยังไม่ได้ตรวจนับ':
            cell.font = { color: { argb: 'FF0000' } }; // Red
            break;
          default:
            cell.font = { color: { argb: '000000' } }; // Default to black if no match
        }
      }
      // Apply font color for ImagePath and ImagePath_2
      if (headers[colNumber - 1].key === 'ImagePath' || headers[colNumber - 1].key === 'ImagePath_2') {
        switch (cell.value) {
          case 'Yes':
            cell.font = { color: { argb: '008000' } }; // Green for Yes
            break;
          case 'No':
            cell.font = { color: { argb: 'FF0000' } }; // Red for No
            break;
        }
      }
    });
  });

  // Adjust column widths based on content
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    if (column.eachCell) {
      column.eachCell({ includeEmpty: true }, cell => {
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
    }
    column.width = Math.min(40, maxLength + 2); // Set a limit for the maximum column width
  });

  // Generate Excel file and trigger download
  workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `NAC_Export_${formattedDate}.xlsx`);
  }).catch((error: Error) => {
    console.error('Error exporting Excel:', error);
  });
};
