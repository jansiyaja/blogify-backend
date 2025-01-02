import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

 export class ImageUploader {
    private _s3: S3Client;

    constructor(s3Client: S3Client) {
        this._s3 = s3Client;
    }

    async uploadImageToS3(buffer: Buffer, mimeType: string|undefined): Promise<string> {
        console.log("image uploader");

       
        if (!process.env.AWS_S3_BUCKET_NAME || !process.env.AWS_REGION) {
            throw new Error('Missing AWS environment variables');
        }

        const key = this.generateRandomKey();

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        };

        console.log("image uploader PARAMS", params);

        const command = new PutObjectCommand(params);

        try {
            await this._s3.send(command);
            console.log("image uploaded successfully");

          
            const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            console.log("Uploaded image URL:", imageUrl);

            return imageUrl;
        } catch (error) {
            console.error('Error uploading image to S3:', error);
            throw new Error('Could not upload image to S3');
        }
    }

    private generateRandomKey(): string {
        return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
}

