import axios from "axios";
import FormData from "form-data";

const IMGBB_API_KEY = "b33ea484544a58932f50bad3f147bfab";

export class ImageService {
    static async uploadToImgbb(base64Image: string): Promise<string> {
        const form = new FormData();
        form.append("key", IMGBB_API_KEY);
        form.append("image", base64Image);

        const response = await axios.post("https://api.imgbb.com/1/upload", form, {
            headers: form.getHeaders(),
        });

        return response.data.data.url;
    }
}
