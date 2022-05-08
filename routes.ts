import {Router} from "express";
import {
    createHero,
    deleteHeroByNickname,
    editHero,
    getAllHeroes,
    getHeroByNickname,
    isNicknameUnique
} from "./controller";
import upload from "./multer";



const router: Router = Router()

router.get('/', getAllHeroes)
router.get('/:nickname', getHeroByNickname)
router.delete('/:nickname', deleteHeroByNickname)
router.put('/:oldNickname', upload.array('images', 6), editHero)
router.get('/isUnique/:nickname', isNicknameUnique)
router.post('/', upload.array('images', 6), createHero)



export default router
