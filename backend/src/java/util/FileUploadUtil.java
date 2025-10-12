package util;

import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

public class FileUploadUtil {

    private static final String UPLOAD_DIR = "uploads";
    
    public static String saveFile(Part filePart, String subDirectory) throws IOException {
        if (filePart == null || filePart.getSize() == 0) {
            return null;
        }

        // Create upload directory if it doesn't exist
        String uploadPath = UPLOAD_DIR + File.separator + subDirectory;
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Generate unique filename
        String fileName = filePart.getSubmittedFileName();
        String fileExtension = fileName.substring(fileName.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

        // Save file
        File file = new File(uploadDir, uniqueFileName);
        Files.copy(filePart.getInputStream(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);

        return subDirectory + "/" + uniqueFileName;
    }

    public static boolean deleteFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return false;
        }
        
        File file = new File(UPLOAD_DIR + File.separator + filePath);
        return file.exists() && file.delete();
    }

    public static String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }

    public static boolean isImageFile(String fileName) {
        String extension = getFileExtension(fileName);
        return extension.equals("jpg") || extension.equals("jpeg") || 
               extension.equals("png") || extension.equals("gif");
    }

    public static boolean isAllowedFileType(String fileName) {
        String extension = getFileExtension(fileName);
        return isImageFile(fileName) || 
               extension.equals("mp4") || extension.equals("avi") || 
               extension.equals("pdf") || extension.equals("doc") || 
               extension.equals("docx") || extension.equals("txt");
    }
}