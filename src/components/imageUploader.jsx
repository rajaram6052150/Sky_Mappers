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

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || "Failed to process image.")
        return
      }

      const data = await response.json()
      console.log("Response data:", data)

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
    <div className="flex justify-center items-center min-h-screen bg-transparent p-4 w-[100vh]">
      <Card className="w-full max-w-md border-0 shadow-xl bg-[#0a192f] text-white">
        <CardHeader className="border-b border-[#172a46] pb-4">
          <CardTitle className="text-2xl font-bold text-center">Image Segmentation</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="feature-type" className="text-sm font-medium text-gray-300">
                Select Feature Type
              </Label>
              <Select value={featureType} onValueChange={handleFeatureChange}>
                <SelectTrigger className="w-full bg-[#112240] border-[#172a46] text-white">
                  <SelectValue placeholder="Select feature type" />
                </SelectTrigger>
                <SelectContent className="bg-[#112240] border-[#172a46] text-white">
                  {featureOptions.map((option) => (
                    <SelectItem key={option} value={option} className="hover:bg-[#172a46]">
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
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-[#172a46] bg-[#112240] hover:bg-[#172a46] transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">{selectedImage ? selectedImage.name : "No file selected"}</p>
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
              className={cn("w-full font-medium relative", "bg-[#e8ed51] hover:bg-[#d8dd41] text-[#0a192f]")}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Process Image</>
              )}
            </Button>
          </form>

          {error && <div className="mt-6 p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-300">{error}</div>}

          {processedImage && (
            <div className="mt-6 space-y-3">
              <h2 className="text-xl font-semibold text-gray-200">Processed Image:</h2>
              <div className="relative border rounded-lg border-[#172a46] overflow-hidden bg-[#112240] p-2">
                <img
                  src={processedImage || "/placeholder.svg"}
                  alt="Processed"
                  className="w-full rounded"
                  onError={(e) => console.error("Image render error:", e)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
