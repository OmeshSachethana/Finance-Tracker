import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { toCategoryDto } from './categories.serializer.ts';
import { listCategories } from './categories.service.ts';

export const categoriesRouter = Router();

categoriesRouter.use(authenticate);

categoriesRouter.get('/', async (req, res) => {
  const categories = await listCategories(req.user!.sub);
  res.json({ items: categories.map(toCategoryDto) });
});
