import path from "path";
import AdmZip from "adm-zip";

export function fnUnzip(
  dirPath: string,
  zipFileName: string,
  zipContainerName: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Construct the full path to the zip file
      const zipFilePath = path.join(dirPath, zipFileName);

      // Create an instance of the AdmZip library
      const zip = new AdmZip(zipFilePath);

      // Extract the contents of the zip file to the specified container directory
      zip.extractAllTo(path.join(dirPath, zipContainerName), true);

      // console.log(
      //   `Successfully unzipped ${zipFileName} to ${zipContainerName}`
      // );
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export function fnUnzipSync(
  dirPath: string,
  zipFileName: string,
  zipContainerName: string
): void {
  try {
    // Construct the full path to the zip file
    const zipFilePath = path.join(dirPath, zipFileName);

    // Create an instance of the AdmZip library
    const zip = new AdmZip(zipFilePath);

    // Extract the contents of the zip file to the specified container directory
    zip.extractAllTo(path.join(dirPath, zipContainerName), true);

    console.log(`Successfully unzipped ${zipFileName} to ${zipContainerName}`);
  } catch (error) {
    console.error(`Error unzipping ${zipFileName}: `, error);
    throw error;
  }
}
