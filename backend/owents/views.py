import cv2
import numpy as np
from django.shortcuts import render
import pytesseract
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from PIL import Image
from ai_modules.llm_assistant import LLMAssistant
from ai_modules.ai_functions import read_file_smart
import os

# Windows: Set the correct path to Tesseract
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

assistant = LLMAssistant(
    api_key=read_file_smart(full_path="../common/api_key.txt"),
    starting_instructions=read_file_smart(
        full_path="../ai_modules/instructions/ReceiptSplitter/1_starting_instructions.txt")
)


def extract_text_from_receipt(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]  # Improve OCR accuracy
    text = pytesseract.image_to_string(gray, lang="bul")
    return text


class ReciteSplitting(APIView):

    def post(self, request, *args, **kwargs):
        if 'image' not in request.FILES:
            return Response({"error": "No image provided"}, status=400)

        image_file = request.FILES['image']

        image = Image.open(image_file).convert("RGB")
        image_np = np.array(image)  # Convert to NumPy array
        image_cv = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

        ocr_text = extract_text_from_receipt(image_cv)

        output = assistant.consult_once(f"The OCR text:{ocr_text}", structured_output="json")
        output["warning"] = None

        calculated_total = 0
        for item in output["items"]:
            calculated_total += item["amount"] * item["price"]

        if output["total"] is None:
            output[
                "warning"] = "The scanned receipt image was of poor quality. The total could not be calculated correctly. Please check the receipt manually."
            output["total"] = calculated_total

        if output["total"] != calculated_total:
            output["total"] = calculated_total

        return JsonResponse(output, status=status.HTTP_200_OK)