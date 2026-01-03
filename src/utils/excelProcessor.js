import * as XLSX from 'xlsx';

export const getUrlsFromExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const urls = [];
        const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/i;

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          jsonData.forEach(row => {
            if (!row) return;
            row.forEach(cell => {
              if (typeof cell === 'string' && urlRegex.test(cell)) {
                urls.push(cell.trim());
              }
            });
          });
        });
        resolve(urls);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const getRootDomain = (url) => {
  if (!url) return null;
  try {
    let hostname;
    if (!url.startsWith('http')) {
        hostname = new URL('http://' + url).hostname;
    } else {
        hostname = new URL(url).hostname;
    }
    
    const parts = hostname.toLowerCase().split('.');
    if (parts.length < 2) return hostname; 
    
    const slds = ['co', 'com', 'org', 'net', 'gov', 'edu', 'ac', 'uk']; 
    if (parts.length > 2 && slds.includes(parts[parts.length - 2])) {
        return parts.slice(-3).join('.');
    }
    return parts.slice(-2).join('.');
  } catch (e) {
    return null;
  }
};

export const generateOutputExcel = (uniqueData, duplicateData) => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Unique
    const uniqueWsData = [["URL"], ...uniqueData.map(item => [item.url])];
    const uniqueWs = XLSX.utils.aoa_to_sheet(uniqueWsData);
    XLSX.utils.book_append_sheet(wb, uniqueWs, "Unique Prospects");
    
    // Sheet 2: Duplicates
    const duplicateWsData = [["Prospect URL", "Matches Existing Domain"], ...duplicateData.map(item => [item.url, item.domain])];
    const duplicateWs = XLSX.utils.aoa_to_sheet(duplicateWsData);
    XLSX.utils.book_append_sheet(wb, duplicateWs, "Duplicate Prospects");

    XLSX.writeFile(wb, "Unique_Prospects_Report.xlsx");
};