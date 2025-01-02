import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(), 
});



export const uploadProfileImage = upload.single('image');
export const uploadBlogData = upload.single('coverImage');
export const uploadBlogImage = upload.single('BlogImage');
export const uploadAdd = upload.single('thumbnail');

