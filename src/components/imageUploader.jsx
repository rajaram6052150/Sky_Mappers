"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const featureOptions = ["building", "road", "waterbody", "rooftop_tiled", "rooftop_rcc"]

export default function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [featureType, setFeatureType] = useState(featureOptions[0])
  const [processedImage, setProcessedImage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setProcessedImage(null)
      setError(null)
    }
  }

  const handleFeatureChange = (value) => {
    setFeatureType(value)
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedImage) {
      setError("Please select an image.")
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("image", selectedImage)
    formData.append("feature_type", featureType)

    try {
      const response = await fetch("http://localhost:8000/images/segment/", {
        method: "POST",
        body: formData,
      })

      const contentType = response.headers.get("Content-Type")

      if (!response.ok) {
        if (contentType?.includes("application/json")) {
          const errorData = await response.json()
          setError(errorData.error || "Failed to process image.")
        } else {
          const text = await response.text()
          setError("Unexpected server error: " + text.slice(0, 100))
        }
        return
      }

      const data = await response.json()
      if (data.processed_image) {
        setProcessedImage(`data:image/png;base64,${data.processed_image}`)
      } else {
        setError("No processed image in response.")
      }
    } catch (err) {
      console.error("Fetch error:", err.message)
      setError(`An error occurred: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a192f]/40 backdrop-blur-sm p-4 w-full">
      {processedImage ? (
        // Side-by-side layout after image is processed
        <div className="flex justify-center items-start gap-6 max-w-5xl mx-auto h-[32rem]">
          {/* Form Card */}
          <Card className="w-full max-w-md h-full flex flex-col justify-between border-0 shadow-2xl bg-[#112240]/90 backdrop-blur-md text-white">
            <CardHeader className="border-b border-[#172a46] pb-4">
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-[#e8ed51] to-[#d8dd41] text-transparent bg-clip-text">
                Image Segmentation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col justify-between">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="feature-type" className="text-sm font-medium text-gray-300">
                    Select Feature Type
                  </Label>
                  <Select value={featureType} onValueChange={handleFeatureChange}>
                    <SelectTrigger className="w-full bg-[#112240]/50 border-[#2a3f63] text-gray-200 focus:border-[#e8ed51] focus:ring-[#e8ed51]/20">
                      <SelectValue placeholder="Select feature type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#112240] border-[#2a3f63] text-gray-200">
                      {featureOptions.map((option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className="hover:bg-[#e8ed51]/10 hover:text-[#e8ed51] focus:bg-[#e8ed51]/10 focus:text-[#e8ed51]"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image-upload" className="text-sm font-medium text-gray-300">
                    Upload Image
                  </Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-[#2a3f63] bg-[#112240]/50 hover:bg-[#e8ed51]/5 hover:border-[#e8ed51]/30 transition-all duration-300"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-[#e8ed51]/70" />
                        <p className="mb-2 text-sm text-gray-300">
                          <span className="font-semibold text-[#e8ed51]">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                          {selectedImage ? selectedImage.name : "No file selected"}
                        </p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full font-medium relative",
                    "bg-[#112240] hover:bg-[#172a46] text-[#e8ed51] border border-[#e8ed51]/20 hover:border-[#e8ed51]/50 transition-colors"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Process Image"
                  )}
                </Button>

                {error && (
                  <div className="p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-300">
                    {error}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Processed Image Box */}
          <div className="w-full max-w-md h-full bg-[#112240]/90 rounded-xl border border-[#172a46] p-4 text-gray-100 shadow-lg flex flex-col justify-between">
            <h2 className="text-xl font-semibold mb-3 text-center">Processed Image</h2>
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <img
                src={processedImage}
                alt="Processed"
                className="max-h-full max-w-full object-contain rounded"
                onError={(e) => console.error("Image render error:", e)}
              />
            </div>
          </div>
        </div>
      ) : (
        // Centered layout before image is processed
        <div className="flex justify-center items-center h-screen">
          <Card className="w-full max-w-md h-[32rem] flex flex-col justify-between border-0 shadow-2xl bg-[#112240]/90 backdrop-blur-md text-white">
            <CardHeader className="border-b border-[#172a46] pb-4">
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-[#e8ed51] to-[#d8dd41] text-transparent bg-clip-text">
                Image Segmentation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col justify-between">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="feature-type" className="text-sm font-medium text-gray-300">
                    Select Feature Type
                  </Label>
                  <Select value={featureType} onValueChange={handleFeatureChange}>
                    <SelectTrigger className="w-full bg-[#112240]/50 border-[#2a3f63] text-gray-200 focus:border-[#e8ed51] focus:ring-[#e8ed51]/20">
                      <SelectValue placeholder="Select feature type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#112240] border-[#2a3f63] text-gray-200">
                      {featureOptions.map((option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className="hover:bg-[#e8ed51]/10 hover:text-[#e8ed51] focus:bg-[#e8ed51]/10 focus:text-[#e8ed51]"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image-upload" className="text-sm font-medium text-gray-300">
                    Upload Image
                  </Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-[#2a3f63] bg-[#112240]/50 hover:bg-[#e8ed51]/5 hover:border-[#e8ed51]/30 transition-all duration-300"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-[#e8ed51]/70" />
                        <p className="mb-2 text-sm text-gray-300">
                          <span className="font-semibold text-[#e8ed51]">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                          {selectedImage ? selectedImage.name : "No file selected"}
                        </p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full font-medium relative",
                    "bg-[#112240] hover:bg-[#172a46] text-[#e8ed51] border border-[#e8ed51]/20 hover:border-[#e8ed51]/50 transition-colors"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Process Image"
                  )}
                </Button>

                {error && (
                  <div className="p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-300">
                    {error}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
