import cloudinary from '../config/cloudinary.js'
import { Readable } from 'stream'

/**
 * Convertit un buffer en stream lisible pour Cloudinary
 */
const bufferToStream = (buffer) => {
    const readable = new Readable()
    readable.push(buffer)
    readable.push(null)
    return readable
}

/**
 * Upload un fichier vers Cloudinary
 * @param {Express.Multer.File} file - fichier multer (buffer en mémoire)
 * @param {string} folder - dossier cible : 'cv' | 'logos'
 * @returns {Promise<string>} URL publique du fichier
 */
export const uploadFile = (file, folder) => {
    return new Promise((resolve, reject) => {
        const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image'

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `jobmap/${folder}`,
                resource_type: resourceType,
            },
            (error, result) => {
                if (error) return reject(error)
                resolve(result.secure_url)
            }
        )

        bufferToStream(file.buffer).pipe(uploadStream)
    })
}

/**
 * Supprimer un fichier Cloudinary à partir de son URL
 * @param {string} fileUrl
 */
export const deleteFile = async (fileUrl) => {
    try {
        const parts = fileUrl.split('/')
        const filename = parts[parts.length - 1].split('.')[0]
        const folder = parts[parts.length - 2]
        const publicId = `jobmap/${folder}/${filename}`
        await cloudinary.uploader.destroy(publicId)
    } catch (err) {
        console.error('Erreur suppression Cloudinary:', err.message)
    }
}