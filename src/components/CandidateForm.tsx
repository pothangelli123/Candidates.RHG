import { Candidate } from '@/types';
import { useState } from 'react';

type CandidateFormProps = {
  initialData?: Partial<Candidate>;
  onSubmit: (data: Partial<Candidate>) => void;
  isSubmitting: boolean;
};

export default function CandidateForm({ 
  initialData = {}, 
  onSubmit,
  isSubmitting
}: CandidateFormProps) {
  const [formData, setFormData] = useState<Partial<Candidate>>({
    name: '',
    email: '',
    phone: '',
    position: '',
    skills: [],
    experience: 0,
    education: '',
    notes: '',
    status: 'new',
    ...initialData
  });
  
  const [skillInput, setSkillInput] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value, 10) || 0 : value
    }));
  };
  
  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), skillInput.trim()]
    }));
    setSkillInput('');
  };
  
  const handleRemoveSkill = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter((_, index) => index !== indexToRemove)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground/80">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground shadow-sm focus:border-foreground/50 focus:outline-none sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground/80">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground shadow-sm focus:border-foreground/50 focus:outline-none sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground/80">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground shadow-sm focus:border-foreground/50 focus:outline-none sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-foreground/80">
            Position *
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground shadow-sm focus:border-foreground/50 focus:outline-none sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-foreground/80">
            Years of Experience *
          </label>
          <input
            type="number"
            id="experience"
            name="experience"
            min="0"
            value={formData.experience || 0}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground shadow-sm focus:border-foreground/50 focus:outline-none sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="education" className="block text-sm font-medium text-foreground/80">
            Education *
          </label>
          <input
            type="text"
            id="education"
            name="education"
            value={formData.education || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground shadow-sm focus:border-foreground/50 focus:outline-none sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-foreground/80">
            Status *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || 'new'}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground shadow-sm focus:border-foreground/50 focus:outline-none sm:text-sm"
          >
            <option value="new">New</option>
            <option value="reviewing">Reviewing</option>
            <option value="interviewed">Interviewed</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground/80">
          Skills *
        </label>
        <div className="mt-1 flex rounded-md">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="block w-full rounded-l-md border border-foreground/20 bg-background px-3 py-2 text-foreground shadow-sm focus:border-foreground/50 focus:outline-none sm:text-sm"
            placeholder="Add a skill"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="inline-flex items-center rounded-r-md border border-l-0 border-foreground/20 bg-foreground/5 px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-foreground/10"
          >
            Add
          </button>
        </div>
        
        {formData.skills && formData.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-foreground/10 px-2.5 py-0.5 text-xs font-medium text-foreground/80"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-foreground/60 hover:bg-foreground/20 hover:text-foreground/80 focus:outline-none"
                >
                  <span className="sr-only">Remove {skill}</span>
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-foreground/80">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground shadow-sm focus:border-foreground/50 focus:outline-none sm:text-sm"
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground/50 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Candidate'}
        </button>
      </div>
    </form>
  );
} 