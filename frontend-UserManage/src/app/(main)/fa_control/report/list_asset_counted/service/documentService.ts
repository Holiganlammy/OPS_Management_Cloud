import dataConfig from '@/config/config';
import client from '@/lib/axios/interceptors';

export async function getAutoData() {
  const urls = {
    typeGroup: '/FA_Control_Assets_TypeGroup',
  };

  const fetchMultipleUrls = async (urls: { [key: string]: string }) => {
    try {
      const response = Object.entries(urls).map(async ([key, url]) => {
        const response = await client.get(dataConfig().http + url, { method: 'GET', headers: dataConfig().header });
        const data = await response.data;
        return { key, data };
      });
      return await Promise.all(response);
    } catch (error) {
      console.error('ข้อผิดพลาด:', error);
    }
  };

  return fetchMultipleUrls(urls);
}

export async function getAutoDataAssetCounted(Description: string) {
  const url = '/FA_Control_Report_All_Counted_by_Description';

  try {
    const response = await client.post(
      dataConfig().http + url,
      { Description },
      { method: 'POST', headers: dataConfig().header }
    );
    const data = await response.data;
    return data;
  } catch (error) {
    console.error('ข้อผิดพลาด:', error);
    return null;
  }
}

