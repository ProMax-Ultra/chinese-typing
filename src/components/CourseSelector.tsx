import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, BookOpen, Check } from 'lucide-react';
import type { CourseManifestItem, Course } from '../types';

interface CourseSelectorProps {
  courseManifest: CourseManifestItem[];
  customCourses: Course[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onGoToHome: () => void;
}

export const CourseSelector: React.FC<CourseSelectorProps> = ({
  courseManifest,
  customCourses,
  selectedCourseId,
  onSelectCourse,
  onGoToHome,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll current course into view when dropdown is opened
  useEffect(() => {
    if (isOpen && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'auto',
      });
    }
  }, [isOpen]);

  const selectedCourseLabel = useMemo(() => {
    if (!selectedCourseId) return '选择章节';

    const manifestMatch = courseManifest.find((item) => item.id === selectedCourseId);
    if (manifestMatch) return manifestMatch.label;

    const customMatch = customCourses.find((item) => item.id === selectedCourseId);
    if (customMatch) return customMatch.name;

    return '选择章节';
  }, [selectedCourseId, courseManifest, customCourses]);

  const handleSelect = (courseId: string) => {
    if (courseId === selectedCourseId) {
      setIsOpen(false);
      return;
    }
    if (courseId === '') {
      onGoToHome();
    } else {
      onSelectCourse(courseId);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900 focus:outline-none transition-all duration-200 active:scale-[0.98] w-36 md:w-52 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
      >
        <span className="flex items-center gap-2 truncate">
          <BookOpen size={15} className="text-indigo-500 shrink-0" />
          <span className="truncate">{selectedCourseLabel}</span>
        </span>
        <ChevronDown
          size={15}
          className={`text-slate-400 shrink-0 transition-transform duration-250 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 md:w-64 origin-top-right rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[360px] overflow-y-auto custom-scrollbar">
          {/* System Courses Section */}
          <div className="space-y-0.5">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              系统章节
            </div>
            {courseManifest.map((course) => {
              const isSelected = selectedCourseId === course.id;
              return (
                <button
                  key={course.id}
                  ref={isSelected ? selectedItemRef : null}
                  onClick={() => handleSelect(course.id)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded-lg transition-colors duration-150 ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate">{course.label}</span>
                  {isSelected && <Check size={14} className="text-indigo-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Custom Courses Section */}
          {customCourses.length > 0 && (
            <>
              <div className="h-px bg-slate-100 my-1.5" />
              <div className="space-y-0.5">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  已导入章节
                </div>
                {customCourses.map((course) => {
                  const isSelected = selectedCourseId === course.id;
                  return (
                    <button
                      key={course.id}
                      ref={isSelected ? selectedItemRef : null}
                      onClick={() => handleSelect(course.id)}
                      className={`flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded-lg transition-colors duration-150 ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-600 font-medium'
                          : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="truncate">{course.name}</span>
                      {isSelected && <Check size={14} className="text-indigo-600 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
