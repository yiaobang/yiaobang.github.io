// 获取指定文件夹中的所有照片
export const getPhotosFromFolder = async (folderName: string): Promise<string[]> => {
  try {
    // 动态导入文件夹中的所有图片
    const images = import.meta.glob('/src/assets/images/**/*.{jpg,jpeg,png,heic}', { eager: true });
    
    const folderPhotos: string[] = [];
    
    Object.keys(images).forEach((path) => {
      if (path.includes(folderName)) {
        const imageModule = images[path] as { default: string };
        folderPhotos.push(imageModule.default);
      }
    });
    
    return folderPhotos;
  } catch (error) {
    console.error('Error loading photos:', error);
    return [];
  }
};

// 从文件名提取时间信息
export const extractTimeFromFilename = (filename: string): string => {
  const match = filename.match(/(\d{8}_\d{6})/);
  if (match) {
    const dateTime = match[1];
    const year = dateTime.substring(0, 4);
    const month = dateTime.substring(4, 6);
    const day = dateTime.substring(6, 8);
    const hour = dateTime.substring(9, 11);
    const minute = dateTime.substring(11, 13);
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
  return '';
};