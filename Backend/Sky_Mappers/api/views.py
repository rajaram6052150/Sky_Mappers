from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from PIL import Image
import base64
import io
from rest_framework.permissions import IsAuthenticated
from .inference import infer

# Paths to segmentation models
MODEL_PATHS = {
    "building": r"E:\Sky_Mappers\Sky_Mappers\Models\Building_models\model_0.15380dice.pt",
    "road": r"E:\Sky_Mappers\Sky_Mappers\Models\Road_models\model_0.23354dice.pt",
    "waterbody": r"E:\Sky_Mappers\Sky_Mappers\Models\water_b\model_0.46557dice.pt",
    "rooftop_tiled": r"E:\Sky_Mappers\Sky_Mappers\Models\Tiled\model_0.16305dice.pt",
    "rooftop_rcc": r"E:\Sky_Mappers\Sky_Mappers\Models\RCC\model_0.14570dice.pt"
}

class ImageSegmentationAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    # permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        feature_type = request.data.get("feature_type")  # e.g., "building", "road"
        image_file = request.FILES.get("image")

        if feature_type not in MODEL_PATHS or image_file is None:
            return Response({"error": "Invalid input."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            image = Image.open(image_file).convert("RGB")
            model_path = MODEL_PATHS[feature_type]
            result_mask = infer(image, model_path)

            # Convert result mask to base64
            buffered = io.BytesIO()
            result_mask.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode()

            return Response({"processed_image": img_str})

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
