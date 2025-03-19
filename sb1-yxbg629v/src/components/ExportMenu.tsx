import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, FileJson, FileCode } from 'lucide-react';
import { cn } from '../utils';
import { ExportFormat } from '../lib/export';

interface ExportMenuProps {
  onExport: (format: ExportFormat) => void;
  darkMode: boolean;
}

export function ExportMenu({ onExport, darkMode }: ExportMenuProps) {
  const exportOptions = [
    { format: 'pdf' as ExportFormat, icon: FileText, label: 'PDF' },
    { format: 'markdown' as ExportFormat, icon: FileCode, label: 'Markdown' },
    { format: 'html' as ExportFormat, icon: FileJson, label: 'HTML' },
    { format: 'image' as ExportFormat, icon: Image, label: 'Image' }
  ];

  return (
    <div className={cn(
      "absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50",
      darkMode ? "bg-gray-800" : "bg-white"
    )}>
      {exportOptions.map(({ format, icon: Icon, label }) => (
        <motion.button
          key={format}
          whileHover={{ x: 5 }}
          onClick={() => onExport(format)}
          className={cn(
            "w-full px-4 py-2 text-sm flex items-center gap-2",
            "transition-colors duration-200",
            darkMode
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <Icon size={16} />
          Export as {label}
        </motion.button>
      ))}
    </div>
  );
}