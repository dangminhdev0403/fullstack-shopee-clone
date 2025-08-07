package com.minh.shopee.services.utils.files;

import org.springframework.web.multipart.MultipartFile;

/**
 * Giao diện định nghĩa các phương thức để xử lý việc upload và xóa file.
 * Cung cấp các chức năng để lưu file vào một thư mục con cụ thể, xóa từng file
 * riêng lẻ,
 * và xóa toàn bộ thư mục cùng với nội dung bên trong.
 */
public interface UploadServer {

    /**
     * Lưu file được upload vào một thư mục con cụ thể và trả về URL truy cập.
     * File được lưu với tên duy nhất để tránh xung đột, và thư mục sẽ được tạo nếu
     * chưa tồn tại.
     *
     * @param file   Đối tượng {@link MultipartFile} cần upload.
     * @param folder Tên thư mục con trong thư mục upload được cấu hình, nơi file sẽ
     *               được lưu.
     * @return URL của file đã lưu, hoặc {@code null} nếu file rỗng hoặc xảy ra lỗi.
     * @throws java.io.IOException Nếu xảy ra lỗi I/O trong quá trình lưu file hoặc
     *                             tạo thư mục.
     */
    String handleSaveUploadFile(MultipartFile file, String folder);

    /**
     * Xóa một file cụ thể trong thư mục con được chỉ định.
     * File được xác định bởi tên của nó trong thư mục upload được cấu hình và thư
     * mục con.
     *
     * @param fileName Tên của file cần xóa.
     * @param folder   Tên thư mục con trong thư mục upload chứa file.
     * @return {@code true} nếu file được xóa thành công, {@code false} nếu file
     *         không tồn tại,
     *         tên file không hợp lệ, hoặc xảy ra lỗi.
     * @throws java.io.IOException Nếu xảy ra lỗi I/O trong quá trình xóa file.
     */
    boolean handleDeleteFile(String fileName, String folder);

    /**
     * Xóa toàn bộ thư mục con và tất cả nội dung bên trong, bao gồm file và thư mục
     * con.
     * Thư mục được xác định là một thư mục con trong thư mục upload được cấu hình.
     *
     * @param folder Tên thư mục con cần xóa.
     * @return {@code true} nếu thư mục và nội dung được xóa thành công,
     *         {@code false} nếu
     *         thư mục không tồn tại hoặc xảy ra lỗi.
     * @throws java.io.IOException Nếu xảy ra lỗi I/O trong quá trình xóa thư mục
     *                             hoặc nội dung.
     */
    boolean deleteAllFiles(String folder);
}