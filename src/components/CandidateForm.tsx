import { Candidate } from '@/types';
import { useState, useRef } from 'react';

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
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is a PDF
    if (file.type !== 'application/pdf') {
      setResumeUploadError('Please upload a PDF file.');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setResumeUploadError('File too large. Maximum size is 5MB.');
      return;
    }
    
    setResumeFile(file);
    setResumeUploadError(null);
    setResumeUploading(true);
    
    try {
      // For now, just store the file name as we can't directly upload to Supabase 
      // from the client without proper setup
      const resumeUrl = `resume_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      // Update form data with resume URL
      setFormData(prev => ({
        ...prev,
        resume: resumeUrl
      }));
      
      // Simulate short delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Error handling resume:', error);
      setResumeUploadError('Failed to process resume. Please try again.');
    } finally {
      setResumeUploading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make a deep copy of the form data to avoid reference issues
    const submissionData = JSON.parse(JSON.stringify(formData));
    
    // Ensure skills is an array
    if (!Array.isArray(submissionData.skills) || submissionData.skills.length === 0) {
      submissionData.skills = [];
    }
    
    // Ensure experience is a number
    if (typeof submissionData.experience !== 'number') {
      submissionData.experience = Number(submissionData.experience) || 0;
    }
    
    // Log the final data before submission
    console.log('Submitting candidate data:', submissionData);
    
    onSubmit(submissionData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-secondary/80">
            Full Name*
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-secondary/20 py-2 px-3 text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-secondary/80">
            Email Address*
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-secondary/20 py-2 px-3 text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-secondary/80">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-secondary/20 py-2 px-3 text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-secondary/80">
            Position Applied For*
          </label>
          <input
            id="position"
            name="position"
            type="text"
            required
            value={formData.position}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-secondary/20 py-2 px-3 text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-secondary/80">
            Years of Experience*
          </label>
          <input
            id="experience"
            name="experience"
            type="number"
            min="0"
            max="50"
            required
            value={formData.experience}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-secondary/20 py-2 px-3 text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-secondary/80">
            Status*
          </label>
          <select
            id="status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-secondary/20 py-2 px-3 text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
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
        <label htmlFor="education" className="block text-sm font-medium text-secondary/80">
          Education*
        </label>
        <textarea
          id="education"
          name="education"
          rows={3}
          required
          value={formData.education}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-secondary/20 py-2 px-3 text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
        ></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-secondary/80">
          Skills*
        </label>
        <div className="mt-1 flex rounded-md">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="block w-full rounded-l-md border border-secondary/20 py-2 px-3 text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
            placeholder="Add a skill (e.g. JavaScript, React, etc.)"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="inline-flex items-center rounded-r-md border border-l-0 border-secondary/20 bg-secondary px-3 py-2 text-sm font-medium text-white hover:bg-secondary/90 focus:outline-none"
          >
            Add
          </button>
        </div>
        
        {formData.skills && formData.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span 
                key={index}
                className="inline-flex items-center rounded-full bg-primary/10 py-1 pl-3 pr-2 text-sm font-medium text-primary"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary/80 hover:bg-primary/20 hover:text-primary focus:outline-none"
                >
                  <span className="sr-only">Remove {skill}</span>
                  <svg 
                    className="h-3 w-3" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="resume" className="block text-sm font-medium text-secondary/80">
          Resume (PDF, max 5MB)
        </label>
        <div className="mt-1 flex items-center">
          <input
            ref={fileInputRef}
            id="resume"
            name="resume"
            type="file"
            accept=".pdf"
            onChange={handleResumeChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={resumeUploading}
            className="inline-flex items-center rounded-md border border-secondary/20 bg-white px-3 py-2 text-sm font-medium text-secondary shadow-sm hover:bg-secondary/5 focus:outline-none"
          >
            {resumeUploading ? (
              <>
                <svg 
                  className="mr-2 h-4 w-4 animate-spin" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg 
                  className="mr-2 h-4 w-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
                {formData.resume ? 'Change Resume' : 'Upload Resume'}
              </>
            )}
          </button>
          {formData.resume && (
            <span className="ml-3 text-sm text-secondary/80">
              {resumeFile?.name || formData.resume}
            </span>
          )}
        </div>
        {resumeUploadError && (
          <p className="mt-1 text-sm text-red-600">{resumeUploadError}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-secondary/80">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-secondary/20 py-2 px-3 text-secondary shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
        ></textarea>
      </div>
      
      <div className="pt-4 border-t border-secondary/10">
        <button
          type="submit"
          disabled={isSubmitting || resumeUploading}
          className="w-full md:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Candidate'}
        </button>
      </div>
    </form>
  );
} 