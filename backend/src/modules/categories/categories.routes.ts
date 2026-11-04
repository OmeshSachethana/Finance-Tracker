import { createCategorySchema } from '@finance-tracker/shared';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody } from '../../middleware/validate.ts';
import { toCategoryDto } from './categories.serializer.ts';
import { createCategory, listCategories } from './categories.service.ts';

export const categoriesRouter = Router();

categoriesRouter.use(authenticate);

categoriesRouter.get('/', async (req, res) => {
  const categories = await listCategories(req.user!.sub);
  res.json({ items: categories.map(toCategoryDto) });
});

categoriesRouter.post('/', validateBody(createCategorySchema), async (req, res) => {
  const category = await createCategory(req.user!.sub, req.body);
  res.status(201).json(toCategoryDto(category));
});
