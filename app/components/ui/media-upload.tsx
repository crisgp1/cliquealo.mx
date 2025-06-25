import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { toast } from "~/components/ui/toast";
import { LottiePlayer } from "~/components/ui/lottie-player";
import { X, Upload, Check, AlertCircle, GripVertical, Play, Image as ImageIcon, Video, FileText } from "lucide-react";
// Removed problematic drag and drop imports - using native HTML5 drag and drop instead

export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: string;
  url: string;
  type: MediaType;
  file?: File;
  preview?: string;
  name?: string;
  size?: number;
  uploadedAt?: Date;
}

type MediaUploadProps = {
  label?: string;
  maxFiles?: number;
  onMediaChange: (items: MediaItem[]) => void;
  initialMedia?: MediaItem[];
  className?: string;
  accept?: Record<string, string[]>;
  maxSize?: number;
  showProgress?: boolean;
  uploadMode?: 'overlay' | 'inline' | 'minimal';
  allowVideos?: boolean;
  maxVideoSize?: number;
  uploadEndpoint?: string;
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

export function MediaUpload({
  label = "Upload Media",
  maxFiles = 30,
  onMediaChange,
  initialMedia = [],
  className = "",
  accept = {
    "image/jpeg": [".jpeg", ".jpg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
    "image/gif": [".gif"],
    "video/mp4": [".mp4"],
    "video/webm": [".webm"],
    "video/quicktime": [".mov"],
    "video/x-msvideo": [".avi"]
  },
  maxSize = 5 * 1024 * 1024, // 5MB para imágenes
  maxVideoSize = 50 * 1024 * 1024, // 50MB para videos
  showProgress = true,
  uploadMode = 'overlay',
  allowVideos = true,
  uploadEndpoint = "/api/upload-image"
}: MediaUploadProps) {
  
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>(initialMedia);
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: {},
    completed: [],
    failed: []
  });

  // Estados para drag & drop de reordenamiento
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Generar ID único para archivos
  const generateFileId = useCallback(() => 
    `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, []);

  // Detectar tipo de archivo
  const getMediaType = useCallback((file: File): MediaType => {
    if (file.type.startsWith('video/')) return 'video';
    return 'image';
  }, []);

  // Detectar si es PDF
  const isPDF = useCallback((file: File): boolean => {
    return file.type === 'application/pdf';
  }, []);

  // Validar archivo individual
  const validateFile = useCallback((file: File): string | null => {
    const mediaType = getMediaType(file);
    const currentMaxSize = mediaType === 'video' ? maxVideoSize : maxSize;
    
    if (file.size > currentMaxSize) {
      const maxSizeMB = (currentMaxSize / 1024 / 1024).toFixed(1);
      return `El archivo ${file.name} excede el tamaño máximo de ${maxSizeMB}MB para ${mediaType === 'video' ? 'videos' : 'imágenes'}`;
    }
    
    if (mediaType === 'video' && !allowVideos) {
      return `Los videos no están permitidos`;
    }
    
    const fileType = file.type;
    const acceptedMimeTypes = Object.keys(accept);
    const acceptedExtensions = Object.values(accept).flat();
    
    const isValidType = acceptedMimeTypes.includes(fileType) ||
      acceptedExtensions.some(ext => file.name.toLowerCase().endsWith(ext.toLowerCase()));
    
    if (!isValidType) {
      return `El archivo ${file.name} no es un tipo válido`;
    }
    
    return null;
  }, [maxSize, maxVideoSize, accept, allowVideos, getMediaType]);

  // Handle dropped files
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Manejar archivos rechazados
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error: any) => {
          if (error.code === 'file-too-large') {
            const mediaType = getMediaType(file);
            const maxSizeMB = (mediaType === 'video' ? maxVideoSize : maxSize) / 1024 / 1024;
            toast.error(`${file.name} es demasiado grande. Máximo ${maxSizeMB.toFixed(1)}MB para ${mediaType === 'video' ? 'videos' : 'imágenes'}`);
          } else if (error.code === 'file-invalid-type') {
            const mediaType = getMediaType(file);
            if (mediaType === 'video' && !allowVideos) {
              toast.error(`${file.name}: Los videos no están permitidos en este formulario`);
            } else {
              toast.error(`${file.name} no es un tipo de archivo válido. Formatos permitidos: ${Object.values(accept).flat().join(', ')}`);
            }
          } else if (error.code === 'custom-validation-error') {
            toast.error(error.message);
          } else {
            toast.error(`Error con ${file.name}: ${error.message}`);
          }
        });
      });

      // Validar límite de archivos
      const totalFiles = acceptedFiles.length + files.length + uploadedMedia.length;
      if (totalFiles > maxFiles) {
        toast.error(`Solo puedes subir un máximo de ${maxFiles} archivos`);
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
    [files, maxFiles, uploadedMedia.length, maxSize, maxVideoSize, validateFile, generateFileId, getMediaType]
  );

  // Configurar dropzone
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - uploadedMedia.length,
    // No usar maxSize aquí para evitar conflictos, validaremos manualmente
    multiple: true,
    disabled: uploadState.uploading,
    validator: (file) => {
      const validationError = validateFile(file);
      if (validationError) {
        return {
          code: 'custom-validation-error',
          message: validationError
        };
      }
      return null;
    }
  });

  // Subir archivo individual
  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(uploadEndpoint, {
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
  }, [uploadEndpoint]);

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

        const mediaItem: MediaItem = {
          id: fileId,
          url,
          type: getMediaType(file),
          name: file.name,
          size: file.size
        };

        return { success: true, mediaItem, fileId };
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
      const successfulUploads = results.filter(r => r.success).map(r => r.mediaItem).filter(Boolean) as MediaItem[];
      const failedCount = results.filter(r => !r.success).length;

      if (successfulUploads.length > 0) {
        const newMedia = [...uploadedMedia, ...successfulUploads];
        console.log('MediaUpload: Setting new media after upload:', newMedia);
        setUploadedMedia(newMedia);
        onMediaChange(newMedia);
        toast.success(`${successfulUploads.length} archivo(s) subido(s) exitosamente`);
      }

      if (failedCount > 0) {
        toast.error(`${failedCount} archivo(s) fallaron al subir`);
      }

      // Limpiar archivos exitosos
      setFiles(prevFiles => 
        prevFiles.filter(file => !results.some(r => r.success && r.fileId === file.id))
      );

    } catch (error) {
      toast.error("Error general en la subida de archivos");
    } finally {
      setUploadState(prev => ({
        ...prev,
        uploading: false
      }));
    }
  }, [files, uploadFile, uploadedMedia, onMediaChange, getMediaType]);

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

  // Remover media subido
  const removeUploadedMedia = useCallback((index: number) => {
    setUploadedMedia(prev => {
      const newMedia = [...prev];
      newMedia.splice(index, 1);
      onMediaChange(newMedia);
      return newMedia;
    });
  }, [onMediaChange]);

  // Reordenar media usando array nativo
  const reorderMedia = useCallback((startIndex: number, endIndex: number) => {
    setUploadedMedia(prev => {
      const newMedia = [...prev];
      const [removed] = newMedia.splice(startIndex, 1);
      newMedia.splice(endIndex, 0, removed);
      onMediaChange(newMedia);
      return newMedia;
    });
  }, [onMediaChange]);

  // Actualizar uploadedMedia cuando cambian los initialMedia (solo en mount inicial)
  useEffect(() => {
    console.log('MediaUpload: Initial mount, setting uploadedMedia:', initialMedia);
    setUploadedMedia(initialMedia);
  }, []); // Solo ejecutar en mount inicial

  // Sincronizar con initialMedia solo si hay cambios externos (no durante upload)
  useEffect(() => {
    if (!uploadState.uploading && initialMedia.length !== uploadedMedia.length) {
      console.log('MediaUpload: External change detected, updating uploadedMedia:', initialMedia);
      setUploadedMedia(initialMedia);
    }
  }, [initialMedia.length, uploadState.uploading]);

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
        .media-reorder-item {
          transition: all 0.2s ease;
          cursor: grab;
        }
        .media-reorder-item:active {
          cursor: grabbing;
        }
        .media-reorder-item.dragging {
          opacity: 0.5;
          transform: scale(0.95);
        }
        .media-reorder-item.drag-over {
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
                  Subiendo Archivos
                </h3>
                <p className="text-gray-600 mb-4">
                  {uploadedCount} de {totalFiles} completados
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
                            {getMediaType(file) === 'video' ? (
                              <Video className="w-4 h-4 text-blue-600 mr-1" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-green-600 mr-1" />
                            )}
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

        {/* Dropzone mejorado */}
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
                  Subiendo archivos...
                </p>
                <p className="text-xs text-gray-500">
                  {uploadedCount} de {totalFiles} completados
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
                      : "🎯 Suelta los archivos aquí"
                    : "Arrastra y suelta imágenes y videos aquí, o haz clic para seleccionar"
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Soporta JPG, PNG, WebP, GIF{Object.keys(accept).includes('application/pdf') ? ', PDF' : ''} hasta {(maxSize / 1024 / 1024).toFixed(1)}MB
                  {allowVideos && ` y videos MP4, WebM, MOV, AVI hasta ${(maxVideoSize / 1024 / 1024).toFixed(1)}MB`}
                </p>
                <p className="text-xs text-gray-500">
                  {uploadedMedia.length + files.length}/{maxFiles} archivos
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Media subida con reordenamiento */}
        {uploadedMedia.length > 0 && (
          <MediaGrid
            media={uploadedMedia}
            onRemove={removeUploadedMedia}
            onReorder={reorderMedia}
          />
        )}

        {/* Archivos pendientes */}
        {files.length > 0 && (
          <PendingFiles
            files={files}
            uploadState={uploadState}
            onRemove={removeFile}
            onUpload={handleUpload}
            getMediaType={getMediaType}
          />
        )}
      </div>
    </>
  );
}

// Componente para la grilla de media con drag and drop
interface MediaGridProps {
  media: MediaItem[];
  onRemove: (index: number) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

function MediaGrid({ media, onRemove, onReorder }: MediaGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-900 flex items-center">
        <Check className="w-4 h-4 text-green-600 mr-2" />
        Archivos Subidos ({media.length}) - Arrastra para reordenar
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {media.map((item, index) => (
          <MediaGridItem
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            onRemove={() => onRemove(index)}
            onReorder={onReorder}
            isDragged={draggedIndex === index}
            setDraggedIndex={setDraggedIndex}
          />
        ))}
      </div>
    </div>
  );
}

// Componente individual de media con drag and drop
interface MediaGridItemProps {
  item: MediaItem;
  index: number;
  onRemove: () => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  isDragged: boolean;
  setDraggedIndex: (index: number | null) => void;
}

function MediaGridItem({ item, index, onRemove, onReorder, isDragged, setDraggedIndex }: MediaGridItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const targetIndex = index;
    
    if (sourceIndex !== targetIndex) {
      onReorder(sourceIndex, targetIndex);
    }
  };

  return (
    <div
      ref={ref}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        media-reorder-item relative rounded-lg overflow-hidden border border-gray-200 group aspect-square
        ${isDragged ? 'dragging' : ''}
      `}
    >
      {item.type === 'video' ? (
        <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
          <video
            src={item.url}
            className="w-full h-full object-cover"
            muted
            preload="metadata"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <Play className="w-8 h-8 text-white" />
          </div>
        </div>
      ) : item.url.toLowerCase().includes('.pdf') || item.name?.toLowerCase().endsWith('.pdf') ? (
        <div className="relative w-full h-full bg-red-50 flex items-center justify-center border-2 border-red-200">
          <div className="text-center">
            <FileText className="w-12 h-12 text-red-600 mx-auto mb-2" />
            <span className="text-xs text-red-700 font-medium">PDF</span>
          </div>
        </div>
      ) : (
        <img
          src={item.url}
          alt={`Media ${index + 1}`}
          className="w-full h-full object-cover"
        />
      )}
      
      {/* Indicador de drag */}
      <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-75 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-3 h-3" />
      </div>
      
      {/* Tipo de media */}
      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {item.type === 'video' ? (
          <Video className="w-3 h-3" />
        ) : item.url.toLowerCase().includes('.pdf') || item.name?.toLowerCase().endsWith('.pdf') ? (
          <FileText className="w-3 h-3" />
        ) : (
          <ImageIcon className="w-3 h-3" />
        )}
      </div>
      
      {/* Número de orden */}
      <div className="absolute bottom-2 left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
        {index + 1}
      </div>
      
      <button
        type="button"
        onClick={onRemove}
        className="absolute bottom-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
        aria-label="Eliminar archivo"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// Componente para archivos pendientes
interface PendingFilesProps {
  files: FileWithPreview[];
  uploadState: UploadState;
  onRemove: (fileId: string) => void;
  onUpload: () => void;
  getMediaType: (file: File) => MediaType;
}

function PendingFiles({ files, uploadState, onRemove, onUpload, getMediaType }: PendingFilesProps) {
  return (
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
          const mediaType = getMediaType(file);
          
          return (
            <div
              key={fileId}
              className="relative rounded-lg overflow-hidden border border-gray-200 group aspect-square"
            >
              {mediaType === 'video' ? (
                <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
                  <video
                    src={file.preview}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
              ) : file.type === 'application/pdf' ? (
                <div className="relative w-full h-full bg-red-50 flex items-center justify-center border-2 border-red-200">
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-red-600 mx-auto mb-1" />
                    <span className="text-xs text-red-700 font-medium">PDF</span>
                    <div className="text-xs text-red-600 mt-1 px-1 truncate">
                      {file.name}
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={file.preview}
                  alt={`Preview ${file.name}`}
                  className="w-full h-full object-cover"
                />
              )}
              
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
                  onClick={() => onRemove(fileId)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  aria-label="Eliminar archivo"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Indicador de tipo */}
              <div className="absolute top-2 left-2 bg-blue-500 text-white rounded p-1">
                {mediaType === 'video' ? (
                  <Video className="w-3 h-3" />
                ) : file.type === 'application/pdf' ? (
                  <FileText className="w-3 h-3" />
                ) : (
                  <ImageIcon className="w-3 h-3" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!uploadState.uploading && (
        <Button
          type="button"
          onClick={onUpload}
          disabled={files.length === 0}
          className="w-full sm:w-auto"
        >
          <Upload className="w-4 h-4 mr-2" />
          Subir {files.length} archivo{files.length !== 1 ? 's' : ''}
        </Button>
      )}
    </div>
  );
}