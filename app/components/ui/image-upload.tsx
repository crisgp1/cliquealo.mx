// app/components/ui/image-upload.tsx
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { toast } from "~/components/ui/toast";
import { LottiePlayer } from "~/components/ui/lottie-player";
import { X, Upload, Check, AlertCircle, GripVertical } from "lucide-react";

type ImageUploadProps = {
  label?: string;
  maxFiles?: number;
  onImagesChange: (urls: string[]) => void;
  initialImages?: string[];
  className?: string;
  accept?: Record<string, string[]>;
  maxSize?: number;
  showProgress?: boolean;
  uploadMode?: 'overlay' | 'inline' | 'minimal';
};

interface FileWithPreview extends File {
  preview?: string;
  id?: string;
}

interface UploadState {
  uploading: boolean;
  progress: Record<string, number>;
  completed: string[];
  failed: string[];
}

export function ImageUpload({
  label = "Upload Images",
  maxFiles = 30, // ✅ Aumentado a 30 imágenes máximo
  onImagesChange,
  initialImages = [],
  className = "",
  accept = {
    "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"]
  },
  maxSize = 5 * 1024 * 1024,
  showProgress = true,
  uploadMode = 'overlay'
}: ImageUploadProps) {
  
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(initialImages);
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: {},
    completed: [],
    failed: []
  });

  // ✅ Estados para drag & drop de reordenamiento
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDraggingToReorder, setIsDraggingToReorder] = useState(false);

  // Generar ID único para archivos
  const generateFileId = useCallback(() => 
    `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, []);

  // Validar archivo individual
  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxSize) {
      return `El archivo ${file.name} excede el tamaño máximo de ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
    }
    
    const fileType = file.type;
    const acceptedTypes = Object.values(accept).flat();
    const isValidType = acceptedTypes.some(type => 
      type.startsWith('.') ? file.name.toLowerCase().endsWith(type) : fileType.includes(type.replace('/*', ''))
    );
    
    if (!isValidType) {
      return `El archivo ${file.name} no es un tipo de imagen válido`;
    }
    
    return null;
  }, [maxSize, accept]);

  // Handle dropped files
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Manejar archivos rechazados
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error: any) => {
          if (error.code === 'file-too-large') {
            toast.error(`${file.name} es demasiado grande. Máximo ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
          } else if (error.code === 'file-invalid-type') {
            toast.error(`${file.name} no es un tipo de archivo válido`);
          } else {
            toast.error(`Error con ${file.name}: ${error.message}`);
          }
        });
      });

      // Validar límite de archivos
      const totalFiles = acceptedFiles.length + files.length + uploadedUrls.length;
      if (totalFiles > maxFiles) {
        toast.error(`Solo puedes subir un máximo de ${maxFiles} imágenes`);
        return;
      }

      // Procesar archivos aceptados
      const validFiles: FileWithPreview[] = [];
      
      acceptedFiles.forEach(file => {
        const validationError = validateFile(file);
        if (validationError) {
          toast.error(validationError);
          return;
        }

        const fileWithPreview: FileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: generateFileId()
        });
        
        validFiles.push(fileWithPreview);
      });

      setFiles(prevFiles => [...prevFiles, ...validFiles]);
    },
    [files, maxFiles, uploadedUrls.length, maxSize, validateFile, generateFileId]
  );

  // Configurar dropzone
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - uploadedUrls.length,
    maxSize,
    multiple: true,
    disabled: uploadState.uploading
  });

  // Subir archivo individual
  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error uploading file");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }, []);

  // Subir todos los archivos
  const handleUpload = useCallback(async () => {
    if (files.length === 0) return;

    setUploadState(prev => ({
      ...prev,
      uploading: true,
      progress: {},
      completed: [],
      failed: []
    }));

    const uploadPromises = files.map(async (file) => {
      const fileId = file.id!;
      
      try {
        setUploadState(prev => ({
          ...prev,
          progress: { ...prev.progress, [fileId]: 0 }
        }));

        // Simular progreso
        const progressInterval = setInterval(() => {
          setUploadState(prev => {
            const currentProgress = prev.progress[fileId] || 0;
            if (currentProgress < 90) {
              return {
                ...prev,
                progress: { ...prev.progress, [fileId]: Math.min(currentProgress + Math.random() * 20, 90) }
              };
            }
            return prev;
          });
        }, 300);

        const url = await uploadFile(file);

        clearInterval(progressInterval);
        
        setUploadState(prev => ({
          ...prev,
          progress: { ...prev.progress, [fileId]: 100 },
          completed: [...prev.completed, fileId]
        }));

        return { success: true, url, fileId };
      } catch (error) {
        setUploadState(prev => ({
          ...prev,
          failed: [...prev.failed, fileId]
        }));
        
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        toast.error(`Error subiendo ${file.name}: ${errorMessage}`);
        return { success: false, error: errorMessage, fileId };
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(r => r.success).map(r => r.url).filter(Boolean) as string[];
      const failedCount = results.filter(r => !r.success).length;

      if (successfulUploads.length > 0) {
        const newUrls = [...uploadedUrls, ...successfulUploads];
        setUploadedUrls(newUrls);
        onImagesChange(newUrls);
        toast.success(`${successfulUploads.length} imagen(es) subida(s) exitosamente`);
      }

      if (failedCount > 0) {
        toast.error(`${failedCount} imagen(es) fallaron al subir`);
      }

      // Limpiar archivos exitosos
      setFiles(prevFiles => 
        prevFiles.filter(file => !results.some(r => r.success && r.fileId === file.id))
      );

    } catch (error) {
      toast.error("Error general en la subida de imágenes");
    } finally {
      setUploadState(prev => ({
        ...prev,
        uploading: false
      }));
    }
  }, [files, uploadFile, uploadedUrls, onImagesChange]);

  // Remover archivo
  const removeFile = useCallback((fileId: string) => {
    setFiles(prevFiles => {
      const newFiles = prevFiles.filter(file => file.id !== fileId);
      const fileToRemove = prevFiles.find(file => file.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return newFiles;
    });
  }, []);

  // Remover imagen subida
  const removeUploadedImage = useCallback((index: number) => {
    setUploadedUrls(prev => {
      const newUrls = [...prev];
      newUrls.splice(index, 1);
      onImagesChange(newUrls);
      return newUrls;
    });
  }, [onImagesChange]);

  // ✅ Funciones para reordenar imágenes
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    setIsDraggingToReorder(true);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDraggingToReorder(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      handleDragEnd();
      return;
    }

    const newUrls = [...uploadedUrls];
    const draggedItem = newUrls[draggedIndex];
    
    // Remover el item de su posición original
    newUrls.splice(draggedIndex, 1);
    
    // Insertar en la nueva posición
    newUrls.splice(dropIndex, 0, draggedItem);
    
    setUploadedUrls(newUrls);
    onImagesChange(newUrls);
    handleDragEnd();
    
    toast.success('Imagen reordenada exitosamente');
  }, [draggedIndex, uploadedUrls, onImagesChange, handleDragEnd]);

  // Cleanup URLs
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  // Calcular estadísticas
  const totalFiles = files.length;
  const uploadedCount = uploadState.completed.length;
  const overallProgress = totalFiles > 0 ? Math.round((uploadedCount / totalFiles) * 100) : 0;

  return (
    <>
      <style>{`
        .upload-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .upload-modal {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          max-width: 28rem;
          width: 100%;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .progress-bar {
          width: 100%;
          height: 0.5rem;
          background: #e5e7eb;
          border-radius: 0.25rem;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: #3b82f6;
          transition: width 0.5s ease-out;
        }
        .drag-drop-zone {
          transition: all 0.3s ease;
        }
        .drag-drop-zone.drag-active {
          transform: scale(1.02);
          border-color: #3b82f6;
          background-color: #eff6ff;
        }
        .drag-drop-zone.drag-reject {
          border-color: #ef4444;
          background-color: #fef2f2;
        }
        .image-reorder-item {
          transition: all 0.2s ease;
        }
        .image-reorder-item.dragging {
          opacity: 0.5;
          transform: scale(0.95);
        }
        .image-reorder-item.drag-over {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      <div className={`space-y-4 ${className}`}>
        {label && <Label className="text-sm font-medium text-gray-700">{label}</Label>}

        {/* Overlay de carga */}
        {uploadState.uploading && uploadMode === 'overlay' && (
          <div className="upload-overlay">
            <div className="upload-modal">
              <div className="text-center mb-6">
                <LottiePlayer
                  src="https://lottie.host/569f6dc5-7de3-4d52-b20e-571af740381d/eGHX3yXPIK.lottie"
                  width={160}
                  height={160}
                  loop
                  autoplay
                  className="mx-auto"
                />
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Subiendo Imágenes
                </h3>
                <p className="text-gray-600 mb-4">
                  {uploadedCount} de {totalFiles} completadas
                </p>
                
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
              
              {showProgress && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {files.map((file) => {
                    const fileId = file.id!;
                    const progress = Math.round(uploadState.progress[fileId] || 0);
                    const isCompleted = uploadState.completed.includes(fileId);
                    const hasFailed = uploadState.failed.includes(fileId);
                    
                    return (
                      <div key={fileId} className="text-left">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600 truncate flex-1 mr-2 flex items-center">
                            {isCompleted && <Check className="w-4 h-4 text-green-600 mr-1" />}
                            {hasFailed && <AlertCircle className="w-4 h-4 text-red-600 mr-1" />}
                            {file.name}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {isCompleted ? '100%' : hasFailed ? 'Error' : `${progress}%`}
                          </span>
                        </div>
                        <div className="progress-bar h-1.5">
                          <div
                            className={`h-full transition-all duration-300 ease-out ${
                              isCompleted ? 'bg-green-500' : hasFailed ? 'bg-red-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${isCompleted ? 100 : hasFailed ? 100 : progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ✅ Dropzone mejorado con animación */}
        <div
          {...getRootProps()}
          className={`
            drag-drop-zone relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300
            ${isDragActive && !isDragReject ? 'drag-active' : ''}
            ${isDragReject ? 'drag-reject' : ''}
            ${!isDragActive ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50' : ''}
            ${uploadState.uploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {uploadState.uploading && uploadMode === 'inline' ? (
            <div className="space-y-4 py-4">
              <LottiePlayer
                src="https://lottie.host/569f6dc5-7de3-4d52-b20e-571af740381d/eGHX3yXPIK.lottie"
                width={80}
                height={80}
                loop
                autoplay
                className="mx-auto"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Subiendo imágenes...
                </p>
                <p className="text-xs text-gray-500">
                  {uploadedCount} de {totalFiles} completadas
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-600" />
              </div>
              
              <div>
                <p className="text-sm text-gray-600">
                  {isDragActive
                    ? isDragReject
                      ? "Algunos archivos no son válidos"
                      : "🎯 Suelta las imágenes aquí"
                    : "Arrastra y suelta imágenes aquí, o haz clic para seleccionar"
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Soporta JPG, PNG, WebP y GIF hasta {(maxSize / 1024 / 1024).toFixed(1)}MB
                </p>
                <p className="text-xs text-gray-500">
                  {uploadedUrls.length + files.length}/{maxFiles} imágenes
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Imágenes subidas con reordenamiento */}
        {uploadedUrls.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <Check className="w-4 h-4 text-green-600 mr-2" />
              Imágenes Subidas ({uploadedUrls.length}) - Arrastra para reordenar
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {uploadedUrls.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`
                    image-reorder-item relative rounded-lg overflow-hidden border border-gray-200 group aspect-square cursor-move
                    ${draggedIndex === index ? 'dragging' : ''}
                    ${dragOverIndex === index && draggedIndex !== index ? 'drag-over' : ''}
                  `}
                >
                  <img
                    src={url}
                    alt={`Imagen subida ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Indicador de drag */}
                  <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-75 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-3 h-3" />
                  </div>
                  
                  {/* Número de orden */}
                  <div className="absolute bottom-2 left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeUploadedImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    aria-label="Eliminar imagen"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Archivos pendientes */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <Upload className="w-4 h-4 text-blue-600 mr-2" />
              Pendientes de Subir ({files.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {files.map((file) => {
                const fileId = file.id!;
                const progress = Math.round(uploadState.progress[fileId] || 0);
                const isCompleted = uploadState.completed.includes(fileId);
                const hasFailed = uploadState.failed.includes(fileId);
                
                return (
                  <div
                    key={fileId}
                    className="relative rounded-lg overflow-hidden border border-gray-200 group aspect-square"
                  >
                    <img
                      src={file.preview}
                      alt={`Preview ${file.name}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {uploadState.uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white">
                          {isCompleted ? (
                            <Check className="w-6 h-6 mx-auto" />
                          ) : hasFailed ? (
                            <AlertCircle className="w-6 h-6 mx-auto text-red-400" />
                          ) : (
                            <>
                              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                              <div className="text-xs">{progress}%</div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {!uploadState.uploading && (
                      <button
                        type="button"
                        onClick={() => removeFile(fileId)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        aria-label="Eliminar archivo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {!uploadState.uploading && (
              <Button
                type="button"
                onClick={handleUpload}
                disabled={files.length === 0}
                className="w-full sm:w-auto"
              >
                <Upload className="w-4 h-4 mr-2" />
                Subir {files.length} Imagen{files.length !== 1 ? 'es' : ''}
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}