"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  FileText, 
  Link as LinkIcon,
  X,
  Plus,
  Check
} from "lucide-react"
import { createMaterial } from "@/app/actions/material"

interface MaterialUploadProps {
  notebookId: string
  onUpload?: (material: any) => void
}

export function MaterialUpload({ notebookId, onUpload }: MaterialUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [links, setLinks] = useState<{ url: string; title: string }[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const addLink = () => {
    setLinks(prev => [...prev, { url: "", title: "" }])
  }

  const updateLink = (index: number, field: 'url' | 'title', value: string) => {
    setLinks(prev => prev.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    ))
  }

  const removeLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />
    if (file.type === 'application/pdf') return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const getFileType = (file: File) => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('video/')) return 'video'
    if (file.type === 'application/pdf') return 'pdf'
    if (file.type.includes('word') || file.type.includes('document')) return 'document'
    if (file.type.includes('presentation') || file.type.includes('powerpoint')) return 'presentation'
    return 'file'
  }

  const handleUpload = async () => {
    setIsUploading(true)
    
    try {
      // Upload files
      for (const file of files) {
        const formData = new FormData()
        formData.append('name', file.name)
        formData.append('type', getFileType(file))
        formData.append('fileName', file.name)
        formData.append('fileSize', file.size.toString())
        formData.append('mimeType', file.type)
        formData.append('tags', JSON.stringify([]))
        
        const result = await createMaterial(notebookId, formData)
        if (result.success) {
          onUpload?.(result.material)
        }
      }

      // Add links
      for (const link of links) {
        if (link.url && link.title) {
          const formData = new FormData()
          formData.append('name', link.title)
          formData.append('type', 'link')
          formData.append('externalUrl', link.url)
          formData.append('tags', JSON.stringify([]))
          
          const result = await createMaterial(notebookId, formData)
          if (result.success) {
            onUpload?.(result.material)
          }
        }
      }

      // Clear form
      setFiles([])
      setLinks([])
    } catch (error) {
      console.error('Error uploading materials:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>
            Drag and drop files or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop files here' : 'Upload files'}
            </p>
            <p className="text-sm text-muted-foreground">
              Images, videos, PDFs, documents, and more
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Maximum file size: 50MB
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Selected Files:</h4>
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getFileIcon(file)}
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle>Add Links</CardTitle>
          <CardDescription>
            Add external resources and links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {links.map((link, index) => (
              <div key={index} className="flex gap-3 p-3 border rounded-lg">
                <LinkIcon className="h-4 w-4 mt-2 text-muted-foreground" />
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Link title"
                    value={link.title}
                    onChange={(e) => updateLink(index, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="https://example.com"
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLink(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={addLink}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Button */}
      {(files.length > 0 || links.some(link => link.url && link.title)) && (
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Upload Materials
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
