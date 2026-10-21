import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/multer.js";
import { validateSchema } from "./middlewares/validateSchema.js";
import { isAuthenticated } from "./middlewares/IsAuthenticated.js";
import { isAdmin } from "./middlewares/IsAdmin.js";
import { authAdminSchema } from "./schemas/adminSchema.js";
import {
  createConteudoSchema,
  listConteudosAdminSchema,
  listConteudosSchema,
  updateConteudoSchema,
  updatePublicadoSchema,
} from "./schemas/conteudoSchema.js";
import { createDesafioSchema, updateDesafioSchema } from "./schemas/desafioSchema.js";
import { AuthAdminController } from "./controllers/admin/AuthAdminController.js";
import { DetailAdminController } from "./controllers/admin/DetailAdminController.js";
import { ListConteudosAdminController } from "./controllers/conteudo/ListConteudosAdminController.js";
import { CreateConteudoController } from "./controllers/conteudo/CreateConteudoController.js";
import { UpdateConteudoController } from "./controllers/conteudo/UpdateConteudoController.js";
import { UpdatePublicadoConteudoController } from "./controllers/conteudo/UpdatePublicadoConteudoController.js";
import { DeleteConteudoController } from "./controllers/conteudo/DeleteConteudoController.js";
import { ListDesafiosAdminController } from "./controllers/desafio/ListDesafiosAdminController.js";
import { CreateDesafioController } from "./controllers/desafio/CreateDesafioController.js";
import { UpdateDesafioController } from "./controllers/desafio/UpdateDesafioController.js";
import { DeleteDesafioController } from "./controllers/desafio/DeleteDesafioController.js";
import { ListConteudosController } from "./controllers/conteudo/ListConteudosController.js";
import { GetConteudoController } from "./controllers/conteudo/GetConteudoController.js";
import { ListDesafiosController } from "./controllers/desafio/ListDesafiosController.js";
import { ListCategoriasController } from "./controllers/categoria/ListCategoriasController.js";

const router = Router();
const upload = multer(uploadConfig);

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Públicas (somente leitura, sem login)
router.get("/conteudos", validateSchema(listConteudosSchema), new ListConteudosController().handle);
router.get("/conteudos/:id", new GetConteudoController().handle);
router.get("/desafios", new ListDesafiosController().handle);
router.get("/categorias", new ListCategoriasController().handle);

// Admin: sessão
router.post("/session", validateSchema(authAdminSchema), new AuthAdminController().handle);
router.get("/me", isAuthenticated, isAdmin, new DetailAdminController().handle);

// Admin: conteúdos (autenticação vem antes do upload, para não receber arquivo de quem não está logado)
router.get("/admin/conteudos", isAuthenticated, isAdmin, validateSchema(listConteudosAdminSchema), new ListConteudosAdminController().handle);
router.post("/admin/conteudos", isAuthenticated, isAdmin, upload.single("file"), validateSchema(createConteudoSchema), new CreateConteudoController().handle);
router.put("/admin/conteudos/:id", isAuthenticated, isAdmin, upload.single("file"), validateSchema(updateConteudoSchema), new UpdateConteudoController().handle);
router.patch("/admin/conteudos/:id/publicado", isAuthenticated, isAdmin, validateSchema(updatePublicadoSchema), new UpdatePublicadoConteudoController().handle);
router.delete("/admin/conteudos/:id", isAuthenticated, isAdmin, new DeleteConteudoController().handle);

// Admin: desafios
router.get("/admin/desafios", isAuthenticated, isAdmin, new ListDesafiosAdminController().handle);
router.post("/admin/desafios", isAuthenticated, isAdmin, validateSchema(createDesafioSchema), new CreateDesafioController().handle);
router.put("/admin/desafios/:id", isAuthenticated, isAdmin, validateSchema(updateDesafioSchema), new UpdateDesafioController().handle);
router.delete("/admin/desafios/:id", isAuthenticated, isAdmin, new DeleteDesafioController().handle);

export { router };
