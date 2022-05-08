import multer, {Multer, StorageEngine} from "multer";
import path from "path";


const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
        cb(null, uniqueSuffix)
    }
})

const upload: Multer = multer({storage})


export default upload
