# inference.py
import torch
import numpy as np
from PIL import Image
import segmentation_models_pytorch as smp
import torch.nn as nn

class SegmentationModel(nn.Module):
    def __init__(self, model_path):
        super(SegmentationModel, self).__init__()
        self.arc = smp.Unet(
            encoder_name='resnet50',
            encoder_weights='imagenet',
            in_channels=3,
            classes=1,
            activation=None
        )
        self.load_model(model_path)

    def load_model(self, model_path):
        self.load_state_dict(torch.load(model_path, map_location=torch.device("cpu")))
        self.eval()

    def forward(self, images):
        return self.arc(images)

def resize_image(image: Image.Image, target_size=(512, 512)):
    aspect_ratio = image.width / image.height
    if aspect_ratio > 1:
        new_width = target_size[0]
        new_height = int(new_width / aspect_ratio)
    else:
        new_height = target_size[1]
        new_width = int(new_height * aspect_ratio)

    resized_image = image.resize((new_width, new_height), Image.LANCZOS)
    new_image = Image.new("RGB", target_size, (0, 0, 0))
    paste_x = (target_size[0] - new_width) // 2
    paste_y = (target_size[1] - new_height) // 2
    new_image.paste(resized_image, (paste_x, paste_y))
    return new_image

def preprocess_image(image: Image.Image):
    if image.size == (1024, 1024):
        image = resize_image(image, (512, 512))
    image_np = np.array(image).astype("float32") / 255.0
    if len(image_np.shape) == 2:
        image_np = np.stack([image_np] * 3, axis=-1)
    image_np = np.transpose(image_np, (2, 0, 1))
    return torch.tensor(image_np).unsqueeze(0)

def infer(image: Image.Image, model_path: str):
    model = SegmentationModel(model_path)
    input_tensor = preprocess_image(image)

    with torch.no_grad():
        logits_mask = model(input_tensor)
        pred_mask = torch.sigmoid(logits_mask)
        pred_mask = (pred_mask > 0.5).float()

    pred_mask_np = pred_mask.squeeze(0).squeeze(0).cpu().numpy() * 255
    return Image.fromarray(pred_mask_np.astype(np.uint8))
