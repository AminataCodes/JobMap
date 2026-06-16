import multer from 'multer'

// Stockage en mémoire (buffer) → Cloudinary se charge du reste
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'cv') {
        if (file.mimetype === 'application/pdf') {
            cb(null, true)
        } else {
            cb(new Error('Le CV doit être un PDF'), false)
        }
    } else if (file.fieldname === 'logo' || file.fieldname === 'photoProfil') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Le fichier doit être une image'), false)
        }
    } else {
        cb(null, true)
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
})