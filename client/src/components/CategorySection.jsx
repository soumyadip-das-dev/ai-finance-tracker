import React, { useState } from "react";

const CategorySection = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState("");

  // Add Category
  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  // Edit Category
  const editCategory = (index) => {
    const updated = prompt("Edit category:", categories[index]);
    if (updated && updated.trim()) {
      const updatedCategories = [...categories];
      updatedCategories[index] = updated;
      setCategories(updatedCategories);
    }
  };

  // Delete Category
  const deleteCategory = (index) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-5 mb-6">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>

      {/* Add Category */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Add new category"
          className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={addCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add
        </button>
      </div>

      {/* Category List */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
          >
            <span>{cat}</span>

            <button
              onClick={() => editCategory(index)}
              className="text-blue-500 text-sm"
            >
              ✏️
            </button>

            <button
              onClick={() => deleteCategory(index)}
              className="text-red-500 text-sm"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;