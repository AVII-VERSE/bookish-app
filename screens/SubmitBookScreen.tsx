import React, { useState, useRef } from 'react';
import { ScreenName } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { generateBookDescription } from '../services/geminiService';

interface SubmitBookScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const SubmitBookScreen: React.FC<SubmitBookScreenProps> = ({ onNavigate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    author: '',
    description: '',
    price: '',
    format: 'Ebook',
    genre: '',
    coverImage: null as string | null,
  });

  const handleGenerate = async () => {
    if (!formData.title || !formData.author) {
      alert("Please enter a title and author to generate a synopsis.");
      return;
    }
    
    setIsGenerating(true);
    // Include subtitle as a keyword hint if present
    const keywords = formData.subtitle ? `Subtitle: ${formData.subtitle}` : 'Fiction, engaging plot';
    const generated = await generateBookDescription(formData.title, formData.author, keywords);
    
    setFormData(prev => ({ ...prev, description: generated }));
    setIsGenerating(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-6 max-w-lg mx-auto bg-background-light dark:bg-background-dark animate-in slide-in-from-bottom duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark px-4 py-3">
        <button onClick={() => onNavigate(ScreenName.DASHBOARD)} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
            <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Submit Your Book</h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
            <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      <main className="flex-1 px-4 py-6">
        {/* Stepper */}
        <div className="mb-8">
            <p className="mb-2 text-center text-sm font-medium text-slate-500">Step 1 of 4</p>
            <div className="flex w-full gap-2">
                <div className="h-1 flex-1 rounded-full bg-primary"></div>
                <div className="h-1 flex-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                <div className="h-1 flex-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                <div className="h-1 flex-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-primary dark:text-secondary mb-2">Book Details</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Provide the essential details about your book. This information will be used on your book's public page.</p>
            
            <div className="flex flex-col gap-6">
                {/* Cover Image Upload */}
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Book Cover</span>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-48 bg-slate-50 dark:bg-slate-900 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary dark:hover:border-secondary transition-colors relative overflow-hidden group"
                    >
                        {formData.coverImage ? (
                            <>
                                <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-white">edit</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-slate-400 text-3xl mb-2">add_photo_alternate</span>
                                <span className="text-xs text-slate-500 font-medium text-center px-2">Upload Cover</span>
                            </>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            className="hidden" 
                            accept="image/*"
                        />
                    </div>
                </div>

                <Input 
                    label="Book Title" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., The Midnight Library" 
                />
                <Input 
                    label="Subtitle (Optional)" 
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="A Novel" 
                />
                <Input 
                    label="Author Name" 
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="e.g., Matt Haig" 
                />

                {/* Price and Format */}
                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        label="Price ($)" 
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        type="number"
                        min="0"
                        step="0.01"
                    />
                     <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-800 dark:text-slate-200">Format</label>
                        <select 
                            name="format"
                            value={formData.format}
                            onChange={handleInputChange}
                            className="form-select h-12 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm font-normal text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-secondary"
                        >
                            <option value="Ebook">Ebook</option>
                            <option value="Paperback">Paperback</option>
                            <option value="Hardcover">Hardcover</option>
                            <option value="Audiobook">Audiobook</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between py-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Is this book part of a series?</p>
                    <button className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative transition-colors focus:ring-2 ring-primary">
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"></span>
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Synopsis / Description</span>
                        <button 
                            type="button"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="text-xs font-bold text-secondary flex items-center gap-1 hover:text-white transition-colors"
                        >
                            {isGenerating ? (
                                <span className="animate-spin material-symbols-outlined text-sm">refresh</span>
                            ) : (
                                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                            )}
                            {isGenerating ? 'Thinking...' : 'Generate with AI'}
                        </button>
                    </div>
                    <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="form-textarea w-full rounded-lg border border-slate-300 bg-white p-3 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-secondary min-h-[120px]"
                        placeholder="Enter a compelling summary of your book..." 
                    />
                </div>

                {/* Categorization Section */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Categorization</h3>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-800 dark:text-slate-200">Primary Genre</label>
                        <select 
                            name="genre"
                            value={formData.genre}
                            onChange={handleInputChange}
                            className="form-select h-12 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm font-normal text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-secondary"
                        >
                            <option value="" disabled>Select a genre</option>
                            <option value="Fiction">Fiction</option>
                            <option value="Non-fiction">Non-fiction</option>
                            <option value="Sci-Fi">Sci-Fi</option>
                            <option value="Fantasy">Fantasy</option>
                            <option value="Mystery">Mystery</option>
                            <option value="Romance">Romance</option>
                            <option value="Thriller">Thriller</option>
                            <option value="Biography">Biography</option>
                            <option value="History">History</option>
                        </select>
                    </div>
                </div>

            </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="sticky bottom-0 z-10 p-4 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 flex gap-4">
        <Button variant="outline" className="flex-1 bg-white dark:bg-transparent">Save Draft</Button>
        <Button variant="secondary" className="flex-1 dark:text-slate-900">Next: Review</Button>
      </footer>
    </div>
  );
};