import { FadildevService } from "../services/FadildevService.js";
import { MessageZode, StatusZod } from "../validator/FadildevValidator.js";
import { ImageService } from "../services/ImageService.js";
import { Status } from "@prisma/client";
const service = new FadildevService();
export class FadildevController {
    static async getAll(req, res) {
        try {
            const tacheFadil = await service.findAll(req.user.userId);
            res.json(tacheFadil);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async findById(req, res) {
        try {
            const id = Number(req.params.id);
            const tachfadil = await service.findbyId(id);
            if (!tachfadil || tachfadil.userId !== req.user.userId) {
                return res.status(404).json({ error: "Tâche introuvable pour cet utilisateur" });
            }
            return res.json(tachfadil);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    // static async create(req: AuthRequest, res: Response) {
    //     try {
    //         const data = MessageZode.parse(req.body) as Omit<taskFadil, "id">;
    //         const fadiltache = await service.createFadiltask({
    //             ...data,
    //             userId: req.user!.userId,
    //         });
    //         res.status(201).json(fadiltache);
    //     } catch (error: any) {
    //         const errors = error.errors ?? [{ message: error.message }];
    //         res.status(400).json({ errors });
    //     }
    // }
    //   static async create(req: any, res: Response) {
    //     try {
    //         const { nameFadil, descriptionFadil, imageBase64 } = req.body;
    //         let imageUrl: string | null = null;
    //         if (imageBase64) {
    //             imageUrl = await ImageService.uploadToImgbb(imageBase64);
    //         }
    //         const Data = {
    //             nameFadil,
    //             descriptionFadil,
    //             imageUrl,
    //             userId: req.user.userId,
    //             status: Status.EN_COURS
    //         };
    //         const task = await service.createFadiltask(Data);
    //         res.status(201).json(task);
    //     } catch (error: any) {
    //         res.status(400).json({ error: error.message });
    //     }
    // }
    static async create(req, res) {
        try {
            const { nameFadil, descriptionFadil, startDate, endDate } = req.body;
            let imageUrl = null;
            if (req.file) {
                const base64Image = req.file.buffer.toString("base64");
                imageUrl = await ImageService.uploadToImgbb(base64Image);
            }
            const Data = {
                nameFadil,
                descriptionFadil,
                imageUrl,
                audioUrl: null,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                userId: req.user.userId,
                status: Status.EN_COURS,
                assignedUserId: null
            };
            const task = await service.createFadiltask(Data);
            res.status(201).json(task);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async updateImage(req, res) {
        try {
            const id = Number(req.params.id);
            const { imageBase64 } = req.body;
            if (!imageBase64)
                return res.status(400).json({ error: "Aucune image fournie" });
            const imageUrl = await ImageService.uploadToImgbb(imageBase64);
            const updatedTask = await service.updateFadildev(id, { imageUrl });
            return res.json(updatedTask);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async update(req, res) {
        try {
            const id = Number(req.params.id);
            const parsedData = MessageZode.parse(req.body);
            // Convert date strings to Date objects
            const data = {
                ...parsedData,
                startDate: parsedData.startDate ? new Date(parsedData.startDate) : undefined,
                endDate: parsedData.endDate ? new Date(parsedData.endDate) : undefined
            };
            const fadiltache = await service.updateFadildev(id, data);
            res.json(fadiltache);
        }
        catch (error) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(400).json({ errors });
        }
    }
    static async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await service.deleteFadildev(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async updateStatus(req, res) {
        try {
            const id = Number(req.params.id);
            const { status } = StatusZod.parse(req.body);
            const fadilupdatedTask = await service.updateStatus(id, status);
            res.json(fadilupdatedTask);
        }
        catch (error) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(400).json({ errors });
        }
    }
}
//# sourceMappingURL=FadildevController.js.map