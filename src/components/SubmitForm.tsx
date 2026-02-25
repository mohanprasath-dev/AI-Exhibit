"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Upload,
  Wand2,
  Link as LinkIcon,
  FileText,
  User,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Image as ImageIcon,
  Video,
  Music,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { submitEntrySchema, type SubmitEntryFormData } from "@/lib/validations";
import { AI_TOOLS } from "@/types";
import { defaultCategories } from "@/components/CategoryTabs";
import { cn, bytesToSize } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Upload", icon: Upload, description: "Upload your creation" },
  { id: 2, title: "Prompt", icon: Wand2, description: "Share the prompt used" },
  { id: 3, title: "Details", icon: FileText, description: "Add description" },
  { id: 4, title: "Creator", icon: User, description: "Your information" },
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
];

export function SubmitForm() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<SubmitEntryFormData>({
    resolver: zodResolver(submitEntrySchema),
    defaultValues: {
      title: "",
      category: "",
      prompt: "",
      tool_used: "",
      share_link: "",
      description: "",
      creator_name: user?.user_metadata?.full_name || "",
      creator_email: user?.email || "",
      creator_social: "",
    },
  });

  // Prefill user info when auth state changes
  useEffect(() => {
    if (user) {
      setValue("creator_name", user.user_metadata?.full_name || user.email?.split("@")[0] || "");
      setValue("creator_email", user.email || "");
    }
  }, [user, setValue]);

  const watchedCategory = watch("category");
  const watchedTool = watch("tool_used");

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${bytesToSize(MAX_FILE_SIZE)}`,
        variant: "destructive",
      });
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image, video, or audio file",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setFilePreview(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }, [toast]);

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="w-12 h-12" />;
    if (file.type.startsWith("image/")) return <ImageIcon className="w-12 h-12" />;
    if (file.type.startsWith("video/")) return <Video className="w-12 h-12" />;
    if (file.type.startsWith("audio/")) return <Music className="w-12 h-12" />;
    return <Globe className="w-12 h-12" />;
  };

  const canProceed = async () => {
    switch (step) {
      case 1:
        return !!file && await trigger(["title", "category"]);
      case 2:
        return await trigger(["prompt", "tool_used"]);
      case 3:
        return await trigger(["description"]);
      case 4:
        return await trigger(["creator_name", "creator_email"]);
      default:
        return true;
    }
  };

  const nextStep = async () => {
    if (await canProceed()) {
      setStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: SubmitEntryFormData) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a file to continue",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const response = await fetch("/api/entries", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit entry");
      }

      setIsSuccess(true);
      toast({
        title: "Entry submitted!",
        description: "Your creation has been added to the gallery",
        variant: "success",
      });

      // Redirect after success animation
      setTimeout(() => {
        router.push(`/entry/${result.data.id}`);
      }, 2000);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6"
        >
          <Check className="w-12 h-12 text-white" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Entry Submitted!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-violet-300/50"
        >
          Redirecting to your entry...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-600 to-purple-500"
              initial={{ width: "0%" }}
              animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {STEPS.map((s, index) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isCompleted = step > s.id;

            return (
              <div key={s.id} className="relative flex flex-col items-center z-10">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                      : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-white/10 text-violet-300/50"
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </motion.div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium hidden sm:block",
                    isActive ? "text-white" : "text-violet-300/50"
                  )}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Steps */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-6 md:p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Upload Your Creation</h2>
                  <p className="text-violet-300/50">Share your AI-generated masterpiece</p>
                </div>

                {/* File Upload Area */}
                <div className="relative">
                  <input
                    type="file"
                    accept={ACCEPTED_FILE_TYPES.join(",")}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-8 text-center transition-colors",
                      file
                        ? "border-violet-500/50 bg-violet-700/20"
                        : "border-violet-700/50 hover:border-violet-600/50 hover:bg-violet-800/30"
                    )}
                  >
                    {filePreview && file?.type.startsWith("image/") ? (
                      <div className="relative">
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                          }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 z-20"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : file ? (
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-2xl bg-violet-700/50 flex items-center justify-center text-violet-300/70 mb-4">
                          {getFileIcon()}
                        </div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-violet-300/50 text-sm">{bytesToSize(file.size)}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                          }}
                          className="mt-4 text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-violet-300/50 mb-4">
                          <Upload className="w-10 h-10" />
                        </div>
                        <p className="text-white font-medium mb-1">
                          Drop your file here or click to browse
                        </p>
                        <p className="text-violet-300/50 text-sm">
                          Images, videos, or audio up to 50MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Give your creation a name"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm">{errors.title.message}</p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={watchedCategory} onValueChange={(value: string) => setValue("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultCategories.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.slug}>
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-red-400 text-sm">{errors.category.message}</p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Share Your Prompt</h2>
                  <p className="text-violet-300/50">What instructions did you give the AI?</p>
                </div>

                {/* AI Tool */}
                <div className="space-y-2">
                  <Label>AI Tool Used *</Label>
                  <Select value={watchedTool} onValueChange={(value: string) => setValue("tool_used", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an AI tool" />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_TOOLS.map((tool) => (
                        <SelectItem key={tool.value} value={tool.value}>
                          <span className="flex items-center gap-2">
                            <span>{tool.icon}</span>
                            <span>{tool.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tool_used && (
                    <p className="text-red-400 text-sm">{errors.tool_used.message}</p>
                  )}
                </div>

                {/* Prompt */}
                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt Used *</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Paste or type the prompt you used..."
                    className="min-h-[150px]"
                    {...register("prompt")}
                  />
                  {errors.prompt && (
                    <p className="text-red-400 text-sm">{errors.prompt.message}</p>
                  )}
                </div>

                {/* Share Link */}
                <div className="space-y-2">
                  <Label htmlFor="share_link">
                    <span className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Public Share Link (Optional)
                    </span>
                  </Label>
                  <Input
                    id="share_link"
                    type="url"
                    placeholder="https://chat.openai.com/share/..."
                    {...register("share_link")}
                  />
                  <p className="text-violet-300/50 text-xs">
                    Link to your ChatGPT, Gemini, or other AI conversation
                  </p>
                  {errors.share_link && (
                    <p className="text-red-400 text-sm">{errors.share_link.message}</p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Describe Your Work</h2>
                  <p className="text-violet-300/50">Tell us about your creation</p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="What's the story behind this creation? What makes it special?"
                    className="min-h-[200px]"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm">{errors.description.message}</p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Your Information</h2>
                  <p className="text-violet-300/50">How should we credit you?</p>
                </div>

                {/* Creator Name */}
                <div className="space-y-2">
                  <Label htmlFor="creator_name">Your Name *</Label>
                  <Input
                    id="creator_name"
                    placeholder="John Doe"
                    {...register("creator_name")}
                  />
                  {errors.creator_name && (
                    <p className="text-red-400 text-sm">{errors.creator_name.message}</p>
                  )}
                </div>

                {/* Creator Email */}
                <div className="space-y-2">
                  <Label htmlFor="creator_email">Email *</Label>
                  <Input
                    id="creator_email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("creator_email")}
                  />
                  <p className="text-violet-300/50 text-xs">
                    Your email won't be displayed publicly
                  </p>
                  {errors.creator_email && (
                    <p className="text-red-400 text-sm">{errors.creator_email.message}</p>
                  )}
                </div>

                {/* Creator Social */}
                <div className="space-y-2">
                  <Label htmlFor="creator_social">Social Profile (Optional)</Label>
                  <Input
                    id="creator_social"
                    type="url"
                    placeholder="https://twitter.com/username"
                    {...register("creator_social")}
                  />
                  {errors.creator_social && (
                    <p className="text-red-400 text-sm">{errors.creator_social.message}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            {step < STEPS.length ? (
              <Button type="button" onClick={nextStep} className="gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="gap-2 min-w-[140px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Submit Entry
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
