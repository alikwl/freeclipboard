import React, { useState, useEffect } from 'react';
import { Category } from '../lib/supabase';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../lib/clipboard';
import { Plus, Edit3, Trash2, X, Save, Folder, Code, FileText, Star, Heart, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface CategoryManagerProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  onCategoriesChange?: () => void;
}

const CATEGORY_ICONS = [
  { name: 'folder', icon: Folder },
  { name: 'code', icon: Code },
  { name: 'file-text', icon: FileText },
  { name: 'star', icon: Star },
  { name: 'heart', icon: Heart },
  { name: 'zap', icon: Zap },
];

const CATEGORY_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export default function CategoryManager({ selectedCategory, onCategorySelect, onCategoriesChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#3B82F6',
    icon: 'folder'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      
      // Select first category if none selected
      if (!selectedCategory && data.length > 0) {
        onCategorySelect(data[0].id);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const category = await createCategory(newCategory);
      setCategories(prev => [...prev, category]);
      setNewCategory({ name: '', color: '#3B82F6', icon: 'folder' });
      setIsCreating(false);
      toast.success('Category created');
      onCategoriesChange?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create category');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Category>) => {
    try {
      const updated = await updateCategory(id, updates);
      setCategories(prev => prev.map(cat => cat.id === id ? updated : cat));
      setEditingId(null);
      toast.success('Category updated');
      onCategoriesChange?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? Items in this category will be uncategorized.')) return;

    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      
      // Select first remaining category if deleted category was selected
      if (selectedCategory === id && categories.length > 1) {
        const remaining = categories.filter(cat => cat.id !== id);
        onCategorySelect(remaining[0]?.id || '');
      }
      
      toast.success('Category deleted');
      onCategoriesChange?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-4 border-r border-gray-200 bg-white h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-sm md:text-base">Categories</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Add Category"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1">
        {/* All Items */}
        <button
          onClick={() => onCategorySelect('')}
          className={`w-full flex items-center px-2 md:px-3 py-2 rounded-lg text-left transition-colors text-sm md:text-base ${
            selectedCategory === '' 
              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Folder className="h-4 w-4 mr-3 text-gray-500" />
          <span className="font-medium truncate">All Items</span>
        </button>

        {/* Categories */}
        {categories.map((category) => {
          const IconComponent = CATEGORY_ICONS.find(i => i.name === category.icon)?.icon || Folder;
          
          return (
            <div key={category.id} className="group relative">
              {editingId === category.id ? (
                <div className="p-2 border border-gray-300 rounded-lg bg-white">
                  <input
                    type="text"
                    defaultValue={category.name}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1 mb-2"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdate(category.id, { name: e.currentTarget.value });
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex justify-between">
                    <div className="flex space-x-1">
                      {CATEGORY_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => handleUpdate(category.id, { color })}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onCategorySelect(category.id)}
                  className={`w-full flex items-center px-2 md:px-3 py-2 rounded-lg text-left transition-colors text-sm md:text-base ${
                    selectedCategory === category.id 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent 
                    className="h-4 w-4 mr-3" 
                    style={{ color: category.color }}
                  />
                  <span className="font-medium flex-1 truncate">{category.name}</span>
                  
                  <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(category.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(category.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </button>
              )}
            </div>
          );
        })}

        {/* Create New Category */}
        {isCreating && (
          <div className="p-2 md:p-3 border border-gray-300 rounded-lg bg-white">
            <input
              type="text"
              placeholder="Category name"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              className="w-full text-xs md:text-sm border border-gray-300 rounded px-2 py-1 mb-2"
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex space-x-1">
                {CATEGORY_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                    className={`w-4 h-4 rounded-full border-2 ${
                      newCategory.color === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-2 py-1 md:px-3 md:py-1 rounded text-xs md:text-sm hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="h-3 w-3 mr-1" />
                Save
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewCategory({ name: '', color: '#3B82F6', icon: 'folder' });
                }}
                className="text-gray-500 hover:text-gray-700 px-2 py-1 md:px-3 md:py-1 rounded text-xs md:text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}