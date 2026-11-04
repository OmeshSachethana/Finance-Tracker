import type { Category } from '@finance-tracker/shared';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/components/toast/useToast';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/features/categories/api';
import { CategoryForm } from '@/features/categories/CategoryForm';
import { CategoryIcon } from '@/features/categories/CategoryIcon';
import { DeleteCategoryDialog } from '@/features/categories/DeleteCategoryDialog';

type Editing =
  { mode: 'create'; type: Category['type'] } | { mode: 'edit'; category: Category } | null;

function CategoryList({
  title,
  categories,
  onAdd,
  onEdit,
  onDelete,
}: {
  title: string;
  categories: Category[];
  onAdd: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onAdd}>
          <Plus className="size-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center gap-3 py-2.5">
              <CategoryIcon icon={category.icon} color={category.color} />
              <span className="flex-1 text-sm font-medium">{category.name}</span>
              <button
                type="button"
                onClick={() => onEdit(category)}
                aria-label={`Edit ${category.name}`}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
              >
                <Pencil className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(category)}
                aria-label={`Delete ${category.name}`}
                className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function CategoriesPage() {
  const toast = useToast();
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const expense = categories?.filter((c) => c.type === 'expense') ?? [];
  const income = categories?.filter((c) => c.type === 'income') ?? [];

  return (
    <>
      <PageHeader
        title="Categories"
        description="Group your spending and income the way you think about it."
      />

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <CategoryList
            title="Expense categories"
            categories={expense}
            onAdd={() => setEditing({ mode: 'create', type: 'expense' })}
            onEdit={(category) => setEditing({ mode: 'edit', category })}
            onDelete={setDeleting}
          />
          <CategoryList
            title="Income categories"
            categories={income}
            onAdd={() => setEditing({ mode: 'create', type: 'income' })}
            onEdit={(category) => setEditing({ mode: 'edit', category })}
            onDelete={setDeleting}
          />
        </div>
      )}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.mode === 'edit' ? 'Edit category' : 'Add category'}
      >
        {editing && (
          <CategoryForm
            category={editing.mode === 'edit' ? editing.category : undefined}
            defaultType={editing.mode === 'create' ? editing.type : undefined}
            onCancel={() => setEditing(null)}
            onSubmit={async (input) => {
              if (editing.mode === 'edit') {
                const { type: _type, ...changes } = input;
                await updateCategory.mutateAsync({ id: editing.category.id, ...changes });
                toast('Category updated');
              } else {
                await createCategory.mutateAsync(input);
                toast('Category added');
              }
              setEditing(null);
            }}
          />
        )}
      </Modal>

      <DeleteCategoryDialog
        category={deleting}
        categories={categories ?? []}
        onClose={() => setDeleting(null)}
        onDelete={async (args) => {
          await deleteCategory.mutateAsync(args);
          toast('Category deleted');
        }}
      />
    </>
  );
}
