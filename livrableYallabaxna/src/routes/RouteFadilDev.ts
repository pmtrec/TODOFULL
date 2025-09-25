import { Router } from "express";
import { FadildevController } from "../controllers/FadildevController.js"; 

import { authenticate } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";
// import { authorize } from "../middlewares/rbacMiddleware.js";

const router = Router();
 
router.use(authenticate);


router.get("/", FadildevController.getAll);           
router.get("/:id", FadildevController.findById);     
router.post("/",upload.single("image"), FadildevController.create);         
router.put("/:id", FadildevController.update);       
router.delete("/:id", FadildevController.delete);  
 
router.patch("/:id/image", FadildevController.updateImage);
// router.patch("/:id/audio", upload.single("audio"), FadildevController.updateAudio);
router.patch("/:id/status",FadildevController.updateStatus);
export default router;
