import express from "express";
import userController from "../controllers/user.controller";

const router = express.Router();

router.post("/create", userController.createUser);
// router.get('/get/:authorId', controller.readAuthor);
// router.get('/get', controller.readAll);
// router.patch('/update/:authorId', ValidateJoi(Schemas.author.update), controller.updateAuthor);
// router.delete('/delete/:authorId', controller.deleteAuthor);

export = router;
