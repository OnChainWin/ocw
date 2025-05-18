'use client';

import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useToast } from '../ui/use-toast';

const isValidImageUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export function ImageUpload({ onImageUrl }: { onImageUrl: (url: string) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUrl = useCallback(() => {
    const url = prompt('Enter image URL (from Unsplash):');
    if (url && isValidImageUrl(url)) {
      onImageUrl(url);
    } else if (url) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid HTTP or HTTPS URL',
        variant: 'destructive',
      });
    }
  }, [onImageUrl, toast]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleImageUrl}
      disabled={isLoading}
    >
      <ImageIcon className="h-4 w-4" />
    </Button>
  );
}