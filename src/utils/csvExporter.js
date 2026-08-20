/**
 * Utility to export JSON data to Excel-compatible UTF-8 CSV
 */
export const exportToCSV = (data, headersMap, filename = "export.csv") => {
  if (!data || data.length === 0) {
    alert("निर्यात करने के लिए कोई डेटा नहीं है।");
    return;
  }

  // Extract the keys we want to include based on the headersMap
  const keys = Object.keys(headersMap);

  // Generate CSV headers line
  const csvHeaders = keys.map(k => `"${String(headersMap[k]).replace(/"/g, '""')}"`).join(",");

  // Generate CSV data rows
  const csvRows = data.map(item => {
    return keys.map(k => {
      let val = item[k] === undefined || item[k] === null ? "" : item[k];
      
      // If the field is an array or object, stringify it
      if (typeof val === 'object') {
        val = JSON.stringify(val);
      }
      
      // Escape double quotes and wrap in quotes
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(",");
  });

  // Combine headers and rows
  const csvContent = [csvHeaders, ...csvRows].join("\n");

  // Prepend UTF-8 BOM character so Excel opens Hindi characters properly
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

  // Trigger file download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
