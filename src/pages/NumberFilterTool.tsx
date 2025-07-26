import React, { useState } from 'react';
import { Sparkles, Download, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/FileUpload';
import { FilterTypeSelector, FilterType } from '@/components/FilterTypeSelector';
import { StatusMessage, StatusType } from '@/components/StatusMessage';
import { useToast } from '@/hooks/use-toast';
import mascotRobot from '@/assets/mascot-robot.png';

const NumberFilterTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('Region');
  const [status, setStatus] = useState<StatusType>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const { toast } = useToast();

  const handleFilter = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please choose an Excel file first! 📄",
        variant: "destructive",
      });
      return;
    }

    setStatus('processing');
    setStatusMessage("Just a moment… we're sorting your numbers with love! 💝");

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/NumberFilter/filter?filterType=${filterType}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `filtered-numbers-${filterType.toLowerCase()}.zip`;

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setStatus('success');
      setStatusMessage("All set! Your organized ZIP is ready to download. Enjoy! 🎉");
      
      toast({
        title: "Success! 🎉",
        description: "Your filtered numbers have been downloaded successfully!",
      });
    } catch (error) {
      console.error('Filter error:', error);
      setStatus('error');
      setStatusMessage("Oops! Something went wrong. Please check file format or retry. 🔄");
      
      toast({
        title: "Processing failed",
        description: "Please check your file format and try again.",
        variant: "destructive",
      });
    }
  };

  const isProcessing = status === 'processing';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={mascotRobot} 
              alt="Number Filter Tool Mascot" 
              className="w-32 h-32 drop-shadow-lg animate-bounce"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Number Filter Tool
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2">
            Welcome! 🌟 Filter your numbers with a click
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Upload your Excel file and let our friendly robot organize your mobile numbers by region, operator, or both!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-soft hover:shadow-glow transition-shadow duration-300 bg-gradient-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                <Phone className="w-6 h-6 text-primary" />
                <span>Let's Get Started!</span>
                <Sparkles className="w-6 h-6 text-accent-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* File Upload */}
              <FileUpload
                file={file}
                onFileSelect={setFile}
                disabled={isProcessing}
              />

              {/* Filter Type Selection */}
              <FilterTypeSelector
                value={filterType}
                onChange={setFilterType}
                disabled={isProcessing}
              />

              {/* Filter Button */}
              <Button
                variant="hero"
                size="lg"
                onClick={handleFilter}
                disabled={!file || isProcessing}
                className="w-full text-lg py-6"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Processing Your Numbers...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Filter Now! ✨
                  </>
                )}
              </Button>

              {/* Status Message */}
              <StatusMessage
                status={status}
                message={statusMessage}
                className="animate-in fade-in-0 slide-in-from-top-2 duration-300"
              />
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="mt-12 text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>Supported formats: .xlsx files</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your data is processed securely and never stored on our servers. 
              Download starts automatically when processing is complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberFilterTool;